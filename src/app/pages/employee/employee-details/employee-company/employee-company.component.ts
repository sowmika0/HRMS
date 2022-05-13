import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings, DateFormat, DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { Component, OnInit } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeBaseInfo,
  EmployeeCompanyResponse,
  ReportingToResponse,
  UpdateEmployeeCompanyRequest,
} from '../employee-details.model';

import { EmployeeCard } from './../employee-details.model';
import { EmployeeService } from '../../employee.service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SelectOption } from 'src/app/app.model';
import { SelectOptionResponse } from './../../../../app.model';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-company',
  templateUrl: './employee-company.component.html',
  styleUrls: ['./employee-company.component.scss']
})
export class EmployeeCompanyComponent implements OnInit {

  role = '';
  canEdit = false;
  employeeId = '';
  optionsDone = 0;
  isProcessing = false;
  circularManager = false;
  managerList: EmployeeCard[] = [];
  employeeCompany: EmployeeCompanyResponse;
  statusOptions = SelectionConstants.statusOptions;
  datePickerOptions = DatePickerOptions.datePicker;
  divisionOptions = SelectionConstants.divisionOptions;

  departmentOptions: SelectOption[] = [];
  designationOptions: SelectOption[] = [];
  teamOptions: SelectOption[] = [];
  regionOptions: SelectOption[] = [];
  locationOptions: SelectOption[] = [];
  gradeOptions: SelectOption[] = [];
  categoryOptions: SelectOption[] = [];
  reportingToOptions: EmployeeBaseInfo[] = [];

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
  ) { }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = this.role === 'hr';
    this.employeeId = this.employeeService.getEmployeeId();
    this.icon = this.employeeService.getSectionTypeIcon('company');
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
    this.getEmployeeCompanyInfo();
    this.getRegionOptions();
    this.getReportingToEmployees();

    setTimeout(() => {
      this.getTeamOptions();
      this.getGradeOptions();
    }, 100);

    setTimeout(() => {
      this.getLocationOptions();
      this.getCategoryOptions();
    }, 400);

    setTimeout(() => {
      this.getDepartmentOptions();
      this.getDesignationOptions();
    }, 600);
  }

  getDepartmentOptions() {
    this.employeeService.getDepartmentsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.departmentOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getReportingToEmployees() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getReportingToForDropdown(payload)
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.reportingToOptions = response.employees;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getCategoryOptions() {
    this.employeeService.getCategoriesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.categoryOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getRegionOptions() {
    this.employeeService.getRegionsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.regionOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getTeamOptions() {
    this.employeeService.getTeamsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.teamOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getGradeOptions() {
    this.employeeService.getGradesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.gradeOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getDesignationOptions() {
    this.employeeService.getDesignationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.designationOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  getLocationOptions() {
    this.employeeService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
          ++this.optionsDone;
          this.parseEmployeeCompanyInfo();
        }
      });
  }

  findAccess(data: EmployeeCompanyResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeCompanyInfo() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeService.getEmployeeId()
    };

    this.employeeService.getEmployeeCompany(payload)
      .then((response: EmployeeCompanyResponse) => {
        if (response.isSuccess) {
          this.employeeCompany = response;
          this.findAccess(response);
          this.parseEmployeeCompanyInfo();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  parseEmployeeCompanyInfo() {
    setTimeout(() => {
      if (this.optionsDone === 8 && this.employeeCompany) {
        this.employeeCompany.probationDays = this.employeeCompany.employeeCode.indexOf('8') === 0 ? 0 : AppSettings.probationDays;
        this.employeeCompany.probationExtraDays = 0;
        this.employeeCompany.statusSelection = this.statusOptions.find(v => v.value === this.employeeCompany.status);
        this.employeeCompany.departmentSelection = this.departmentOptions.find(d => d.value === this.employeeCompany.departmentId);
        this.employeeCompany.designationSelection = this.designationOptions.find(d => d.value === this.employeeCompany.designationId);
        this.employeeCompany.locationSelection = this.locationOptions.find(d => d.value === this.employeeCompany.locationId);
        this.employeeCompany.regionSelection = this.regionOptions.find(d => d.value === this.employeeCompany.regionId);
        this.employeeCompany.gradeSelection = this.gradeOptions.find(d => d.value === this.employeeCompany.gradeId);
        this.employeeCompany.teamSelection = this.teamOptions.find(d => d.value === this.employeeCompany.teamId);
        this.employeeCompany.categorySelection = this.categoryOptions.find(d => d.value === this.employeeCompany.categoryId);
        this.employeeCompany.divisionSelection = this.divisionOptions.find(d => d.value === this.employeeCompany.division);
        this.employeeCompany.reportingToSelection = this.employeeCompany.reportingToId
          ? {
            employeeName: this.employeeCompany.reportingToName,
            employeeId: this.employeeCompany.reportingToId,
            employeeCode: ''
          }
          : null;
        this.probationDateChange();
        this.datePickerWorkaround();
        this.workaroundForDOJDatePicker();
      }
    }, 100);
  }

  datePickerWorkaround() {
    this.employeeCompany.confirmedOn = this.employeeCompany.confirmedOn ?
      new Date(
        moment(this.employeeCompany.confirmedOn)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      ) : '';
    // this.employeeCompany.doj = this.employeeCompany.doj ?
    //   new Date(
    //     moment(this.employeeCompany.doj)
    //       .add(10, 'hours')
    //       .format(this.datePickerOptions.dateTimeFormat)
    //   ) : '';
  }

  workaroundForDOJDatePicker() {
    // this.employeeCompany.confirmedOn = this.employeeCompany.confirmedOn ?
    //   new Date(
    //     moment(this.employeeCompany.confirmedOn)
    //       .add(10, 'hours')
    //       .format(this.datePickerOptions.dateTimeFormat)
    //   ) : '';
    this.employeeCompany.doj = this.employeeCompany.doj ?
      new Date(
        moment(this.employeeCompany.doj)
          // .add(10, 'hours')
          .format(DateFormat.shortDate)
      ) : '';
  }

  saveCompanyInfo() {
    this.circularManager = false;
    this.isProcessing = true;
    this.datePickerWorkaround();
    this.workaroundForDOJDatePicker();
    const payload: UpdateEmployeeCompanyRequest = Object.assign({}, this.employeeCompany);
    payload.employeeId = this.employeeId;
    this.employeeService.updateEmployeeCompany(payload)
      .then((response: EmployeeCompanyResponse) => {
        if (response.isSuccess) {
          if (response.isCircularManager) {
            this.circularManager = true;
            this.managerList = response.managerList;
            this.toaster.error('The selection of the manager triggers a circular reporting structure. Please see the screen for more details.');
          } else {
            this.employeeCompany = response;
            this.toaster.success('Employee company details updated successfully.');
            this.parseEmployeeCompanyInfo();
            this.employeeService.getEmployeeVerificationSubject.next();
            this.employeeCompany.reportingToSelection = {
              employeeName: this.employeeCompany.reportingToName,
              employeeId: this.employeeCompany.reportingToId,
              employeeCode: ''
            };
          }
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  probationDateChange($event = null) {
    if (this.employeeCompany.probationDays + this.employeeCompany.probationExtraDays > 0) {
      if ($event) {
        this.employeeCompany.probationEndDate =
          moment($event)
            .add(10, 'hours')
            .add(this.employeeCompany.probationDays + this.employeeCompany.probationExtraDays, 'days')
            .format(DatePickerOptions.datePicker.dateInputFormat);
      } else {
        this.employeeCompany.probationEndDate =
          moment(this.employeeCompany.doj)
            .add(10, 'hours')
            .add(this.employeeCompany.probationDays + this.employeeCompany.probationExtraDays, 'days')
            .format(DatePickerOptions.datePicker.dateInputFormat);
      }
    } else {
      this.employeeCompany.probationEndDate = this.employeeCompany.doj;
    }
  }

  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }
}
