import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { AppraisalActionRequest, AppraisalDetailsResponse, AppraisalEmployee } from './../appraisal.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableParameters, DatePickerOptions } from 'src/app/app.constants';

import { AppraisalService } from './../appraisal.service';
import { CustomModalComponent } from './../../../shared/components/custom-modal/custom-modal.component';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { NgForm } from '@angular/forms';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appraisal-details',
  templateUrl: './appraisal-details.component.html',
  styleUrls: ['./appraisal-details.component.scss']
})
export class AppraisalDetailsComponent implements OnInit {

  notStarted = 0;
  hrCompleted = 0;
  rmCompleted = 0;
  selfCompleted = 0;
  appraisalId = '';
  dtOptions: DataTables.Settings = {};
  employees: AppraisalEmployee[] = [];
  filteredEmployees: AppraisalEmployee[] = [];
  @ViewChild('appraisalFormModal', { static: false }) appraisalFormModal: CustomModalComponent;
  @ViewChild('bulkHRProcessModal', { static: false }) bulkHRProcessModal: CustomModalComponent;
  showObjective: boolean = false;
  showVB: boolean = false;
  showAppraisal: boolean = false;
  employeeId: string = '';
  appraisalMode: number;
  overallAppraisalMode: number;
  selectAll: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private appraisalService: AppraisalService
  ) { }

  ngOnInit() {
    this.setAppraisalId();
    this.getAppraisalDetails();

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 8
        },
      ]
    });
  }

  setAppraisalId() {
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id) {
        this.appraisalId = params.id;
      }
    });
  }

  getAppraisalDetails() {
    this.showObjective = false;
    this.showVB = false;
    this.showAppraisal = false;
    
    this.subjectService.toggleLoading(true);
    const payload: AppraisalActionRequest = {
      appraisalId: this.appraisalId
    };
    this.appraisalService.getAppraisalDetails(payload)
      .then((response: AppraisalDetailsResponse) => {
        if (response.isSuccess) {
          this.employees = response.appraisalEmployees;
          this.employees.map(e => {

            e.appraisalMode === 1 ? e.selfFilledOn = e.selfObjectiveFilledOn : e.appraisalMode === 2 ? e.selfFilledOn = e.selfVariableFilledOn : e.selfFilledOn;
            e.appraisalMode === 1 ? e.rmFilledOn = e.rmObjectiveFilledOn : e.appraisalMode === 2 ? e.rmFilledOn = e.rmVariableFilledOn : e.rmFilledOn;
            e.appraisalMode === 1 ? e.l2FilledOn = e.l2ObjectiveFilledOn : e.appraisalMode === 2 ? e.l2FilledOn = e.l2VariableFilledOn : e.l2FilledOn;
            e.appraisalMode === 1 ? e.hrFilledOn = e.hrObjectiveFilledOn : e.appraisalMode === 2 ? e.hrFilledOn = e.hrVariableFilledOn : e.hrFilledOn;

            e.selfFilledOnText = e.selfFilledOn
              ? moment.utc(e.selfFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.rmFilledOnText = e.rmFilledOn
              ? moment.utc(e.rmFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.l2FilledOnText = e.l2FilledOn
              ? moment.utc(e.l2FilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';

            e.hrFilledOnText = e.hrFilledOn
              ? moment.utc(e.hrFilledOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';
          });

          this.notStarted = this.employees.filter(e => !e.selfFilledOn).length;
          this.selfCompleted = this.employees.filter(e => e.selfFilledOn && !e.rmFilledOn).length;
          this.rmCompleted = this.employees.filter(e => e.selfFilledOn && e.rmFilledOn && !e.hrFilledOn).length;
          this.hrCompleted = this.employees.filter(e => e.hrFilledOn).length;
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  openBulkHRProcessModal() {
    console.log(this.employees);
    if (this.employees && this.employees.length) {
      this.overallAppraisalMode = this.employees[0].appraisalMode;
      if (this.overallAppraisalMode === 1) {
        this.filteredEmployees = this.employees.filter((e) => e.selfObjectiveFilledOn !== null && e.rmObjectiveFilledOn !== null);
        console.log(this.filteredEmployees);
      } else if (this.overallAppraisalMode === 2) {
        this.filteredEmployees = this.employees.filter((e) => e.selfVariableFilledOn !== null && e.rmVariableFilledOn !== null);
      } else if (this.overallAppraisalMode === 3) {
        this.filteredEmployees = this.employees.filter((e) => e.selfFilledOn !== null && e.rmFilledOn !== null);
      }
    }
    console.log(this.overallAppraisalMode);
    this.bulkHRProcessModal.showModal();
  }

  bulkHRProcess() {
    
  }

  Modal = (employeeId: string, appraisalMode: number) => {
    if(appraisalMode === 1){
      this.showObjective = true;
      this.showVB = false;
      this.showAppraisal = false;
    }
    else if(appraisalMode === 2){
      this.showObjective = false;
      this.showVB = true;
      this.showAppraisal = false;
    }
    else if(appraisalMode === 3){
      this.showObjective = false;
      this.showVB = false;
      this.showAppraisal = true;
    }
    this.employeeId = employeeId;
    this.appraisalMode = appraisalMode;
    setTimeout(() => {
      this.appraisalFormModal.showModal();
    }, 500);
  }

}
