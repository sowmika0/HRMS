import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, RegEx } from 'src/app/app.constants';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeeStatutoryResponse,
  UpdateEmployeeStatutoryRequest,
} from '../employee-details.model';

import { BaseResponse } from 'src/app/app.model';
import { EmployeeService } from '../../employee.service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-statutory',
  templateUrl: './employee-statutory.component.html',
  styleUrls: ['./employee-statutory.component.scss']
})
export class EmployeeStatutoryComponent implements OnInit {

  role = '';
  regex = RegEx;
  canEdit = false;
  employeeId = '';
  isProcessing = false;
  employeeStatutory: EmployeeStatutoryResponse;
  datePickerOptions = DatePickerOptions.datePicker;
  loggedInUserScreen = true;
  haveAccess: boolean = false;
  icon = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
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
    this.icon = this.employeeService.getSectionTypeIcon('statutory');
    this.getEmployeeStatutoryInfo();
  }

  findAccess(data: EmployeeStatutoryResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeStatutoryInfo() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeService.getEmployeeId()
    };

    this.employeeService.getEmployeeStatutory(payload)
      .then((response: EmployeeStatutoryResponse) => {
        if (response.isSuccess) {
          this.employeeStatutory = response;
          this.findAccess(response);
          this.datePickerWorkaround();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  updateStatutoryDetails() {
    this.isProcessing = true;
    this.datePickerWorkaround();
    const payload: UpdateEmployeeStatutoryRequest = Object.assign({}, this.employeeStatutory);
    payload.employeeId = this.employeeId;
    this.employeeService.updateEmployeeStatutory(payload)
      .then((response: EmployeeStatutoryResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Employee statutory details updated successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.employeeStatutory = response;
          this.datePickerWorkaround();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  datePickerWorkaround() {
    this.employeeStatutory.passportValidity = this.employeeStatutory.passportValidity ?
      new Date(
        moment(this.employeeStatutory.passportValidity)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      ) : '';

    this.employeeStatutory.drivingLicenseValidity = this.employeeStatutory.drivingLicenseValidity ?
      new Date(
        moment(this.employeeStatutory.drivingLicenseValidity)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      ) : '';
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'statutory'
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
