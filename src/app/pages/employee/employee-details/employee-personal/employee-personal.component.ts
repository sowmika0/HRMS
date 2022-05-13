import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeePersonalResponse,
  UpdateEmployeePersonalRequest,
} from '../employee-details.model';

import { AppService } from 'src/app/app.service';
import { BaseResponse } from 'src/app/app.model';
import { EmployeeService } from '../../employee.service';
import { FileFormats } from './../../../../app.constants';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-personal',
  templateUrl: './employee-personal.component.html',
  styleUrls: ['./employee-personal.component.scss']
})
export class EmployeePersonalComponent implements OnInit {

  role = '';
  canEdit = false;
  photoFile: File;
  employeeId = '';
  today = new Date();
  isProcessing = false;
  photoRejected = false;
  employeePersonal: EmployeePersonalResponse;
  datePickerOptions = DatePickerOptions.datePicker;
  bloodGroupOptions = SelectionConstants.bloodGroupOptions;
  nationalityOptions = SelectionConstants.nationalityOptions;
  maritalStatusOptions = SelectionConstants.maritalStatusOptions;
  maxDate = new Date(moment().add(-18, 'years').format(DatePickerOptions.datePicker.dateTimeFormat));

  fileFormats = FileFormats.images;
  loggedInUserScreen = true;
  haveAccess: boolean = false;
  icon = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private appService: AppService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = this.role === 'hr' || this.role === 'self';
    this.employeeId = this.employeeService.getEmployeeId();
    this.icon = this.employeeService.getSectionTypeIcon('personal');
    this.getEmployeePersonalInfo();
  }

  findAccess(data: EmployeePersonalResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeePersonalInfo() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };

    this.employeeService.getEmployeePersonal(payload)
      .then((response: EmployeePersonalResponse) => {
        if (response.isSuccess) {
          this.parseEmployeePersonalResult(response);
          this.findAccess(response);
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  parseEmployeePersonalResult(response: EmployeePersonalResponse) {
    this.employeePersonal = response;
    if (this.employeePersonal.photoLinkUrl) {
      this.employeePersonal.photoLinkUrl = this.appService.fileBaseUrl.replace('/hrms', '') + this.employeePersonal.photoLinkUrl;
    }
    this.employeePersonal.gender = this.employeePersonal.gender ? this.employeePersonal.gender : 'Male';
    this.employeePersonal.bloodGroupSelection
      = this.bloodGroupOptions.find(v => v.value === this.employeePersonal.bloodGroup);
    this.employeePersonal.maritalStatusSelection
      = this.maritalStatusOptions.find(v => v.value === this.employeePersonal.maritalStatus);
    this.employeePersonal.nationalitySelection
      = this.nationalityOptions.find(v => v.value === this.employeePersonal.nationality);

    this.datePickerWorkaround();
  }

  datePickerWorkaround() {
    this.employeePersonal.recordDob = this.employeePersonal.recordDob ? new Date(
      moment(this.employeePersonal.recordDob)
        // .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)
    ) : '';

    this.employeePersonal.actualDob = this.employeePersonal.actualDob ? new Date(
      moment(this.employeePersonal.actualDob)
        // .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)
    ) : '';

    this.employeePersonal.marriageDate = this.employeePersonal.marriageDate ?
      new Date(
        moment(this.employeePersonal.marriageDate)
          // .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      ) : '';
  }

  savePersonalInfo() {
    this.isProcessing = true;
    const payload: UpdateEmployeePersonalRequest = Object.assign({ age: 0 }, this.employeePersonal);
    payload.employeeId = this.employeeId;
    this.employeeService.updateEmployeePersonal(payload, this.photoFile)
      .then((response: EmployeePersonalResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Employee personal details updated successfully.');
          this.parseEmployeePersonalResult(response);
          this.employeeService.getEmployeeVerificationSubject.next();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  onPhotoSelected(event: any) {
    if (event.rejectedFiles.length > 0) {
      this.photoRejected = true;
    } else {
      this.photoRejected = false;
    }
    this.photoFile = undefined;

    let isWrongExtension = false;
    event.addedFiles.map(f => {
      var count = (f.name.match(/\./g) || []).length;
      if (count > 1) {
        this.photoRejected = true;
        isWrongExtension = true;
      }
    });

    if (!isWrongExtension) {
      this.photoFile = undefined;
      setTimeout(() => { this.photoFile = event.addedFiles[0]; }, 100);
    }
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'personal'
    };
    this.employeeService.verifyEmployeeDataUpdate(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.employeeService.getEmployeeVerificationSubject.next();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }
}
