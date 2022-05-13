import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue, UserStorageInformation } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import {
  EmployeeActionRequest,
  EmployeeBank,
  EmployeeBankResponse,
  EmployeeDataVerificationRequest,
} from '../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateEmployeeBankRequest } from './../employee-details.model';

@Component({
  selector: 'app-employee-bank',
  templateUrl: './employee-bank.component.html',
  styleUrls: ['./employee-bank.component.scss']
})
export class EmployeeBankComponent implements OnInit {

  @ViewChild('bankForm', { static: false }) bankForm: NgForm;
  @ViewChild('bankModal', { static: false }) bankModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  canEdit = false;
  employeeId = '';
  isUpdating = false;
  isProcessing = false;
  banks: EmployeeBank[] = [];
  activeBanks: EmployeeBank[] = [];
  bank: EmployeeBank = new EmployeeBank();
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  accountTypeOptions = SelectionConstants.accountTypeOptions;
  haveAccess: boolean = false;
  loggedInUserScreen = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    this.canEdit = this.role === 'hr' || this.role === 'self';
    this.icon = this.employeeService.getSectionTypeIcon('bank');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeBanks();
  }

  private delete = (item: EmployeeBank) => {
    item.isActive = false;
    this.setActiveBanks();
    this.updateEmployeeBanks();
  }

  setActiveBanks() {
    this.banks = this.banks.filter(i => i.employeeBankId || (!i.employeeBankId && i.isActive));
    this.activeBanks = this.banks.filter(i => i.isActive);
    this.activeBanks.map(m => {

      m.accountTypeSelection = this.accountTypeOptions.find(v => v.value === m.accountType);
      m.effectiveDate = new Date(
        moment(m.effectiveDate)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      );
    })
  }

  findAccess(data: EmployeeBankResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeBanks() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeBanks(payload)
      .then((response: EmployeeBankResponse) => {
        if (response.isSuccess) {
          this.banks = response.employeeBanks;
          this.findAccess(response);
          this.setActiveBanks();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeBanks() {
    this.isProcessing = true;
    const payload: UpdateEmployeeBankRequest = {
      employeeId: this.employeeId,
      employeebanks: this.banks
    };
    this.employeeService.updateEmployeeBank(payload)
      .then((response: EmployeeBankResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee bank details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.banks = response.employeeBanks;
          this.setActiveBanks();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.bank = new EmployeeBank();
    if (form) {
      form.reset();
    }
    this.bankModal.showModal();
  }

  edit(item: EmployeeBank) {
    this.isUpdating = true;
    this.bank = Object.assign({}, item);
    this.bankModal.showModal();
  }

  addOrUpdate() {
    const bank = Object.assign({}, this.bank);
    if (!this.isUpdating) {
      bank.isActive = true;
      bank.tempId = ++this.tempId;
      this.banks.push(bank);
      this.setActiveBanks();
    } else {
      if (bank.employeeBankId) {
        const addedBank = this.banks.find(l => l.employeeBankId === bank.employeeBankId);
        if (addedBank) {
          addedBank.bankName = bank.bankName;
          addedBank.branch = bank.branch;
          addedBank.accountType = bank.accountType;
          addedBank.accountNumber = bank.accountNumber;
          addedBank.ifscCode = bank.ifscCode;
          addedBank.effectiveDate = bank.effectiveDate;
          addedBank.accountTypeSelection = bank.accountTypeSelection;
        }
      } else {
        const addedBank = this.banks.find(l => l.tempId === bank.tempId);
        if (addedBank) {
          addedBank.bankName = bank.bankName;
          addedBank.branch = bank.branch;
          addedBank.accountType = bank.accountType;
          addedBank.accountNumber = bank.accountNumber;
          addedBank.ifscCode = bank.ifscCode;
          addedBank.effectiveDate = bank.effectiveDate;
          addedBank.accountTypeSelection = bank.accountTypeSelection;
        }
      }
    }

    this.updateEmployeeBanks();
    this.bankModal.hideModal();
  }

  deleteAlert(item: EmployeeBank) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Bank?',
      content: [
        'Once you have deleted the added bank information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Bank',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'bank'
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
