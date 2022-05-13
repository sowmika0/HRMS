import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeeDocument,
  EmployeeDocumentActionRequest,
  EmployeeDocumentResponse,
} from '../employee-details.model';
import { SelectOption, SelectOptionResponse } from './../../../../app.model';

import { AppService } from 'src/app/app.service';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { FileFormats } from '../../../../app.constants';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { UploadEmployeeDocumentRequest } from './../employee-details.model';

@Component({
  selector: 'app-employee-document',
  templateUrl: './employee-document.component.html',
  styleUrls: ['./employee-document.component.scss']
})
export class EmployeeDocumentComponent implements OnInit {

  @ViewChild('documentForm', { static: false }) documentForm: NgForm;
  @ViewChild('documentModal', { static: false }) documentModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  canEdit = false;
  employeeId = '';
  isUpdating = false;
  uploadingFile: File;
  fileRejected = false;
  document: EmployeeDocument;
  isProcessing = false;
  documents: EmployeeDocument[] = [];
  documentTypeOptions: SelectOption[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();
  isAllowed = false;

  fileFormats = FileFormats.allFormats;

  loggedInUserScreen = true;
  haveAccess: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private roleSettingsService: RoleSettingsService,
    private appService: AppService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = this.role === 'hr' || this.role === 'self';
    this.icon = this.employeeService.getSectionTypeIcon('documents');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeDocuments();
    this.getDocumenTypesForDropdown();
  }

  private delete = (item: EmployeeDocument) => {
    this.isProcessing = true;
    const payload: EmployeeDocumentActionRequest = {
      employeeId: this.employeeId,
      documentId: item.employeeDocumentId
    };
    this.employeeService.deleteEmployeeDocument(payload)
      .then((response: EmployeeDocumentResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee documents successfully.');
          this.documents = response.employeeDocuments;
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  getDocumenTypesForDropdown() {
    this.employeeService.getDocumentTypesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.documentTypeOptions = response.options;
          this.documents.map(d => {
            d.documentTypeSelection = this.documentTypeOptions.find(t => t.value === d.documentTypeId);
          });
        }
      })
  }

  findAccess(data: EmployeeDocumentResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeDocuments() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeDocuments(payload)
      .then((response: EmployeeDocumentResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.isAllowed = response.isAllowed;
          this.documents = response.employeeDocuments;
          this.documents.map(d => {
            d.documentTypeSelection = this.documentTypeOptions.find(a => a.value === d.documentTypeId);
          })
        }
      })
  }

  updateEmployeeDocuments() {
    this.isProcessing = true;
    const payload: UploadEmployeeDocumentRequest = {
      employeeId: this.employeeId,
      file: this.uploadingFile,
      documentName: this.document.name,
      documentTypeId: this.document.documentTypeId,
      documentId: this.document.employeeDocumentId
    };
    this.employeeService.uploadEmployeeDocument(payload)
      .then((response: EmployeeDocumentResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee documents successfully.');
          this.documents = response.employeeDocuments;
          this.documents.map(d => {
            d.documentTypeSelection = this.documentTypeOptions.find(t => t.value === d.documentTypeId);
          });
          this.documentModal.hideModal();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.document = new EmployeeDocument();
    if (form) {
      form.reset();
    }
    this.documentModal.showModal();
  }

  edit(item: EmployeeDocument) {
    this.isUpdating = true;
    this.document = Object.assign({}, item);
    this.documentModal.showModal();
  }

  deleteAlert(item: EmployeeDocument) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Document?',
      content: [
        'Once you have deleted the added document information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Document',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  onFileSelected(event) {
    this.fileRejected = false;
    if (event.rejectedFiles.length > 0) {
      this.fileRejected = true;
    } else {

      let isWrongExtension = false;
      event.addedFiles.map(f => {
        var count = (f.name.match(/\./g) || []).length;
        if (count > 1) {
          this.fileRejected = true;
          isWrongExtension = true;
        }
      });

      if (!isWrongExtension) {
        this.uploadingFile = undefined;
        setTimeout(() => { this.uploadingFile = event.addedFiles[0]; }, 100);
      }

    }
  }

  removeUploadedFile() {
    this.uploadingFile = undefined;
  }

  view(document: EmployeeDocument) {
    const url = this.appService.fileBaseUrl + document.fileUrl.replace('hrms/', '');
    window.open(url, "_blank");
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'documents'
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
