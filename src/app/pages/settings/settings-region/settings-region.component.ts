import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanyRegion, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-region',
  templateUrl: './settings-region.component.html',
  styleUrls: ['./settings-region.component.scss']
})
export class SettingsRegionComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('regions') regions: CompanyRegion[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('regionModal', { static: false }) regionModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  activeRegions: CompanyRegion[] = [];
  region: CompanyRegion = new CompanyRegion();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('regions');
    this.regions = this.settingsService.getCompanySettingsValue().regions;

    if (!this.regions) {
      this.regions = [];
    }
    this.setActiveRegions();
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

  private delete = (item: CompanyRegion) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveRegions();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Regions', this.regions)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company region details successfully.');
          } else {
            this.toaster.success('Company region deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.regions = response.regions;
          this.setActiveRegions();

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
    this.region = new CompanyRegion();
    this.regionModal.showModal();
  }

  addOrUpdate() {
    const region = Object.assign({}, this.region);

    const activeOthers = this.activeRegions.filter(a =>
      region.regionId
        ? a.regionId !== region.regionId
        : a.tempId
          ? a.tempId !== region.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.region.trim().toLowerCase() === region.region.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {

      if (!this.isUpdating) {
        region.isActive = true;
        region.employeesCount = 0;
        region.tempId = ++this.tempId;
        this.regions.push(region);
        this.setActiveRegions();
      } else {
        if (region.regionId) {
          const addedRegion = this.regions.find(l => l.regionId === region.regionId);
          if (addedRegion) {
            addedRegion.region = region.region;
            addedRegion.description = region.description;
          }
        } else {
          const addedRegion = this.regions.find(l => l.tempId === region.tempId);
          if (addedRegion) {
            addedRegion.region = region.region;
            addedRegion.description = region.description;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.regionModal.hideModal();
    }
  }

  edit(item: CompanyRegion) {
    this.isAdded = false;
    this.isUpdating = true;
    this.region = Object.assign({}, item);
    this.regionModal.showModal();
  }

  setActiveRegions() {
    this.regions = this.regions.filter(i => i.regionId || (!i.regionId && i.isActive));
    this.activeRegions = this.regions.filter(i => i.isActive);
  }

  deleteAlert(item: CompanyRegion) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this region. You can delete a region only when there are no employees in the region.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Region?',
        content: [
          'When you delete a region, it will be removed from the list of all the regions and this action cannot be undone.',
          'Please click the save regions button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Region',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
