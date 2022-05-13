import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DataTableParameters, DatePickerOptions, FileFormats, QuillConfig, SelectionConstants } from 'src/app/app.constants';
import { SelectOption, SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { ObjectToUrlService } from 'src/app/shared/services/obj-to-url-service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { UploadFile } from './../../../app.model';
import {
  Announcement,
  AnnouncementActionRequest,
  AnnouncementAttachment,
  AnnouncementDetailsResponse,
  AnnouncementFilterRequest,
  AnnouncementListResponse,
  UpdateAnnouncementRequest,
} from './../announcement.model';
import { AnnouncementService } from './../announcement.service';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss']
})
export class AnnouncementListComponent implements OnInit {

  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;
  @ViewChild('announcementModal', { static: false }) announcementModal: CustomModalComponent;
  @ViewChild('announcementViewModal', { static: false }) announcementViewModal: CustomModalComponent;

  optionsDone = 0;
  isUpdating = false;
  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;
  fileRejected = false;
  uploadingPercentage = 0;
  newAttachments: File[] = [];
  quillConfig = QuillConfig.config;
  announcements: Announcement[] = [];
  dtOptions: DataTables.Settings = {};
  publishOptions: SelectOption[] = [];
  locationOptions: SelectOption[] = [];
  newAttachmentInfo: UploadFile[] = [];
  defaultFilter: AnnouncementFilterRequest;
  announcementTypeOptions: SelectOption[] = [];
  announcementFilter: AnnouncementFilterRequest;
  activeAttachments: AnnouncementAttachment[] = [];
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  attachmentTypeOptions = SelectionConstants.attachmentTypeOptions;
  announcement: UpdateAnnouncementRequest = new UpdateAnnouncementRequest();

  fileFormats = FileFormats.allFormats;
  
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private announcementService: AnnouncementService,
    private objToUrlService: ObjectToUrlService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.defaultFilter = {
      title: '',
      date: '',
      publish: [],
      types: [],
      locations: []
    };
    this.announcementFilter = Object.assign({}, this.defaultFilter);

