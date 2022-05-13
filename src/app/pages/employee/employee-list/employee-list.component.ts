import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataTableParameters, SelectionConstants } from 'src/app/app.constants';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  Employee,
  EmployeeListFilterRequest,
  EmployeeListResponse,
} from '../employee-details/employee-details.model';
import { EmployeeService } from '../employee.service';
import { SelectOption, SelectOptionResponse } from './../../../app.model';
import { LocalStorageService } from './../../../shared/services/local-storage-service';
import { ObjectToUrlService } from './../../../shared/services/obj-to-url-service';
import { EmployeeActionRequest } from './../employee-details/employee-details.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  filtersDone = 0;
  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;
  employees: Employee[] = [];
  isEmailAlreadyAdded = false;
  gradeOptions: SelectOption[] = [];
  employeeRoles: SelectOption[] = [];
  dtOptions: DataTables.Settings = {};
  locationOptions: SelectOption[] = [];
  departmentOptions: SelectOption[] = [];
  designationOptions: SelectOption[] = [];
  roles = SelectionConstants.statusOptions;
  defaultFilter: EmployeeListFilterRequest;
  employeeFilter: EmployeeListFilterRequest;
  statusOptions = SelectionConstants.statusOptions;
  alertData: SweetAlertValue = new SweetAlertValue();
  newEmployee: CreateEmployeeRequest = new CreateEmployeeRequest();

  @ViewChild('employeeModal', { static: false }) employeeModal: CustomModalComponent;
  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
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
    };

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 10
        }
      ],
      order: [[3, "asc"]],
      lengthMenu: [[20, 25, 50], [20, 25, 50]],
    });

    this.getDepartmentOptions();
    this.setFilterParametersFromUrl();

    setTimeout(() => {
      this.getGradeOptions();
      this.getRolesForCompany();
    }, 100);

    setTimeout(() => {
      this.getDesignationOptions();
      this.getLocationOptions();
    }, 200);
  }

  private toggleLogin = (employee: Employee) => {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: employee.employeeId
    };
    this.employeeService.toggleEmployeeLogin(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllEmployees();
        }
      })
      .finally(() => { this.subjectService.toggleLoading(false); });
  }

  private deleteEmployee = (employee: Employee) => {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: employee.employeeId
    };
    this.employeeService.deleteEmployee(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllEmployees();
        }
      })
      .finally(() => { this.subjectService.toggleLoading(false); });
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
    this.subjectService.toggleLoading(true);
    this.employeeService.getAllEmployees(this.employeeFilter)
      .then((response: EmployeeListResponse) => {
        if (response.isSuccess) {
          this.employees = response.employees;
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
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

  addNewEmployee(form: NgForm) {
    if (!form.valid) {
      // Object.keys(form.controls).forEach(field => {
      //   form.hasError()
      // });
    } else {
      this.isProcessing = true;
      this.isEmailAlreadyAdded = false;
      this.employeeService.createNewEmployee(this.newEmployee)
        .then((response: CreateEmployeeResponse) => {
          if (response.isSuccess) {
            if (response.isCreated) {
              this.router.navigate(['/employees/' + response.employeeId]);
              this.toaster.success(
                'New employee created and you are navigated to the employee details page of the newly created employee.');
            } else {
              this.isEmailAlreadyAdded = true;
            }
          }
        })
        .finally(() => {
          this.isProcessing = false;
        });
    }
  }

  viewEmployeeDetails(employee: Employee) {
    this.router.navigate(['/employees/' + employee.employeeId]);
  }

  toggleLoginAlert(item: Employee) {
    this.alertData = {
      emoji: 'assets/emoji/neutral.png',
      header: item.canLogin ? 'Disable Login ?' : 'Enable Login ?',
      content: [
        'Are you sure you want to ' + (item.canLogin ? 'disable' : 'enable') + ' the login access for the selected employee?'
      ],
      confirmText: null,
      confirmButtonText: item.canLogin ? 'Disable Login' : 'Enable Login',
      cancelButtonText: item.canLogin ? 'Dont Disable' : 'Dont Enable',
      onConfirm: this.toggleLogin,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, item.canLogin ? 'danger' : 'primary');
  }

  deleteEmployeeAlert(item: Employee) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Employee?',
      content: [
        'Are you sure you want to delete the employee? Once deleted the action cannot be undone.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Employee',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.deleteEmployee,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  addEmployeeModal(form: NgForm) {
    form.reset();
    this.isEmailAlreadyAdded = false;
    this.newEmployee = new CreateEmployeeRequest();
    this.newEmployee.canLogin = false;
    this.employeeModal.showModal();
  }

  showFilters() {
    this.filterModal.showModal();
  }

  clearFilter(form: NgForm) {
    this.employeeFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.employeeFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAllEmployees();
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
    this.getAllEmployees();
    this.filterModal.hideModal();
  }

  setFilterParametersFromUrl() {
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

      this.getAllEmployees();
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
