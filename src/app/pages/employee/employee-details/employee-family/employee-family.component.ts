import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings, DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeFamily,
  EmployeeFamilyResponse,
  UpdateEmployeeFamilyRequest,
} from '../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeDataVerificationRequest } from './../employee-details.model';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RegEx } from './../../../../app.constants';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-family',
  templateUrl: './employee-family.component.html',
  styleUrls: ['./employee-family.component.scss']
})
export class EmployeeFamilyComponent implements OnInit {

  @ViewChild('familyForm', { static: false }) familyForm: NgForm;
  @ViewChild('familyModal', { static: false }) familyModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  regEx = RegEx;
  canEdit = false;
  employeeId = '';
  isAdded = false;
  today = new Date();
  isUpdating = false;
  isProcessing = false;
  showMediclaim = false;
  family: EmployeeFamily;
  families: EmployeeFamily[] = [];
  activeFamilies: EmployeeFamily[] = [];
  oneTimeSelection = AppSettings.onlyOneSelection;
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  relationshipOptions = SelectionConstants.relationshipOptions;
  availableRelationOptions = SelectionConstants.relationshipOptions;

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
    this.icon = this.employeeService.getSectionTypeIcon('family');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeFamilies();
  }

  private delete = (item: EmployeeFamily) => {
    item.isActive = false;
    this.setActiveFamilies();
    this.updateEmployeeFamilies();
  }

  setActiveFamilies() {
    this.families = this.families.filter(i => i.employeeFamilyId || (!i.employeeFamilyId && i.isActive));
    this.activeFamilies = this.families.filter(i => i.isActive);
    this.activeFamilies.map(a => {
      a.dob = a.dob ? new Date(
        moment(a.dob)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      ) : null;
    });
  }

  findAccess(data: EmployeeFamilyResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeFamilies() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeFamily(payload)
      .then((response: EmployeeFamilyResponse) => {
        if (response.isSuccess) {
          this.families = response.employeeFamily;
          this.setActiveFamilies();
          this.findAccess(response);
          this.families.map(f => {
            f.relationSelection = this.relationshipOptions.find(r => r.value === f.relation);
          });
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeFamilies() {
    this.isProcessing = true;
    const payload: UpdateEmployeeFamilyRequest = {
      employeeId: this.employeeId,
      employeeFamily: this.families
    };
    this.employeeService.updateEmployeeFamily(payload)
      .then((response: EmployeeFamilyResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee family details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.families = response.employeeFamily;
          this.families.map(f => {
            f.relationSelection = this.relationshipOptions.find(r => r.value === f.relation);
          });
          this.setActiveFamilies();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.family = new EmployeeFamily();
    const added = this.activeFamilies.map(f => f.relation).filter(m => this.oneTimeSelection.indexOf(m) >= 0);
    this.availableRelationOptions = this.relationshipOptions.filter(f => added.indexOf(f.value) === -1);
    if (form) {
      form.reset();
    }
    this.familyModal.showModal();
  }

  edit(item: EmployeeFamily) {
    this.isUpdating = true;
    this.family = Object.assign({}, item);
    this.familyModal.showModal();
    this.showMediclaim = AppSettings.mediclaimAllowed.indexOf(this.family.relation) >= 0;
    const added = this.activeFamilies.map(f => f.relation).filter(m => this.oneTimeSelection.indexOf(m) >= 0);
    this.availableRelationOptions =
      this.relationshipOptions.filter(f => added.indexOf(f.value) === -1 || f.value === item.relation);
  }

  addOrUpdate() {
    const family = Object.assign({}, this.family);

    const activeOthers = this.activeFamilies.filter(a =>
      family.employeeFamilyId
        ? a.employeeFamilyId !== family.employeeFamilyId
        : a.tempId
          ? a.tempId !== family.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.relation.trim().toLowerCase() === family.relation.trim().toLowerCase()
      && this.oneTimeSelection.indexOf(a.relation) >= 0)
      ? true
      : false;

    if (!this.isAdded) {
      if (!this.isUpdating) {
        family.isActive = true;
        family.tempId = ++this.tempId;
        this.families.push(family);
        this.setActiveFamilies();
      } else {
        if (family.employeeFamilyId) {
          const addedFamily = this.families.find(l => l.employeeFamilyId === family.employeeFamilyId);
          if (addedFamily) {
            addedFamily.relation = family.relation;
            addedFamily.relationSelection = family.relationSelection;
            addedFamily.name = family.name;
            addedFamily.address = family.address;
            addedFamily.phone = family.phone;
            addedFamily.email = family.email;
            addedFamily.dob = family.dob;
            addedFamily.occupation = family.occupation;
            addedFamily.isEmergencyContact = family.isEmergencyContact;
            addedFamily.isDependant = family.isDependant;
            addedFamily.isAlive = family.isAlive;
            addedFamily.isOptedForMediclaim = family.isOptedForMediclaim;
            addedFamily.gender = family.gender;
          }
        } else {
          const addedFamily = this.families.find(l => l.tempId === family.tempId);
          if (addedFamily) {
            addedFamily.relation = family.relation;
            addedFamily.relationSelection = family.relationSelection;
            addedFamily.name = family.name;
            addedFamily.address = family.address;
            addedFamily.phone = family.phone;
            addedFamily.email = family.email;
            addedFamily.dob = family.dob;
            addedFamily.occupation = family.occupation;
            addedFamily.isEmergencyContact = family.isEmergencyContact;
            addedFamily.isDependant = family.isDependant;
            addedFamily.isOptedForMediclaim = family.isOptedForMediclaim;
            addedFamily.isAlive = family.isAlive;
            addedFamily.gender = family.gender;
          }
        }
      }

      this.updateEmployeeFamilies();
      this.familyModal.hideModal();
    }
  }

  deleteAlert(item: EmployeeFamily) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Family Member?',
      content: [
        'Once you have deleted the added family member information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Family',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  onRelationChange($event) {
    this.family.relation = $event.value;
    this.showMediclaim = AppSettings.mediclaimAllowed.indexOf(this.family.relation) >= 0;
    if (!this.showMediclaim) {
      this.family.isOptedForMediclaim = false;
    }
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'family'
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
