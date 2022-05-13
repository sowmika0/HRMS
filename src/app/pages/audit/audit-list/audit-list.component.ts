import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs/internal/Subject';

import { DataTableParameters, DatePickerOptions } from '../../../app.constants';
import { CustomModalComponent } from '../../../shared/components/custom-modal/custom-modal.component';
import { ObjectToUrlService } from '../../../shared/services/obj-to-url-service';
import { EmployeeBaseInfo } from '../../employee/employee-details/employee-details.model';
import { AuditService } from '../audit.service';
import { SelectOption, SelectOptionResponse } from './../../../app.model';
import { ReportingToResponse } from './../../employee/employee-details/employee-details.model';
import { Audit, AuditFilterRequest, AuditListResponse } from './../audit.model';


@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit {

  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;

  auditList: Audit[] = [];
  employeesList: EmployeeBaseInfo[] = [];
  modulesOptions: SelectOption[] = [];
  defaultFilter: AuditFilterRequest;
  auditFilter: AuditFilterRequest;
  datePickerOptions = DatePickerOptions.datePicker;

  dtOptions: DataTables.Settings = {};
  auditTrigger = new Subject<any>();

  constructor(
    private router: Router,
    private location: Location,
    private objToUrlService: ObjectToUrlService,
    private activatedRoute: ActivatedRoute,
    private auditService: AuditService
  ) { }

  ngOnInit() {
    this.getAllAuditModules();
    this.getAllEmployees();
    this.setFilter();

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      lengthMenu: [[30, 50], [30, 50]],
      searching: true,
    });
  }

  ngAfterViewInit() {
  }

  setFilter() {
    this.defaultFilter = {
      employeeIds: [],
      endDate: null,
      modules: [],
      startDate: null,
      updatedEmpIds: [],
      verifiedEmpIds: [],
      employeeIdsSelection: [],
      modulesSelection: [],
      updatedEmpIdsSelection: [],
      verifiedEmpIdsSelection: [],
      verifiedEndDate: null,
      verifiedStartDate: null
    };
    this.auditFilter = Object.assign({}, this.defaultFilter);
    this.setFilterParametersFromUrl();
  }

  getAllAuditModules() {
    this.auditService.getAllAuditModules()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.modulesOptions = response.options;
          this.setFilterSelections();
        }
      })
  }

  getAllAudit() {
    this.auditService.getAllAudit(this.auditFilter)
      .then((response: AuditListResponse) => {
        if (response.isSuccess) {

          response.auditList.map(a => {
            a.formattedUpdated = a.updatedDate ? moment(a.updatedDate).format(DatePickerOptions.datePicker.dateTimeFormat) : '';
            a.formattedVerified = a.verifiedDate ? moment(a.verifiedDate).format(DatePickerOptions.datePicker.dateTimeFormat) : '';
          });

          setTimeout(() => {
            this.renderTable(response.auditList);
          }, 200);

        }
      })
  }

  renderTable(audits: Audit[]) {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        setTimeout(() => {
          this.auditList = audits;
          this.auditTrigger.next();
        }, 100);
      });
    } else {
      this.auditList = audits;
      setTimeout(() => {
        this.auditTrigger.next();
      }, 100);
    }

  }

  getAllEmployees() {
    // this.trainingService.getHrEmployeesForDropdown()
    //   .then((response: ReportingToResponse) => {
    //     if (response.isSuccess) {
    //       this.employeesList = response.employees;
    //       this.setFilterSelections();
    //     }
    //   })

    this.auditService.getEmployeesBaseInfo()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.employeesList = response.employees;
          this.setFilterSelections();
        }
      })
  }

  setFilterParametersFromUrl() {
    this.auditFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.auditFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.auditFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections() {
    if (this.employeesList.length > 0 && this.modulesOptions.length > 0) {

      this.auditFilter.startDate =
        this.auditFilter.startDate && this.auditFilter.startDate !== ''
          ? new Date(moment(this.auditFilter.startDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat))
          : '';

      this.auditFilter.endDate =
        this.auditFilter.endDate && this.auditFilter.endDate !== ''
          ? new Date(moment(this.auditFilter.endDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat))
          : '';

      this.auditFilter.verifiedStartDate =
        this.auditFilter.verifiedStartDate && this.auditFilter.verifiedStartDate !== ''
          ? new Date(moment(this.auditFilter.verifiedStartDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat))
          : '';

      this.auditFilter.verifiedEndDate =
        this.auditFilter.verifiedEndDate && this.auditFilter.verifiedEndDate !== ''
          ? new Date(moment(this.auditFilter.verifiedEndDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat))
          : '';

      if (this.auditFilter.employeeIds) {
        this.auditFilter.employeeIdsSelection =
          this.employeesList.filter(f => this.auditFilter.employeeIds.find(d => d === f.employeeId));
      }

      if (this.auditFilter.updatedEmpIds) {
        this.auditFilter.updatedEmpIdsSelection =
          this.employeesList.filter(f => this.auditFilter.updatedEmpIds.find(d => d === f.employeeId));
      }

      if (this.auditFilter.verifiedEmpIds) {
        this.auditFilter.verifiedEmpIdsSelection =
          this.employeesList.filter(f => this.auditFilter.verifiedEmpIds.find(d => d === f.employeeId));
      }

      if (this.auditFilter.modules) {
        this.auditFilter.modulesSelection =
          this.modulesOptions.filter(f => this.auditFilter.modules.find(d => d === f.value));
      }

      this.getAllAudit();
    }
  }

  applyFilter() {
    const filter = Object.assign({}, this.auditFilter);
    filter.startDate = filter.startDate && filter.startDate !== ''
      ? moment(filter.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : null;
    filter.endDate = filter.endDate && filter.endDate !== ''
      ? moment(filter.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : null;

    filter.employeeIdsSelection = [];
    filter.verifiedEmpIdsSelection = [];
    filter.updatedEmpIdsSelection = [];
    filter.modulesSelection = [];

    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.auditFilter);
    this.getAllAudit();
    this.filterModal.hideModal();
  }

  clearFilter(form: NgForm) {
    this.auditFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.auditFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAllAudit();
    this.filterModal.hideModal();
  }

  selectMultipleEmp(values: EmployeeBaseInfo[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.employeeId);
    }

    return item;
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }

    return item;
  }

  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }

  showFilters() {
    this.filterModal.showModal();
  }

}
