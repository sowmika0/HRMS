import * as _ from 'lodash';
import * as moment from 'moment';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ClassDescription, DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeActionRequest, EmployeeCareer, EmployeeCareerResponse, EmployeeTransferHistoryResponse, UpdateEmployeeCareerRequest, UpdateEmployeeCareerResponse } from '../employee-details.model';
import { SelectOption, SelectOptionResponse } from 'src/app/app.model';

import { ActivatedRoute } from '@angular/router';
import { Color } from 'ng-chartjs';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-career-growth',
  templateUrl: './employee-career-growth.component.html',
  styleUrls: ['./employee-career-growth.component.scss']
})
export class EmployeeCareerGrowthComponent implements OnInit {

  @ViewChild('employeeCareerForm', { static: false }) employeeCareerForm: NgForm;
  @ViewChild('employeeCareerModal', { static: false }) employeeCareerModal: CustomModalComponent;
  @ViewChild('transferHistoryForm', { static: false }) transferHistoryForm: NgForm;
  @ViewChild('transferHistoryModal', { static: false }) transferHistoryModal: CustomModalComponent;

  employeeCareerData: EmployeeCareer[] = [];
  movementChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: 'Rating'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Year'
        }
      }]
    }
  };
  movementLineChartOptions: ChartOptions = {
    responsive: true,
    // pointStyle: 'circle',
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 1
        },
        scaleLabel: {
          display: true,
          labelString: 'Rating'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Year'
        }
      }]
    }
  };
  movementChartLabels: string[] = [];
  movementLineChartLabels: string[] = [];
  movementChartType: ChartType = 'bar';
  movementLineChartType: ChartType = 'line';
  movementChartPlugins: any = {
    'backgroundColor': [
      "#FF6384",
      "#4BC0C0",
      "#FFCE56",
      "#E7E9ED",
      "#36A2EB"
    ]
  }
  public movementChartColors: Color[] = [
    { backgroundColor: 'green' },
  ]

  movementChartData: ChartDataSets[] = [];
  movementLineChartData: ChartDataSets[] = [];
  transferHistoryData: EmployeeCareer[] = [];
  transferHistory: EmployeeCareer = new EmployeeCareer();
  datasets: any[] = [];
  employeeCareer: EmployeeCareer = new EmployeeCareer();
  datePickerOptions = DatePickerOptions.datePicker;

  role = '';
  icon = '';
  employeeId = '';
  currentTab: string = 'careermovement';
  canEdit = false;
  isUpdating: boolean = false;
  transferTypeOptions = SelectionConstants.transferTypes;
  locationOptions: SelectOption[] = [];
  departmentOptions: SelectOption[] = [];
  isLocationRequired: boolean = false;
  isDepartmentRequired: boolean = false;
  appraisalClassDescription = ClassDescription.appraisalClass;

  loggedInUserScreen = true;
  haveAccess: boolean = false;

  constructor(private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private toaster: ToastrService,
    private roleSettingsService: RoleSettingsService) {
      this.activatedRoute.data.subscribe((routeData) => {
        this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
      });
    }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = this.role === 'hr';// || this.role === 'self';
    this.icon = this.employeeService.getSectionTypeIcon('career');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeCareers();
    this.getLocationOptions();
    this.getDepartmentOptions();
  }

  getLocationOptions(): void {
    this.employeeService.getCategoriesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
        }
      });
  }

  getDepartmentOptions(): void {
    this.employeeService.getDepartmentsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.departmentOptions = response.options;
        }
      });
  }

  onTransferTypeChange($event: any): void {
    this.transferHistory.transferType = $event.value;
    this.transferHistory.departmentSelection = null;
    this.transferHistory.locationSelection = null;
    this.isDepartmentRequired = false;
    this.isLocationRequired = false;
    if (this.transferHistory.transferType === 'Location') {
      this.isLocationRequired = true;
    } else if (this.transferHistory.transferType === 'Department') {
      this.isDepartmentRequired = true;
    } else if (this.transferHistory.transferType === 'Both') {
      this.isLocationRequired = true;
      this.isDepartmentRequired = true;
    }
  }

  onLocationChange($event): void {
    this.transferHistory.location = $event.value;
  }

  onDepartmentChange($event): void {
    this.transferHistory.department = $event.value;
  }

  findAccess(data: EmployeeCareerResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeCareers(): void {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeCareerDetails(payload)
      .then((response: EmployeeCareerResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.employeeCareerData = response.employeeCareers;
          this.formatChartData();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  formatChartData(): void {
    let filtered = this.employeeCareerData.filter(data => data.appraisalType === 'Appraisal' || data.appraisalType === 'Variable Bonus' );
    filtered = _.sortBy(filtered, 'appraisalYear');
    let appraisalData = this.employeeCareerData.filter(data => data.appraisalType === 'Appraisal' );
    let variableBonusData = this.employeeCareerData.filter(data => data.appraisalType === 'Variable Bonus' );
    let appraisalRating: number[] = [];
    let variableBonusRating: number[] = [];
    appraisalData.forEach((a) => {
      if (a.description) {
        const filteredClass = this.appraisalClassDescription.filter(d => d.label === a.description)[0];
        appraisalRating.push(filteredClass.value);
      }
    });
    variableBonusData.forEach((a) => {
      if (a.description) {
        const filteredClass = this.appraisalClassDescription.filter(d => d.label === a.description)[0];
        variableBonusRating.push(filteredClass.value);
      }
    });
    let appraisalDataSet: ChartDataSets = {
      data: appraisalRating,
      label: 'Appraisal'
    };
    let variableBonusDataSet: ChartDataSets = {
      data: variableBonusRating,
      label: 'Variable Bonus'
    };
    this.movementChartData.push(appraisalDataSet);
    this.movementChartData.push(variableBonusDataSet);
    this.movementLineChartData.push(appraisalDataSet);
    this.movementLineChartData.push(variableBonusDataSet);
    _.uniqBy(filtered, 'appraisalYear').forEach((uniqueData) => {
      this.movementChartLabels.push(uniqueData.appraisalYear.toString());
      this.movementLineChartLabels.push(uniqueData.appraisalYear.toString());
    });
  }

  editEmployeeCareer(career: EmployeeCareer) {
    this.isUpdating = true;
    career.dateofChange = moment(career.dateofChange)
      .format(this.datePickerOptions.rangeInputFormat);
    career.effectiveFrom = moment(career.effectiveFrom)
      .format(this.datePickerOptions.rangeInputFormat);
    this.employeeCareer = Object.assign({}, career);
    this.employeeCareerModal.showModal();
  }

  onTabSelected(tab: string): void {
    this.currentTab = tab;
  }

  addTransferHistoryModal(form: NgForm): void {
    this.isUpdating = false;
    this.transferHistory = new EmployeeCareer();
    if (form) {
      form.reset();
    }
    this.transferHistory.appraisalYear = Number(moment().format(this.datePickerOptions.yearOnlyFormat));
    this.transferHistory.transferTypeSelection = this.transferTypeOptions[2];
    this.isDepartmentRequired = true;
    this.isLocationRequired = true;
    this.transferHistory.reasonForChange = 'Business Requirement';
    this.transferHistoryModal.showModal();
  }

  addTransferHistory(): void {
    this.subjectService.toggleLoading(true);
    this.isUpdating = false;
    this.transferHistory.appraisalType = "Transfer";
    this.transferHistory.movementStatus = "HR Verified";
    const payload: UpdateEmployeeCareerRequest = {
      employeeId: this.employeeId,
      employeeCareers: [this.transferHistory]
    }
    this.employeeService.updateEmployeeCareerDetail(payload)
      .then((response: UpdateEmployeeCareerResponse) => {
        if (response.isSuccess) {
          this.employeeCareerData = response.employeeCareers;
          this.transferHistoryForm.reset();
          this.toaster.success('The transfer details added successfully');
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });
    this.transferHistoryModal.hideModal();
  }

  updateEmployeeCareer(): void {
    this.subjectService.toggleLoading(true);
    this.isUpdating = true;
    this.employeeCareer.movementStatus = "HR Verified";
    const payload: UpdateEmployeeCareerRequest = {
      employeeId: this.employeeId,
      employeeCareers: [this.employeeCareer]
    }
    this.employeeService.updateEmployeeCareerDetail(payload)
      .then((response: UpdateEmployeeCareerResponse) => {
        if (response.isSuccess) {
          this.employeeCareerData = response.employeeCareers;
          this.employeeCareerForm.reset();
          this.toaster.success('The Career Growth details updated successfully');
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });
    this.employeeCareerModal.hideModal();
  }

}
