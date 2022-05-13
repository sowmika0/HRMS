import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeePreviousCompany,
  EmployeePreviousCompanyResponse,
  UpdateEmployeePreviousCompanyRequest,
} from './../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { DatePickerOptions } from 'src/app/app.constants';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-previous-company',
  templateUrl: './employee-previous-company.component.html',
  styleUrls: ['./employee-previous-company.component.scss']
})
export class EmployeePreviousCompanyComponent implements OnInit {

  @ViewChild('previousCompanyForm', { static: false }) previousCompanyForm: NgForm;
  @ViewChild('previousCompanyModal', { static: false }) previousCompanyModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  canEdit = false;
  isAdded = false;
  employeeId = '';
  isUpdating = false;
  isProcessing = false;
  maxDateOfJoin = null;
  maxDateOfExit = null;
  currentJoiningDate: Date | string = '';
  previousCompany: EmployeePreviousCompany;
  datePickerOptions = DatePickerOptions.datePicker;
  previousCompanies: EmployeePreviousCompany[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();
  activePreviousCompanies: EmployeePreviousCompany[] = [];

  loggedInUserScreen = true;
  haveAccess: boolean = false;

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
    this.icon = this.employeeService.getSectionTypeIcon('previous');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeePreviousCompanies();
  }

  private delete = (item: EmployeePreviousCompany) => {
    item.isActive = false;
    this.setActivePreviousCompanies();
    this.updateEmployeePreviousCompany();
  }

  setActivePreviousCompanies() {
    this.activePreviousCompanies = this.previousCompanies.filter(i => i.previousCompanyId || (!i.previousCompanyId && i.isActive));
    this.activePreviousCompanies = this.previousCompanies.filter(i => i.isActive);
    this.datePickerWorkaround();
  }

  findAccess(data: EmployeePreviousCompanyResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeePreviousCompanies() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeService.getEmployeeId()
    };

