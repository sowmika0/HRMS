import * as _ from 'lodash';
import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import {
  Appraisal,
  EmployeeActionRequest,
  EmployeeAppraisalResponse,
  EmployeeReportingTo,
  GetEmployeeReportingToResponse,
} from '../employee-details.model';
import { AppraisalRating, GetAppraisalRatingResponse } from 'src/app/pages/appraisal/appraisal.model';
import { Component, Input, OnInit } from '@angular/core';
import { EmployeeDocument, SubmitAppraisalRequest } from './../employee-details.model';

import { AppService } from './../../../../app.service';
import { DatePickerOptions } from 'src/app/app.constants';
import { EmployeeService } from '../../employee.service';
import { LocalStorageService } from './../../../../shared/services/local-storage-service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-appraisal',
  templateUrl: './employee-appraisal.component.html',
  styleUrls: ['./employee-appraisal.component.scss']
})
export class EmployeeAppraisalComponent implements OnInit {

  icon = '';
  isHr = false;
  isSelf = false;
  employeeId = '';
  currentAppraisal: Appraisal;
  allAppraisals: Appraisal[] = [];
  ratings: AppraisalRating[] = [];
  documents: EmployeeDocument[] = [];
  previousAppraisals: Appraisal;
  employeesReporting: EmployeeReportingTo[] = [];
  hrPendingAppraisals: EmployeeReportingTo[] = [];
  employeesReportingDirectly: EmployeeReportingTo[] = [];
  employeesReportingIndirectly: EmployeeReportingTo[] = [];
  isAllowed = false;

  loggedInUserScreen = true;
  haveAccess: boolean = false;
  role = '';

  @Input("employeeId") reportEmployeeId: string = '';
  @Input("source") source: string = '';
  @Input("appraisalMode") appraisalMode: number;
  @Input("appraisalId") appraisalId: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService,
    private appService: AppService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.icon = this.employeeService.getSectionTypeIcon('appraisal');
    this.role = this.employeeService.getCurrentUserRole();
    if(this.source === 'report'){
      this.employeeId = this.reportEmployeeId;
    }
    else {
      this.employeeId = this.employeeService.getEmployeeId();
    }
    const loggedInEmployeeInfo = this.localStorageService.getLoggedInUserInfo();

    this.isSelf = this.employeeId == loggedInEmployeeInfo.employeeId;
    this.isHr = loggedInEmployeeInfo.role === 'HR';
    if(this.source === 'report'){
      this.getEmployeeAppraisalReport();
    }
    else{
      this.getEmployeeAppraisalDetails();
    }
    
    this.getAppraisalRatings();
    this.getAppraisalAsManager();

