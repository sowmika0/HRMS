import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanysettingsResponse, UploadDocumentType } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-document-type',
  templateUrl: './settings-document-type.component.html',
  styleUrls: ['./settings-document-type.component.scss']
})
export class SettingsDocumentTypeComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('documentTypes') documentTypes: UploadDocumentType[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('documentTypeModal', { static: false }) documentTypeModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  activeDocumentTypes: UploadDocumentType[] = [];
  documentType: UploadDocumentType = new UploadDocumentType();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('documentTypes');
    this.documentTypes = this.settingsService.getCompanySettingsValue().documentTypes;

    if (!this.documentTypes) {
      this.documentTypes = [];
    }
    this.setActiveDocumentTypes();
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 3
        },
      ]
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  private delete = (item: UploadDocumentType) => {
    item.isActive = false;
    item.documentsCount = 0;
    item.isRestricted = false;
    this.setActiveDocumentTypes();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('DocumentTypes', this.documentTypes)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company document type details successfully.');
          } else {
            this.toaster.success('Company document type deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.documentTypes = response.documentTypes;
          this.setActiveDocumentTypes();

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isAdded = false;
    form.reset();
    this.isUpdating = false;
    this.documentType = new UploadDocumentType();
    this.documentTypeModal.showModal();
  }

  addOrUpdate() {
    const documentType = Object.assign({}, this.documentType);

    const activeOthers = this.activeDocumentTypes.filter(a =>
      documentType.documentTypeId
        ? a.documentTypeId !== documentType.documentTypeId
        : a.tempId
          ? a.tempId !== documentType.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.documentType.trim().toLowerCase() === documentType.documentType.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {
      if (!this.isUpdating) {
        documentType.isActive = true;
        documentType.documentsCount = 0;
        documentType.tempId = ++this.tempId;
        this.documentTypes.push(documentType);
        this.setActiveDocumentTypes();
      } else {
        if (documentType.documentTypeId) {
          const addedDocumentType = this.documentTypes.find(l => l.documentTypeId === documentType.documentTypeId);
          if (addedDocumentType) {
            addedDocumentType.documentType = documentType.documentType;
            addedDocumentType.description = documentType.description;
            addedDocumentType.isRestricted = documentType.isRestricted;
          }
        } else {
          const addedDocumentType = this.documentTypes.find(l => l.tempId === documentType.tempId);
          if (addedDocumentType) {
            addedDocumentType.documentType = documentType.documentType;
            addedDocumentType.description = documentType.description;
            addedDocumentType.isRestricted = documentType.isRestricted;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.documentTypeModal.hideModal();
    }
  }

  edit(item: UploadDocumentType) {
    this.isAdded = false;
    this.isUpdating = true;
    this.documentType = Object.assign({}, item);
    this.documentTypeModal.showModal();
  }

  setActiveDocumentTypes() {
    this.documentTypes = this.documentTypes.filter(i => i.documentTypeId || (!i.documentTypeId && i.isActive));
    this.activeDocumentTypes = this.documentTypes.filter(i => i.isActive);
  }

  deleteAlert(item: UploadDocumentType) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete DocumentType?',
      content: [
        'When you delete a document type, it will be removed from the list of all the document types and this action cannot be undone.',
        'The documents uploaded with this type will still be available but new documents with this type cannot be uploaded',
        'Please click the save document types button in the bottom to save the changes made.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

}
