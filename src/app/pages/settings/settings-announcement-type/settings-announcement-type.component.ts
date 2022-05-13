import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { AnnouncementType, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-announcement-type',
  templateUrl: './settings-announcement-type.component.html',
  styleUrls: ['./settings-announcement-type.component.scss']
})
export class SettingsAnnouncementTypeComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('announcementTypes') announcementTypes: AnnouncementType[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('announcementTypeModal', { static: false }) announcementTypeModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  activeAnnouncementTypes: AnnouncementType[] = [];
  announcementType: AnnouncementType = new AnnouncementType();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('announcementTypes');
    this.announcementTypes = this.settingsService.getCompanySettingsValue().announcementTypes;

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 3
        },
      ]
    });

    this.setActiveAnnouncementTypes();
    if (!this.announcementTypes) {
      this.announcementTypes = [];
    }
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  private delete = (item: AnnouncementType) => {
    item.isActive = false;
    item.announcementCount = 0;
    this.setActiveAnnouncementTypes();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('AnnouncementTypes', this.announcementTypes)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'update') {
            this.toaster.success('Updated company announcement type details successfully.');
          } else {
            this.toaster.success('Announcement type deleted successfully.');
          }
          this.announcementTypes = response.announcementTypes;
          this.settingsService.setCompanySettingsValue(response);
          this.setActiveAnnouncementTypes();
          
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
    this.announcementType = new AnnouncementType();
    this.announcementTypeModal.showModal();
  }

  addOrUpdate() {
    const announcementType = Object.assign({}, this.announcementType);

    const activeOthers = this.activeAnnouncementTypes.filter(a =>
      announcementType.announcementTypeId
        ? a.announcementTypeId !== announcementType.announcementTypeId
        : a.tempId
          ? a.tempId !== announcementType.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.announcementType.trim().toLowerCase() === announcementType.announcementType.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {
      if (!this.isUpdating) {
        announcementType.isActive = true;
        announcementType.announcementCount = 0;
        announcementType.tempId = ++this.tempId;
        this.announcementTypes.push(announcementType);
        this.setActiveAnnouncementTypes();
      } else {
        if (announcementType.announcementTypeId) {
          const addedAnnouncementType = this.announcementTypes.find(l => l.announcementTypeId === announcementType.announcementTypeId);
          if (addedAnnouncementType) {
            addedAnnouncementType.announcementType = announcementType.announcementType;
            addedAnnouncementType.description = announcementType.description;
          }
        } else {
          const addedAnnouncementType = this.announcementTypes.find(l => l.tempId === announcementType.tempId);
          if (addedAnnouncementType) {
            addedAnnouncementType.announcementType = announcementType.announcementType;
            addedAnnouncementType.description = announcementType.description;
          }
        }
      }
      this.updateCompanySettings('update');
      this.announcementTypeModal.hideModal();
    }
  }

  edit(item: AnnouncementType) {
    this.isAdded = false;
    this.isUpdating = true;
    this.announcementType = Object.assign({}, item);
    this.announcementTypeModal.showModal();
  }

  setActiveAnnouncementTypes() {
    this.announcementTypes = this.announcementTypes.filter(i => i.announcementTypeId || (!i.announcementTypeId && i.isActive));
    this.activeAnnouncementTypes = this.announcementTypes.filter(i => i.isActive);
  }

  deleteAlert(item: AnnouncementType) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Announcement Type?',
      content: [
        'When you delete an announcement type, it will be removed from the list of all the announcement types and this action cannot be undone.',
        'The previously created announcements with type as ' + item.announcementType + ' will still work but you cannot create new announcements with this type.',
        'Please click the save announcementTypes button in the bottom to save the changes made.'
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