    if (this.isHr) {
      this.getHrPendingAppraisals();
    }
  }

  getAppraisalRatings() {
    this.employeeService.getAppraisalRatings()
      .then((response: GetAppraisalRatingResponse) => {
        if (response.isSuccess) {
          this.ratings = response.appraisalRatings;
        }
      })
  }

  getAppraisalAsManager() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeReportingTo(payload)
      .then((response: GetEmployeeReportingToResponse) => {
        if (response.isSuccess) {
          this.employeesReporting = response.employees;
          this.employeesReporting.map(e => {

            e.appraisalMode === 1 ? e.selfFilledOn = e.selfObjectiveFilledOn : e.appraisalMode === 2 ? e.selfFilledOn = e.selfVariableFilledOn : e.selfFilledOn;
            e.appraisalMode === 1 ? e.managerFilledOn = e.managerObjectiveFilledOn : e.appraisalMode === 2 ? e.managerFilledOn = e.managerVariableFilledOn : e.managerFilledOn;
            e.appraisalMode === 1 ? e.l2FilledOn = e.l2ObjectiveFilledOn : e.appraisalMode === 2 ? e.l2FilledOn = e.l2VariableFilledOn : e.l2FilledOn;
            e.appraisalMode === 1 ? e.hrFilledOn = e.hrObjectiveFilledOn : e.appraisalMode === 2 ? e.hrFilledOn = e.hrVariableFilledOn : e.hrFilledOn;


            e.selfFilledOnText = e.selfFilledOn
              ? moment.utc(e.selfFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.managerFilledOnText = e.managerFilledOn
              ? moment.utc(e.managerFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.l2FilledOnText = e.l2FilledOn
              ? moment.utc(e.l2FilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.hrFilledOnText = e.hrFilledOn
              ? moment.utc(e.hrFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';
          });
          this.employeesReportingDirectly = this.employeesReporting.filter(e => e.isReportingToMe);
          this.employeesReportingIndirectly = this.employeesReporting.filter(e => !e.isReportingToMe);
        }
      })
  }

  getHrPendingAppraisals() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getAllAppraisalsPendingWithHr(payload)
      .then((response: GetEmployeeReportingToResponse) => {
        if (response.isSuccess) {
          this.hrPendingAppraisals = response.employees;
          this.hrPendingAppraisals.map(e => {

            e.appraisalMode === 1 ? e.selfFilledOn = e.selfObjectiveFilledOn : e.appraisalMode === 2 ? e.selfFilledOn = e.selfVariableFilledOn : e.selfFilledOn;
            e.appraisalMode === 1 ? e.managerFilledOn = e.managerObjectiveFilledOn : e.appraisalMode === 2 ? e.managerFilledOn = e.managerVariableFilledOn : e.managerFilledOn;
            e.appraisalMode === 1 ? e.l2FilledOn = e.l2ObjectiveFilledOn : e.appraisalMode === 2 ? e.l2FilledOn = e.l2VariableFilledOn : e.l2FilledOn;
            e.appraisalMode === 1 ? e.hrFilledOn = e.hrObjectiveFilledOn : e.appraisalMode === 2 ? e.hrFilledOn = e.hrVariableFilledOn : e.hrFilledOn;


            e.selfFilledOnText = e.selfFilledOn
              ? moment.utc(e.selfFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.managerFilledOnText = e.managerFilledOn
              ? moment.utc(e.managerFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.l2FilledOnText = e.l2FilledOn
              ? moment.utc(e.l2FilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.hrFilledOnText = e.hrFilledOn
              ? moment.utc(e.hrFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';
          });
        }
      })
  }

  findAccess(data: EmployeeAppraisalResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeAppraisalDetails() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeAppraisalDetails(payload)
      .then((response: EmployeeAppraisalResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.allAppraisals = response.appraisals;
          this.isAllowed = response.isAllowed;
          this.currentAppraisal = this.allAppraisals.find(a => a.isActive && moment(a.startDate) <= moment() && moment(a.endDate) >= moment());
          console.log('current appraisal ', this.currentAppraisal);
          var prevAppraisals = this.allAppraisals.filter(a => a !== this.currentAppraisal);
          var prevAppraisal = _.orderBy(prevAppraisals, ['endDate'], 'desc')[0];
          this.previousAppraisals = prevAppraisal;
          this.documents = response.appraisalObjectiveDocuments;

        }
      })
      .finally(() => { this.subjectService.toggleLoading(false) });
  }

  getEmployeeAppraisalReport() {
    this.subjectService.toggleLoading(true);
    const payload: SubmitAppraisalRequest = {
      employeeId: this.employeeId,
      employeeAppraisalId: this.appraisalId,
      isSelf: false,
      appraisalMode: this.appraisalMode
    };
    this.employeeService.getEmployeeAppraisalReport(payload)
      .then((response: EmployeeAppraisalResponse) => {
        if (response.isSuccess) {
          this.isAllowed = response.isAllowed;
          this.allAppraisals = response.appraisals;
          this.currentAppraisal = this.allAppraisals && this.allAppraisals.length > 0 && this.allAppraisals[0];
          //this.previousAppraisals = this.allAppraisals.filter(a => a !== this.currentAppraisal);
          this.documents = response.appraisalObjectiveDocuments;

        }
      })
      .finally(() => { this.subjectService.toggleLoading(false) });
  }

  view(document: EmployeeDocument) {
    const url = this.appService.fileBaseUrl + document.fileUrl.replace('hrms/', '');
    window.open(url, "_blank");
  }
}
