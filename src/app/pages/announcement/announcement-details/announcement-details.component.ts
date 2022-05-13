import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { SelectOption, SelectOptionResponse } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import {
  AnnouncementActionRequest,
  AnnouncementAttachment,
  AnnouncementDetailsResponse,
  UpdateAnnouncementRequest,
} from '../announcement.model';
import { AnnouncementService } from '../announcement.service';

@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.scss']
})
export class AnnouncementDetailsComponent implements OnInit {

  announcementId = '';
  showAnnouncementDetails = false;
  locationOptions: SelectOption[] = [];
  announcementTypeOptions: SelectOption[] = [];
  activeAttachments: AnnouncementAttachment[] = [];
  datePickerOptions = DatePickerOptions.datePicker;
  attachmentTypeOptions = SelectionConstants.attachmentTypeOptions;
  announcement: UpdateAnnouncementRequest = new UpdateAnnouncementRequest();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private announcementService: AnnouncementService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id && params.id !== '') {
        this.announcementId = params.id;
        this.getLocationOptions();
        this.getAnnouncementTypesForDropdown();
        this.getAnnouncementDetails(this.announcementId);
      }
    });
  }

  getLocationOptions() {
    this.announcementService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
          if (this.announcement.locations) {
            this.announcement.locationSelections = this.locationOptions.filter(l => this.announcement.locations.find(a => a === l.value));
          }
        }
      });
  }

  getAnnouncementTypesForDropdown() {
    this.announcementService.getAnnouncementTypes()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.announcementTypeOptions = response.options;
          if (this.announcement.announcementType) {
            this.announcement.announcementTypeSelection = this.announcementTypeOptions.find(a => a.value === this.announcement.announcementType);
          }
        }
      })
  }

  getAnnouncementDetails(announcementId: string) {
    this.subjectService.toggleLoading(true);
    const payload: AnnouncementActionRequest = {
      announcementId: announcementId
    };
    this.announcementService.getAnnouncementDetails(payload)
      .then((response: AnnouncementDetailsResponse) => {
        if (response.isSuccess) {
          this.announcement = Object.assign({}, response);
          this.announcement.announcementTypeSelection = this.announcementTypeOptions.find(a => a.value === this.announcement.announcementType);
          this.announcement.locationSelections = this.locationOptions.filter(l => this.announcement.locations.find(a => a === l.value));
          this.activeAttachments = this.announcement.attachments.filter(i => i.isActive);
          this.activeAttachments.map(a => {
            a.fileUrl = this.appService.fileBaseUrl + a.fileUrl;
            a.type = a.type ? a.type : 'Document';
            a.typeSelection = this.attachmentTypeOptions.find(v => v.value === a.type);
          });
          this.announcement.startDate =
            this.announcement.startDate
              ? new Date(moment(this.announcement.startDate)
                .add(10, 'hours')
                .format(this.datePickerOptions.dateTimeFormat)) : '';
          this.announcement.endDate =
            this.announcement.endDate
              ? new Date(moment(this.announcement.endDate)
                .add(10, 'hours')
                .format(this.datePickerOptions.dateTimeFormat)) : '';
          this.announcement.date =
            this.announcement.date
              ? new Date(moment(this.announcement.date)
                .add(10, 'hours')
                .format(this.datePickerOptions.dateTimeFormat)) : '';
          this.announcement.dateText = moment(this.announcement.date)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateInputFormat);

          setTimeout(() => { this.showAnnouncementDetails = true; }, 100);
        }
      })
      .catch(() => {

      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }
}
