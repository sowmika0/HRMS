import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanysettingsResponse, Designation } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-designation',
  templateUrl: './settings-designation.component.html',
  styleUrls: ['./settings-designation.component.scss']
})
export class SettingsDesignationComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('designations') designations: Designation[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('designationModal', { static: false }) designationModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  activeDesignations: Designation[] = [];
  designation: Designation = new Designation();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('designations');
    this.designations = this.settingsService.getCompanySettingsValue().designations;

    if (!this.designations) {
      this.designations = [];
    }
    this.setActiveDesignations();
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


  private delete = (item: Designation) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveDesignations();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Designations', this.designations)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company designation details successfully.');
          } else {
            this.toaster.success('Company designation deleted successfully.');
          }
          this.settingsService.setCompanySettingsValue(response);
          this.designations = response.designations;
          this.setActiveDesignations();
         
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
    this.designation = new Designation();
    this.designationModal.showModal();
  }

  addOrUpdate() {
    const designation = Object.assign({}, this.designation);

    const activeOthers = this.activeDesignations.filter(a =>
      designation.designationId
        ? a.designationId !== designation.designationId
        : a.tempId
          ? a.tempId !== designation.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.name.trim().toLowerCase() === designation.name.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {
      if (!this.isUpdating) {
        designation.isActive = true;
        designation.employeesCount = 0;
        designation.tempId = ++this.tempId;
        this.designations.push(designation);
        this.setActiveDesignations();
      } else {
        if (designation.designationId) {
          const addedDesignation = this.designations.find(l => l.designationId === designation.designationId);
          if (addedDesignation) {
            addedDesignation.name = designation.name;
            addedDesignation.description = designation.description;
          }
        } else {
          const addedDesignation = this.designations.find(l => l.tempId === designation.tempId);
          if (addedDesignation) {
            addedDesignation.name = designation.name;
            addedDesignation.description = designation.description;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.designationModal.hideModal();
    }
  }

  edit(item: Designation) {
    this.isAdded = false;
    this.isUpdating = true;
    this.designation = Object.assign({}, item);
    this.designationModal.showModal();
  }

  setActiveDesignations() {
    this.designations = this.designations.filter(i => i.designationId || (!i.designationId && i.isActive));
    this.activeDesignations = this.designations.filter(i => i.isActive);
  }

  deleteAlert(item: Designation) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this designation. You can delete a designation only when there are no employees in the designation.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Designation?',
        content: [
          'When you delete a designation, it will be removed from the list of all the designations and this action cannot be undone.',
          'Please click the save designations button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Designation',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
