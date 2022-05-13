import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeeReference,
  EmployeeReferenceResponse,
  UpdateEmployeeReferenceRequest,
} from '../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RegEx } from 'src/app/app.constants';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-reference',
  templateUrl: './employee-reference.component.html',
  styleUrls: ['./employee-reference.component.scss']
})
export class EmployeeReferenceComponent implements OnInit {

  @ViewChild('referenceForm', { static: false }) referenceForm: NgForm;
  @ViewChild('referenceModal', { static: false }) referenceModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  regex = RegEx;
  canAdd = false;
  canEdit = false;
  employeeId = '';
  isUpdating = false;
  reference: EmployeeReference;
  isProcessing = false;
  references: EmployeeReference[] = [];
  activeReferences: EmployeeReference[] = [];
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
    this.canEdit = this.role === 'hr' || this.role === 'self';
    this.icon = this.employeeService.getSectionTypeIcon('reference');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeReferences();
  }

  private delete = (item: EmployeeReference) => {
    item.isActive = false;
    this.setActiveReferences();
    this.updateEmployeeReferences();
  }

  setActiveReferences() {
    this.references = this.references.filter(i => i.employeeReferenceId || (!i.employeeReferenceId && i.isActive));
    this.activeReferences = this.references.filter(i => i.isActive);
  }

  findAccess(data: EmployeeReferenceResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeReferences() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeReference(payload)
      .then((response: EmployeeReferenceResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.canAdd = response.canAdd;
          this.references = response.employeeReference;
          this.setActiveReferences();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  updateEmployeeReferences() {
    this.isProcessing = true;
    const payload: UpdateEmployeeReferenceRequest = {
      employeeId: this.employeeId,
      employeeReference: this.references
    };
    this.employeeService.updateEmployeeReference(payload)
      .then((response: EmployeeReferenceResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee reference details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.references = response.employeeReference;
          this.setActiveReferences();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.reference = new EmployeeReference();
    if (form) {
      form.reset();
    }
    this.referenceModal.showModal();
  }

  edit(item: EmployeeReference) {
    this.isUpdating = true;
    this.reference = Object.assign({}, item);
    this.referenceModal.showModal();
  }

  addOrUpdate() {
    const reference = Object.assign({}, this.reference);
    if (!this.isUpdating) {
      reference.isActive = true;
      reference.tempId = ++this.tempId;
      this.references.push(reference);
      this.setActiveReferences();
    } else {
      if (reference.employeeReferenceId) {
        const addedReference = this.references.find(l => l.employeeReferenceId === reference.employeeReferenceId);
        if (addedReference) {
          addedReference.name = reference.name;
          addedReference.designation = reference.designation;
          addedReference.company = reference.company;
          addedReference.phone = reference.phone;
          addedReference.email = reference.email;
          addedReference.remarks = reference.remarks;
          addedReference.address = reference.address;
        }
      } else {
        const addedReference = this.references.find(l => l.tempId === reference.tempId);
        if (addedReference) {
          addedReference.name = reference.name;
          addedReference.designation = reference.designation;
          addedReference.company = reference.company;
          addedReference.phone = reference.phone;
          addedReference.email = reference.email;
          addedReference.remarks = reference.remarks;
          addedReference.address = reference.address;
        }
      }
    }

    this.updateEmployeeReferences();
    this.referenceModal.hideModal();
  }

  deleteAlert(item: EmployeeReference) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Reference?',
      content: [
        'Once you have deleted the added reference information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Reference',
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
      section: 'reference'
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