    this.publishOptions = [
      { label: 'Published', value: 'true' },
      { label: 'Unpublished', value: 'false' }
    ];

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 7
        },
      ]
    });

    this.getAnnouncementTypesForDropdown();
    this.setFilterParametersFromUrl();
    this.getLocationOptions();
    this.trackUploading();
  }

  private deleteAnnouncement = (item: Announcement) => {
    this.subjectService.toggleLoading(true);
    const payload: AnnouncementActionRequest = {
      announcementId: item.announcementId
    };
    this.announcementService.deleteAnnouncement(payload)
      .then((response: AnnouncementListResponse) => {
        if (response.isSuccess) {
          this.getAllAnnouncements();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  trackUploading() {
    this.subjectService.uploadingSubject.subscribe((done: number) => {
      this.uploadingPercentage = done;
    });
  }

  getAllAnnouncements() {
    this.announcementService.getAllAnnouncements(this.announcementFilter)
      .then((response: AnnouncementListResponse) => {
        if (response.isSuccess) {
          this.announcements = response.announcements;
          this.parseAnnouncementInfo();
        }
      })
  }

  parseAnnouncementInfo() {
    this.announcements.map(a => {
      a.startDateText = moment(a.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat);
      a.startDate = a.startDate ?
        new Date(a.startDateText) : '';

      a.endDateText = a.endDate ? moment(a.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
        : '';
      a.endDate = a.endDate ?
        new Date(a.endDateText) : '';

      a.dateText = moment(a.date)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat);
    });
  }

  getAnnouncementTypesForDropdown() {
    this.announcementService.getAnnouncementTypes()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.announcementTypeOptions = response.options;
          this.optionsDone++;
          this.setFilterSelections();
        }
      })
  }

  getLocationOptions() {
    this.announcementService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
          this.optionsDone++;
          this.setFilterSelections();
        }
      });
  }

  edit(item: Announcement) {
    this.isUpdating = true;
    this.fileRejected = false;
    this.getAnnouncementDetails(item.announcementId, 'edit');
  }

  getAnnouncementDetails(announcementId: string, type: string) {
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

          setTimeout(() => {
            if (type === 'edit') {
              this.announcementModal.showModal();
            } else {
              this.announcementViewModal.showModal();
            }
          }, 100);
        }
      })
      .catch(() => {
        if (type === 'edit') {
          this.announcementModal.hideModal();
        } else {
          this.announcementViewModal.hideModal();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  onLocationSelect(items: SelectOption[]) {
    if (items) {
      this.announcement.locations = items.map(v => v.value);
    } else {
      this.announcement.locations = [];
    }
  }

  addNewAnnouncement(form: NgForm) {
    this.isUpdating = false;
    if (form) {
      form.reset();
    }
    this.fileRejected = false;
    this.announcement = new UpdateAnnouncementRequest();
    this.announcement.attachments = [];
    this.announcementModal.showModal();
  }

  startDateSelected($event) {
    if ($event && this.announcement.endDate) {
      if (moment(this.announcement.endDate) < moment($event)) {
        this.announcement.endDate = null;
      }
    }
  }

  endDateSelected($event) {
    if ($event && this.announcement.startDate) {
      if (moment(this.announcement.startDate) > moment($event)) {
        this.announcement.startDate = null;
      }
    }
  }

  updateAnnouncement(form: NgForm) {
    this.fileRejected = false;
    this.isProcessing = true;
    this.announcementService.updateAnnouncement(this.announcement, this.newAttachmentInfo)
      .then((response: AnnouncementListResponse) => {
        if (response.isSuccess) {
          this.uploadingPercentage = 0;
          this.announcement = new UpdateAnnouncementRequest();
          this.getAllAnnouncements();
          form.reset();
          this.newAttachmentInfo = [];
          this.announcementModal.hideModal();
          this.toaster.success('The announcement details are successfully updated.');
        }
      })
      .finally(() => { this.isProcessing = false });
  }

  onFileSelected(files: any) {
    if (files.rejectedFiles.length > 0) {
      this.fileRejected = true;
    }

    let isWrongExtension = false;
    files.addedFiles.map(f => {
      var count = (f.name.match(/\./g) || []).length;
      if (count > 1) {
        this.fileRejected = true;
        isWrongExtension = true;
      }
    });

    if (!isWrongExtension) {
      files.addedFiles.map(f => {
        this.newAttachmentInfo.push({
          file: f,
          name: '',
          type: 'Document',
          isNew: true,
          typeSelection: this.attachmentTypeOptions.find(a => a.value === 'Document')
        });
      });
    }
  }

  removeExistingFile(item: AnnouncementAttachment) {
    item.isActive = false;
    this.activeAttachments = this.announcement.attachments.filter(i => i.isActive);
  }

  removeUploadedFile(item: UploadFile) {
    this.newAttachmentInfo = this.newAttachmentInfo.filter(i => i !== item);
  }

  viewPreview(announcement: Announcement) {
    this.announcement = new UpdateAnnouncementRequest();
    this.getAnnouncementDetails(announcement.announcementId, 'view');
  }

  deleteAnnouncementAlert(item: Announcement) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Announcement?',
      content: [
        'Are you sure you want to delete the announcement? Once the announcement is deleted, it will not be displayed for any employees.',
        'If you want to only hide the announcement from employees, uncheck the Publish checkbox in the announcement details.',
        'Once this action is done, it cannot be undone.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Announcement',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.deleteAnnouncement,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }

    return item;
  }

  showFilters() {
    this.filterModal.showModal();
  }

  applyFilter() {
    const filter = Object.assign({}, this.announcementFilter);
    filter.date = filter.date && filter.date !== ''
      ? moment(filter.date)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : null;

    filter.locationSelection = [];
    filter.typesSelection = [];
    filter.publishSelection = [];
    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.announcementFilter);
    this.getAllAnnouncements();
    this.filterModal.hideModal();
  }

  clearFilter(form: NgForm) {
    this.announcementFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.announcementFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAllAnnouncements();
    this.filterModal.hideModal();
  }

  setFilterParametersFromUrl() {
    this.announcementFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.announcementFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.announcementFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections() {

    if (this.optionsDone === 2) {
      this.announcementFilter.date =
        this.announcementFilter.date && this.announcementFilter.date !== ''
          ? new Date(moment(this.announcementFilter.date)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat))
          : '';

      this.announcementFilter.locationSelection =
        this.locationOptions.filter(f => this.announcementFilter.locations.find(d => d === f.value));

      this.announcementFilter.typesSelection =
        this.announcementTypeOptions.filter(f => this.announcementFilter.types.find(d => d === f.value));

      this.announcementFilter.publishSelection =
        this.publishOptions.filter(f => this.announcementFilter.publish.find(d => d.toString() === f.value));

      this.getAllAnnouncements();
    }
  }
}