    this.employeeService.getEmployeePreviousCompany(payload)
      .then((response: EmployeePreviousCompanyResponse) => {
        if (response.isSuccess) {
          this.previousCompanies = response.previousCompanies;
          this.findAccess(response);
          this.maxDateOfExit = response.currentDateOfJoin
            ? new Date(
              moment(response.currentDateOfJoin)
                .add(-1, 'days')
                .add(10, 'hours')
                .format(DatePickerOptions.datePicker.dateTimeFormat))
            : new Date(
              moment()
                .add(-1, 'days')
                .add(10, 'hours')
                .format(DatePickerOptions.datePicker.dateTimeFormat));

          this.maxDateOfExit = this.maxDateOfExit > new Date() ?
            new Date(
              moment()
                .add(-1, 'days')
                .add(10, 'hours')
                .format(DatePickerOptions.datePicker.dateTimeFormat))
            : this.maxDateOfExit;

          this.maxDateOfJoin = new Date(moment(this.maxDateOfExit)
            .add(-1, 'days')
            .add(10, 'hours')
            .format(DatePickerOptions.datePicker.dateTimeFormat));

          this.setActivePreviousCompanies();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  datePickerWorkaround() {
    this.activePreviousCompanies.map(p => {

      p.dateOfJoin = p.dateOfJoin ?
        new Date(
          moment(p.dateOfJoin)
            .startOf('day')
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat)
        ) : '';

      p.dateOfExit = p.dateOfExit ?
        new Date(
          moment(p.dateOfExit)
            .startOf('day')
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat)
        ) : '';

      p.dateOfExitText = p.dateOfExit ? moment(p.dateOfExit).format(this.datePickerOptions.dateInputFormat) : '';
      p.dateOfJoinText = p.dateOfJoin ? moment(p.dateOfJoin).format(this.datePickerOptions.dateInputFormat) : '';

    })
  }

  updateEmployeePreviousCompany() {
    this.isProcessing = true;
    this.datePickerWorkaround();
    const payload: UpdateEmployeePreviousCompanyRequest = {
      employeeId: this.employeeId,
      previousCompanies: this.previousCompanies
    };
    this.employeeService.updateEmployeePreviousCompany(payload)
      .then((response: EmployeePreviousCompanyResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Employee previous company details updated successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.previousCompanies = response.previousCompanies;
          this.maxDateOfJoin = response.currentDateOfJoin
            ? new Date(
              moment(response.currentDateOfJoin)
                .add(10, 'hours')
                .format(DatePickerOptions.datePicker.dateTimeFormat))
            : new Date();
          this.datePickerWorkaround();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  joinDateSelected($event) {
    if ($event && this.previousCompany.dateOfExit) {
      if (moment(this.previousCompany.dateOfExit).isSameOrBefore(moment($event), 'date')) {
        this.previousCompany.dateOfExit = null;
      }
    }
  }

  exitDateSelected($event) {
    if ($event && this.previousCompany.dateOfJoin) {
      if (moment(this.previousCompany.dateOfJoin).isSameOrAfter(moment($event), 'date')) {
        this.previousCompany.dateOfJoin = null;
      }
    }
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'previous'
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


  add(form: NgForm) {
    this.isUpdating = false;
    this.previousCompany = new EmployeePreviousCompany();
    if (form) {
      form.reset();
    }
    this.previousCompanyModal.showModal();
  }

  edit(item: EmployeePreviousCompany) {
    this.isUpdating = true;
    this.previousCompany = Object.assign({}, item);
    this.previousCompanyModal.showModal();
  }

  addOrUpdate() {
    const previousCompany = Object.assign({}, this.previousCompany);
    previousCompany.dateOfExitText = moment(previousCompany.dateOfExit).format(this.datePickerOptions.dateInputFormat);
    previousCompany.dateOfJoinText = moment(previousCompany.dateOfJoin).format(this.datePickerOptions.dateInputFormat);

    if (!this.isUpdating) {
      previousCompany.isActive = true;
      previousCompany.tempId = ++this.tempId;
      this.previousCompanies.push(previousCompany);
      this.setActivePreviousCompanies();
    } else {
      if (previousCompany.previousCompanyId) {
        const addedpreviousCompany = this.previousCompanies.find(l => l.previousCompanyId === previousCompany.previousCompanyId);
        if (addedpreviousCompany) {
          addedpreviousCompany.employer = previousCompany.employer;
          addedpreviousCompany.designation = previousCompany.designation;
          addedpreviousCompany.department = previousCompany.department;
          addedpreviousCompany.dateOfJoin = previousCompany.dateOfJoin;
          addedpreviousCompany.dateOfExit = previousCompany.dateOfExit;
          addedpreviousCompany.dateOfExitText = previousCompany.dateOfExitText;
          addedpreviousCompany.dateOfJoinText = previousCompany.dateOfJoinText;
          addedpreviousCompany.reasonForChange = previousCompany.reasonForChange;
          addedpreviousCompany.ctc = previousCompany.ctc;
        }
      } else {
        const addedpreviousCompany = this.previousCompanies.find(l => l.tempId === previousCompany.tempId);
        if (addedpreviousCompany) {
          addedpreviousCompany.employer = previousCompany.employer;
          addedpreviousCompany.designation = previousCompany.designation;
          addedpreviousCompany.department = previousCompany.department;
          addedpreviousCompany.dateOfJoin = previousCompany.dateOfJoin;
          addedpreviousCompany.dateOfExitText = previousCompany.dateOfExitText;
          addedpreviousCompany.dateOfJoinText = previousCompany.dateOfJoinText;
          addedpreviousCompany.dateOfExit = previousCompany.dateOfExit;
          addedpreviousCompany.reasonForChange = previousCompany.reasonForChange;
          addedpreviousCompany.ctc = previousCompany.ctc;
        }
      }
    }

    this.updateEmployeePreviousCompany();
    this.previousCompanyModal.hideModal();
  }

  deleteAlert(item: EmployeePreviousCompany) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Previous Company?',
      content: [
        'Once you have deleted the added previous company information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Previous Company',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }
}
