import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataTableParameters, DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import {
  CreateEmployeeRequest,
  Employee,
  EmployeeListFilterRequest,
  EmployeeListResponse,
} from '../../employee/employee-details/employee-details.model';
import { ReportsService } from '../reports.service';
import { SelectOption } from '../../../app.model';
import { LocalStorageService } from '../../../shared/services/local-storage-service';
import { ObjectToUrlService } from '../../../shared/services/obj-to-url-service';
import * as moment from 'moment';
import { IAddExitReport, IEmployeeBirthDayReport, IEmployeeObjective, IHeadCount, IReport } from '../reports.model';
import { EmployeeService } from '../../employee/employee.service';
import { NgForm } from '@angular/forms';
import { getExportOptions } from 'src/app/shared/utils/getExportOptions';
import { ThumbnailsMode } from '@ngx-gallery/core';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {

  filtersDone = 0;
  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;
  isUpdating = false;
  datePickerOptions = DatePickerOptions.datePicker;
  employees: Employee[] = [];
  employeeBirthDayReports: IEmployeeBirthDayReport[] = [];
  genericReports: any = [];
  // genericReports: IReport[] = [];
  addExitReport: IAddExitReport = {};
  objectiveReport: IEmployeeObjective = {};
  headCountDivisionTotal: IHeadCount = {};
  headCountGradeTotal: IHeadCount = {};
  headCountDepartmentTotal: IHeadCount = {};
  headCountLocationTotal: IHeadCount = {};

  isEmailAlreadyAdded = false;
  gradeOptions: SelectOption[] = [];
  employeeRoles: SelectOption[] = [];
  dtOptions: DataTables.Settings = {};
  locationOptions: SelectOption[] = [];
  departmentOptions: SelectOption[] = [];
  designationOptions: SelectOption[] = [];
  monthOptions: SelectOption[] = SelectionConstants.monthOptions;
  yearOptions: SelectOption[] = [];
  roles = SelectionConstants.statusOptions;
  defaultFilter: EmployeeListFilterRequest;
  employeeFilter: EmployeeListFilterRequest;
  statusOptions = SelectionConstants.statusOptions;
  alertData: SweetAlertValue = new SweetAlertValue();
  newEmployee: CreateEmployeeRequest = new CreateEmployeeRequest();
  reportTypeOptions: SelectOption[] = SelectionConstants.reportTypeOptions;
  selectedReportType: string;
  selectedReportTypeLabel: string;
  isLoading: boolean;
  isGenericReport: boolean = false;
  dontShowToDateInFiter: boolean = false;
  dontShowFromDateInFiter: boolean = false;
  dontShowFromDatePickerInFiter: boolean = false;
  fromDateLabel: string = 'From Date';
  selectedMonthInReport: string = '';
  selectedYearInReport: string = '';

  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private reportsService: ReportsService,
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private objToUrlService: ObjectToUrlService
  ) { }

  ngOnInit() {
    this.defaultFilter = {
      code: '',
      departments: [],
      designations: [],
      emailId: '',
      grades: [],
      locations: [],
      name: '',
      phoneNumber: '',
      roles: [],
      status: [],
      FromDate: this.selectedReportType === 'Headcount' ? new Date() : '',
      // ToDate: new Date('02-01-2021')
    };
    this.selectedReportTypeLabel = 'Employee Birthday';
    this.selectedReportType = 'EmployeeBirthday';

    this.dontShowToDateInFiter = true;
    this.dontShowFromDateInFiter = false;
    this.dontShowFromDatePickerInFiter = true;
    this.fromDateLabel = 'Birthday Month';

    const todayDate = new Date();
    const currentYear = todayDate.getFullYear();
    const tillYear = currentYear - 6;
    console.log('currentYear', currentYear, currentYear - 6)
    for (var i = tillYear; i <= currentYear; i++) {
      this.yearOptions.push({
        label: i.toString(),
        value: i.toString()
      });
    }

    console.log('yera options', this.yearOptions)

    this.isGenericReport = true;
    this.employeeFilter = Object.assign({}, this.defaultFilter);
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
      ],
      // order: [[6, "asc"]],
      search: true,
      searching: true,
      // lengthMenu: [[20, 25, 50], [20, 25, 50]],
      ...getExportOptions({ fileName: this.selectedReportType })
    });

    this.getDepartmentOptions();
    this.setFilterParametersFromUrl();
    this.getEmployeeBirthDayReport()

    setTimeout(() => {
      this.getGradeOptions();
      this.getRolesForCompany();
    }, 100);

    setTimeout(() => {
      this.getDesignationOptions();
      this.getLocationOptions();
    }, 200);
  }

  updateDateFromMonth(event: any) {
    this.selectedMonthInReport = event.label;
    this.employeeFilter.FromDate = `${event.value}-01-2021`
  }

  updateDateFromYear(event: any) {
    this.selectedYearInReport = event.label;
    this.employeeFilter.FromDate = `01-01-${event.value}`
  }


  onChangeReportType(event: any, canReset: boolean) {
    if (canReset) {
      this.clearFilterFromReport()
    }
    this.selectedReportType = event.value;
    this.selectedReportTypeLabel = event.label;
    const genericReports = ['EmployeeBirthday', 'EmployeeAnniversary']
    const withoutToDateReports = ['EmployeeBasicInformation', 'Headcount', 'EmployeeBirthday', 'EmployeeAnniversary', 'ObjectiveAppraisalStatusReport']
    const withoutFromDateReports = ['EmployeeBasicInformation'];
    const withoutFromDatePickerReports = ['EmployeeBirthday', 'EmployeeAnniversary'];
    const fromDateLabelConfig = {
      'Headcount': 'As On',
      'EmployeeAnniversary': 'Anniversary Month',
      'EmployeeBirthday': 'Birthday Month',
      'ObjectiveAppraisalStatusReport': 'Select Year',
    }
    this.isGenericReport = genericReports.includes(event.value);
    this.dontShowToDateInFiter = withoutToDateReports.includes(event.value);
    this.dontShowFromDateInFiter = withoutFromDateReports.includes(event.value);
    this.dontShowFromDatePickerInFiter = withoutFromDatePickerReports.includes(event.value);
    this.fromDateLabel = fromDateLabelConfig[event.value] || 'From Date';
    if (event.value === 'EmployeeBirthday') {
      this.getEmployeeBirthDayReport()
    } else if (event.value === 'Headcount') {
      this.getHeadCountReport()
    } else if (event.value === 'EmployeeAnniversary') {
      this.getEmployeeAnniversaryReport()
    } else if (event.value === 'AdditionExitInformation') {
      this.getAddAndExitReport()
    } else if (event.value === 'EmployeeProbation') {
      this.getEmployeeProbationReport()
    } else if (event.value === 'ResignationEmployee') {
      this.getEmployeeResignedReport()
    } else if (event.value === 'ObjectiveAppraisalStatusReport') {
      this.getEmployeeObectiveReport()
    } else if (event.value === 'EmployeeCTC') {
      this.getEmployeeCTCReport()
    }
    else if (event.value === 'EmployeeBasicInformation') {
      this.getEmployeeBasicReport()
    } else {
      this.genericReports = []
    }
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
      ],
      // order: [[6, "asc"]],
      search: true,
      searching: true,
      // lengthMenu: [[20, 25, 50], [20, 25, 50]],
      ...getExportOptions({ fileName: this.selectedReportType })
    });
  }

  updateLoading(updating) {
    this.isLoading = updating;
    this.subjectService.toggleLoading(updating);
  }

  getEmployeeResignedReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeResignedReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = response.employeeresignedDetails;
        }
        this.genericReports.map(t => {
          t.formattedDateOfResignation = moment.utc(t.dateofResignation).local().format(DatePickerOptions.datePicker.dateInputFormat);
          t.formattedDateOfConfirmation = moment.utc(t.dateOfConfirmation).local().format(DatePickerOptions.datePicker.dateInputFormat);
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getEmployeeObectiveReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeObectiveReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.objectiveReport = response;
          this.genericReports = [response];
          this.objectiveReport.employeeObjectiveDetails.map(t => {
            t.formattedSelfSubmitted = t.selfSubmitted ? moment.utc(t.selfSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
            t.formattedRmSubmitted = t.rmSubmitted ? moment.utc(t.rmSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
            t.formattedHodSubmitted = t.hodSubmitted ? moment.utc(t.hodSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
          });
          this.objectiveReport.employeeVariableBonusDetails.map(t => {
            t.formattedSelfSubmitted = t.selfSubmitted ? moment.utc(t.selfSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
            t.formattedRmSubmitted = t.rmSubmitted ? moment.utc(t.rmSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
            t.formattedHodSubmitted = t.hodSubmitted ? moment.utc(t.hodSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
          });
          this.objectiveReport.employeeAppraisalDetails.map(t => {
            t.formattedSelfSubmitted = t.selfSubmitted ? moment.utc(t.selfSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
            t.formattedRmSubmitted = t.rmSubmitted ? moment.utc(t.rmSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
            t.formattedHodSubmitted = t.hodSubmitted ? moment.utc(t.hodSubmitted).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
          });
        }
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getEmployeeCTCReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeCTCReport(this.employeeFilter)
      .then((response: any) => {
        console.log('in CTS', response)
        if (response.isSuccess) {
          this.genericReports = response.employeeCTCDetails;
        }
        this.genericReports.map(t => {
          t.formattedDateofJoing = t.dateofJoing ? moment.utc(t.dateofJoing).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getEmployeeBirthDayReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeBirthDayReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = response.employeeRptBday;
        }
        this.genericReports.map(t => {
          t.formattedBirthDate = t.bdayDate ? moment.utc(t.bdayDate).local().format(DatePickerOptions.datePicker.dateInputFormatWOYear) : '';
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  reportingSearchFunction() {
    console.log('need to check this..')
  }

  getEmployeeBasicReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeBasicReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = response.employeebasicDetails;
        }
        this.genericReports.map(t => {
          t.formattedDateofJoing = t.dateofJoing ? moment.utc(t.dateofJoing).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getEmployeeAnniversaryReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeAnniversaryReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = response.employeeRptWday;
        }
        this.genericReports.map(t => {
          const eventDate = t.bdayDate || t.wdayDate;
          t.formattedBirthDate = eventDate ? moment.utc(eventDate).local().format(DatePickerOptions.datePicker.dateInputFormatWOYear) : '';
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getEmployeeProbationReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getEmployeeProbationReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = response.probationDetails;
        }
        this.genericReports.map(t => {
          t.formattedDateofJoing = t.dateofJoing ? moment.utc(t.dateofJoing).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
          t.formattedConfirmationDueDate = t.confirmationDueDate ? moment.utc(t.confirmationDueDate).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
          t.formattedConfirmationDueDateExtended = t.confirmationDueDateExtended ? moment.utc(t.confirmationDueDateExtended).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getTotalAccumulation(reports: IHeadCount[], item: string) {
    return reports.reduce(function (acc, obj) { return acc + obj[item]; }, 0);
  }

  getHeadCountReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getHeadCountReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = response;
          this.headCountDivisionTotal = {
            casualorTemp: this.getTotalAccumulation(response.divisionWiseRptHeadCount, 'casualorTemp'),
            expatriate: this.getTotalAccumulation(response.divisionWiseRptHeadCount, 'expatriate'),
            offRollCount: this.getTotalAccumulation(response.divisionWiseRptHeadCount, 'offRollCount'),
            onRollCount: this.getTotalAccumulation(response.divisionWiseRptHeadCount, 'onRollCount'),
            trainee: this.getTotalAccumulation(response.divisionWiseRptHeadCount, 'trainee'),
            type: "Total"
          };
          this.headCountGradeTotal = {
            casualorTemp: this.getTotalAccumulation(response.gradeWiseRptHeadCount, 'casualorTemp'),
            expatriate: this.getTotalAccumulation(response.gradeWiseRptHeadCount, 'expatriate'),
            offRollCount: this.getTotalAccumulation(response.gradeWiseRptHeadCount, 'offRollCount'),
            onRollCount: this.getTotalAccumulation(response.gradeWiseRptHeadCount, 'onRollCount'),
            trainee: this.getTotalAccumulation(response.gradeWiseRptHeadCount, 'trainee'),
            type: "Total"
          };
          this.headCountDepartmentTotal = {
            casualorTemp: this.getTotalAccumulation(response.departmentWiseRptHeadCount, 'casualorTemp'),
            expatriate: this.getTotalAccumulation(response.departmentWiseRptHeadCount, 'expatriate'),
            offRollCount: this.getTotalAccumulation(response.departmentWiseRptHeadCount, 'offRollCount'),
            onRollCount: this.getTotalAccumulation(response.departmentWiseRptHeadCount, 'onRollCount'),
            trainee: this.getTotalAccumulation(response.departmentWiseRptHeadCount, 'trainee'),
            type: "Total"
          };
          this.headCountLocationTotal = {
            casualorTemp: this.getTotalAccumulation(response.locationWiseRptHeadCount, 'casualorTemp'),
            expatriate: this.getTotalAccumulation(response.locationWiseRptHeadCount, 'expatriate'),
            offRollCount: this.getTotalAccumulation(response.locationWiseRptHeadCount, 'offRollCount'),
            onRollCount: this.getTotalAccumulation(response.locationWiseRptHeadCount, 'onRollCount'),
            trainee: this.getTotalAccumulation(response.locationWiseRptHeadCount, 'trainee'),
            type: "Total"
          };
        }
        this.genericReports.map(t => {
          t.formattedBirthDate = moment.utc(t.bdayDate).local().format(DatePickerOptions.datePicker.dateInputFormat);
        });
        this.updateLoading(false);
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getAddAndExitReport() {
    this.genericReports = [];
    this.updateLoading(true);
    this.reportsService.getAddAndExitReport(this.employeeFilter)
      .then((response: any) => {
        if (response.isSuccess) {
          this.genericReports = [response];
          this.addExitReport = response;
        }
        this.addExitReport.additionDetails.map(t => {
          t.formattedDate = t.addExitDate ? moment.utc(t.addExitDate).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
        });

        this.addExitReport.exitDetails.map(t => {
          t.formattedDate = t.addExitDate ? moment.utc(t.addExitDate).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
        });

        this.updateLoading(false);
      })
      .catch(() => {
        this.updateLoading(false);
      })
  }

  getRolesForCompany() {
    this.employeeService.getRolesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.employeeRoles = response.options;
        }
      });
  }

  getAllEmployees() {
    this.employees = [];
    this.updateLoading(true);
    this.employeeService.getAllEmployees(this.employeeFilter)
      .then((response: EmployeeListResponse) => {
        if (response.isSuccess) {
          this.employees = response.employees;
        }
      })
      .finally(() => {
        this.updateLoading(false);
      })
  }

  getDepartmentOptions() {
    this.employeeService.getDepartmentsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.departmentOptions = response.options;
          ++this.filtersDone;
          this.setFilterSelections();
        }
      });
  }
  getGradeOptions() {
    this.employeeService.getGradesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.gradeOptions = response.options;
          ++this.filtersDone;
          this.setFilterSelections();
        }
      });
  }

  getDesignationOptions() {
    this.employeeService.getDesignationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.designationOptions = response.options;
          ++this.filtersDone;
          this.setFilterSelections();
        }
      });
  }

  getLocationOptions() {
    this.employeeService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
          ++this.filtersDone;
          this.setFilterSelections();
        }
      });
  }

  showFilters() {
    this.employeeFilter.FromDate = this.selectedReportType === 'Headcount' ? new Date() : '',
      this.filterModal.showModal();
  }

  clearFilter(form: NgForm) {
    this.employeeFilter = Object.assign({}, this.employeeFilter, this.defaultFilter);
    form.reset();
    this.selectedReportTypeLabel = 'Employee Birthday';
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.employeeFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getEmployeeBirthDayReport();
    this.filterModal.hideModal();
  }

  clearFilterFromReport() {
    this.selectedMonthInReport = ''
    this.selectedYearInReport = ''
    this.employeeFilter = Object.assign({}, this.employeeFilter, this.defaultFilter);
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.employeeFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.filterModal.hideModal();
  }

  applyFilter() {
    const filter = Object.assign({}, this.employeeFilter);
    filter.departmentSelections = [];
    filter.gradeSelections = [];
    filter.locationSelections = [];
    filter.designationSelections = [];
    filter.roleSelections = [];
    filter.statusSelections = [];
    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.employeeFilter);
    const currentReport = {
      value: this.selectedReportType,
      label: this.selectedReportTypeLabel
    }

    this.onChangeReportType(currentReport, false)
    // this.getEmployeeBirthDayReport();
    this.filterModal.hideModal();
  }

  setFilterParametersFromUrl() {
    // this.employeeFilter = this.defaultFilter;
    this.employeeFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.employeeFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.employeeFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections() {
    if (this.filtersDone === 4) {
      this.employeeFilter.departmentSelections =
        this.departmentOptions.filter(f => this.employeeFilter.departments.find(d => d === f.value));
      this.employeeFilter.gradeSelections =
        this.gradeOptions.filter(f => this.employeeFilter.grades.find(d => d === f.value));
      this.employeeFilter.locationSelections =
        this.locationOptions.filter(f => this.employeeFilter.locations.find(d => d === f.value));
      this.employeeFilter.designationSelections =
        this.designationOptions.filter(f => this.employeeFilter.designations.find(d => d === f.value));
      this.employeeFilter.statusSelections =
        this.statusOptions.filter(f => this.employeeFilter.status.find(d => d === f.value));
      this.employeeFilter.roleSelections =
        this.employeeRoles.filter(f => this.employeeFilter.roles.find(d => d === f.value));

      // this.getEmployeeBirthDayReport();
    }
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }

    return item;
  }
}
