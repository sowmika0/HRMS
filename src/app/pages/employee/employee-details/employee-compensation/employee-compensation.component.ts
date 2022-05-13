import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeCompensation,
  EmployeeCompensationRequest,
  EmployeeCompensationResponse,
  EmployeeDataVerificationRequest,
  EmployeeFamily,
} from '../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-compensation',
  templateUrl: './employee-compensation.component.html',
  styleUrls: ['./employee-compensation.component.scss']
})
export class EmployeeCompensationComponent implements OnInit {

  @ViewChild('compensationForm', { static: false }) compensationForm: NgForm;
  @ViewChild('compensationModal', { static: false }) compensationModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  canEdit = false;
  employeeId = '';
  isAllowed = false;
  isAdded = false;
  today = new Date();
  isOnRoll = false;
  isUpdating = false;
  isProcessing = false;
  compensation: EmployeeCompensation;
  compensations: EmployeeCompensation[] = [];
  activeCompensations: EmployeeCompensation[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();

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
    this.canEdit = this.role === 'hr';
    this.icon = this.employeeService.getSectionTypeIcon('compensation');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeCompensations();
  }

  private delete = (item: EmployeeFamily) => {
    item.isActive = false;
    this.setActiveCompensations();
    this.updateEmployeeCompensations();
  }

  setActiveCompensations() {
    this.compensations = this.compensations.filter(i => i.employeeCompensationId || (!i.employeeCompensationId && i.isActive));
    this.activeCompensations = this.compensations.filter(i => i.isActive);
  }

  findAccess(data: EmployeeCompensationResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeCompensations() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeCompensation(payload)
      .then((response: EmployeeCompensationResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.isOnRoll = response.isOnRoll;
          this.isAllowed = response.isAllowed;
          this.compensations = response.employeeCompensation;
          this.setActiveCompensations();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeCompensations() {
    this.isProcessing = true;
    const payload: EmployeeCompensationRequest = {
      employeeId: this.employeeId,
      employeeCompensation: this.compensations
    };
    this.employeeService.updateEmployeeCompensation(payload)
      .then((response: EmployeeCompensationResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee compensation details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.compensations = response.employeeCompensation;
          this.setActiveCompensations();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.compensation = new EmployeeCompensation();
    if (form) {
      form.reset();
    }
    this.compensationModal.showModal();
  }

  edit(item: EmployeeCompensation) {
    this.isUpdating = true;
    this.compensation = Object.assign({}, item);
    this.compensationModal.showModal();
  }

  addOrUpdate() {
    const compensation = Object.assign({}, this.compensation);

    const activeOthers = this.activeCompensations.filter(a =>
      compensation.employeeCompensationId
        ? a.employeeCompensationId !== compensation.employeeCompensationId
        : a.tempId
          ? a.tempId !== compensation.tempId
          : true);

    this.isAdded = activeOthers.some(a => a.year === compensation.year)
      ? true
      : false;

    if (!this.isAdded) {
      if (!this.isUpdating) {
        compensation.isActive = true;
        compensation.tempId = ++this.tempId;
        this.compensations.push(compensation);
      } else {
        if (compensation.employeeCompensationId) {
          let addedCompensation = this.compensations.find(l => l.employeeCompensationId === compensation.employeeCompensationId);
          if (addedCompensation) {

            addedCompensation.year = compensation.year;
            addedCompensation.annualBasic = compensation.annualBasic;
            addedCompensation.annualHra = compensation.annualHra;
            addedCompensation.annualConvAllow = compensation.annualConvAllow;
            addedCompensation.annualSplAllow = compensation.annualSplAllow;
            addedCompensation.annualMedAllow = compensation.annualMedAllow;
            addedCompensation.annualLta = compensation.annualLta;
            addedCompensation.annualWashing = compensation.annualWashing;
            addedCompensation.annualChildEdu = compensation.annualChildEdu;
            addedCompensation.annualGross = compensation.annualGross;
            addedCompensation.statutoryBonus = compensation.statutoryBonus;
            addedCompensation.annualVarBonus = compensation.annualVarBonus;
            addedCompensation.annualVarBonusPaid1 = compensation.annualVarBonusPaid1;
            addedCompensation.annualVarBonusPaid2 = compensation.annualVarBonusPaid2;
            addedCompensation.annualAccidIns = compensation.annualAccidIns;
            addedCompensation.annualHealthIns = compensation.annualHealthIns;
            addedCompensation.annualGratuity = compensation.annualGratuity;
            addedCompensation.annualPf = compensation.annualPf;
            addedCompensation.annualEsi = compensation.annualEsi;
            addedCompensation.otherBenefits = compensation.otherBenefits;
            addedCompensation.annualCtc = compensation.annualCtc;
            addedCompensation.vendorCharges = compensation.vendorCharges;
            addedCompensation.offrollCtc = compensation.offrollCtc;

          }
        } else {
          let addedCompensation = this.compensations.find(l => l.tempId === compensation.tempId);
          if (addedCompensation) {

            addedCompensation.year = compensation.year;
            addedCompensation.annualBasic = compensation.annualBasic;
            addedCompensation.annualHra = compensation.annualHra;
            addedCompensation.annualConvAllow = compensation.annualConvAllow;
            addedCompensation.annualSplAllow = compensation.annualSplAllow;
            addedCompensation.annualMedAllow = compensation.annualMedAllow;
            addedCompensation.annualLta = compensation.annualLta;
            addedCompensation.annualWashing = compensation.annualWashing;
            addedCompensation.annualChildEdu = compensation.annualChildEdu;
            addedCompensation.annualGross = compensation.annualGross;
            addedCompensation.statutoryBonus = compensation.statutoryBonus;
            addedCompensation.annualVarBonus = compensation.annualVarBonus;
            addedCompensation.annualVarBonusPaid1 = compensation.annualVarBonusPaid1;
            addedCompensation.annualVarBonusPaid2 = compensation.annualVarBonusPaid2;
            addedCompensation.annualAccidIns = compensation.annualAccidIns;
            addedCompensation.annualHealthIns = compensation.annualHealthIns;
            addedCompensation.annualGratuity = compensation.annualGratuity;
            addedCompensation.annualPf = compensation.annualPf;
            addedCompensation.annualEsi = compensation.annualEsi;
            addedCompensation.otherBenefits = compensation.otherBenefits;
            addedCompensation.annualCtc = compensation.annualCtc;
            addedCompensation.vendorCharges = compensation.vendorCharges;
            addedCompensation.offrollCtc = compensation.offrollCtc;
          }
        }
      }
      this.setActiveCompensations();

      this.updateEmployeeCompensations();
      this.compensationModal.hideModal();
    }
  }

  deleteAlert(item: EmployeeFamily) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Compensation?',
      content: [
        'Once you have deleted the compensation information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
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
      section: 'compensation'
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
