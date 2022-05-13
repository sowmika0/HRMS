import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { EmployeeBaseInfo, ReportingToResponse } from '../../employee/employee-details/employee-details.model';
import { AssetType, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-assets',
  templateUrl: './settings-assets.component.html',
  styleUrls: ['./settings-assets.component.scss']
})
export class SettingsAssetsComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('assetTypes') assetTypes: AssetType[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('assetTypeModal', { static: false }) assetTypeModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  activeAssetTypes: AssetType[] = [];
  employees: EmployeeBaseInfo[] = [];
  dtOptions: DataTables.Settings = {};
  assetType: AssetType = new AssetType();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('asset');
    this.assetTypes = this.settingsService.getCompanySettingsValue().assetTypes;

    if (!this.assetTypes) {
      this.assetTypes = [];
    }
    this.setActiveAssetTypes();
    this.getAllEmployees();
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


  private delete = (item: AssetType) => {
    item.isActive = false;
    item.employeesActive = 0;
    this.setActiveAssetTypes();
    this.updateCompanySettings('delete')
  }

  getAllEmployees() {
    this.settingsService.getAllEmployeesForDropdown()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.employees = response.employees;
          this.setActiveAssetTypes();
        }
      });
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('AssetTypes', this.assetTypes)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company asset type details successfully.');
          } else {
            this.toaster.success('Company asset type deleted successfully.');
          }
          this.settingsService.setCompanySettingsValue(response);
          this.assetTypes = response.assetTypes;
          this.setActiveAssetTypes();
         
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
    this.assetType = new AssetType();
    this.assetTypeModal.showModal();
  }

  addOrUpdate() {
    const assetType = Object.assign({}, this.assetType);

    const activeOthers = this.activeAssetTypes.filter(a =>
      assetType.assetTypeId
        ? a.assetTypeId !== assetType.assetTypeId
        : a.tempId
          ? a.tempId !== assetType.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.assetType.trim().toLowerCase() === assetType.assetType.trim().toLowerCase())
      ? true
      : false;

    if (!this.isAdded) {
      if (!this.isUpdating) {
        assetType.isActive = true;
        assetType.employeesActive = 0;
        assetType.tempId = ++this.tempId;
        this.assetTypes.push(assetType);
        this.setActiveAssetTypes();
      } else {
        if (assetType.assetTypeId) {
          const addedAssetType = this.assetTypes.find(l => l.assetTypeId === assetType.assetTypeId);
          if (addedAssetType) {
            addedAssetType.assetType = assetType.assetType;
            addedAssetType.description = assetType.description;
            addedAssetType.signingAuthorities = assetType.signingAuthorities;
          }
        } else {
          const addedAssetType = this.assetTypes.find(l => l.tempId === assetType.tempId);
          if (addedAssetType) {
            addedAssetType.assetType = assetType.assetType;
            addedAssetType.description = assetType.description;
            addedAssetType.signingAuthorities = assetType.signingAuthorities;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.assetTypeModal.hideModal();
    }
  }

  edit(item: AssetType) {
    this.isAdded = false;
    this.isUpdating = true;
    this.assetType = Object.assign({}, item);
    this.assetTypeModal.showModal();
  }

  setActiveAssetTypes() {
    this.assetTypes = this.assetTypes.filter(i => i.assetTypeId || (!i.assetTypeId && i.isActive));
    this.activeAssetTypes = this.assetTypes.filter(i => i.isActive);
    this.activeAssetTypes.map(t => {
      t.signingAuthoritiesSelection = this.employees.filter(f => t.signingAuthorities.find(o => o === f.employeeId));
    })
  }

  deleteAlert(item: AssetType) {
    if (item.employeesActive && item.employeesActive > 0) {
      this.toaster.error('There are employees allocated this asset type. You can delete a asset type only when there are no employees given this type of asset.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Asset Type?',
        content: [
          'When you delete a asset type, it will be removed from the list of all the asset types and this action cannot be undone.',
          'Please click the save asset types button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Asset Type',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

  selectMultiple(values: EmployeeBaseInfo[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.employeeId);
    }

    return item;
  }

  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }

}
