import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SelectOption, SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeAsset,
  EmployeeDataVerificationRequest,
  UpdateEmployeeAssetRequest
} from '../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { DatePickerOptions } from 'src/app/app.constants';
import { EmployeeAssetResponse } from './../employee-details.model';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-assets',
  templateUrl: './employee-assets.component.html',
  styleUrls: ['./employee-assets.component.scss']
})
export class EmployeeAssetsComponent implements OnInit {

  @ViewChild('assetForm', { static: false }) assetForm: NgForm;
  @ViewChild('assetModal', { static: false }) assetModal: CustomModalComponent;
  
  role = '';
  icon = '';
  tempId = 0;
  minDate: Date;
  employeeId = '';
  canEdit = false;
  isUpdating = false;
  assetUniqueId = '';
  isProcessing = false;
  assets: EmployeeAsset[] = [];
  assetTypes: SelectOption[] = [];
  activeAssets: EmployeeAsset[] = [];
  asset: EmployeeAsset = new EmployeeAsset();
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  maxDate = new Date(moment().format(DatePickerOptions.datePicker.dateTimeFormat));

  loggedInUserScreen = true;
  haveAccess: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private roleSettingsService: RoleSettingsService
  ) { }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.icon = this.employeeService.getSectionTypeIcon('asset');
    this.employeeId = this.employeeService.getEmployeeId();
    this.canEdit = this.role === 'hr';
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
    this.getEmployeeAssets();
    this.getAssetsForDropdown();
  }

  private delete = (item: EmployeeAsset) => {
    item.isActive = false;
    this.setActiveAssets();
    this.updateEmployeeAssets();
  }

  setActiveAssets() {
    this.assets = this.assets.filter(i => i.employeeAssetId || (!i.employeeAssetId && i.isActive));
    this.activeAssets = this.assets.filter(i => i.isActive);
    this.activeAssets.map(m => {
      m.assetIdSelection = this.assetTypes.find(a => a.value === m.assetId);
      m.givenOnText = m.givenOn ? moment(m.givenOn).format(DatePickerOptions.datePicker.dateInputFormat) : '';
    })
  }

  getAssetsForDropdown() {
    this.employeeService.getAssetsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.assetTypes = response.options;
          this.setActiveAssets();
        }
      })
  }

  findAccess(data: EmployeeAssetResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeAssets() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeAssets(payload)
      .then((response: EmployeeAssetResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.minDate = new Date(moment(response.doj).format(DatePickerOptions.datePicker.dateTimeFormat));
          this.assets = response.assets;
          this.assets.map(m => {
            m.givenOn = m.givenOn ? new Date(
              moment(m.givenOn)
                .add(10, 'hours')
                .format(this.datePickerOptions.dateTimeFormat)
            ) : null;
          });
          this.setActiveAssets();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeAssets() {
    this.isProcessing = true;
    const payload: UpdateEmployeeAssetRequest = {
      employeeId: this.employeeId,
      assets: this.assets
    };
    this.employeeService.updateEmployeeAssets(payload)
      .then((response: EmployeeAssetResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee asset details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.assets = response.assets;
          this.setActiveAssets();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.assetUniqueId = '';
    this.isUpdating = false;
    this.asset = new EmployeeAsset();
    if (form) {
      form.reset();
    }
    this.assetModal.showModal();
  }

  edit(item: EmployeeAsset) {
    this.isUpdating = true;
    this.assetUniqueId = '';
    this.asset = Object.assign({}, item);
    this.assetModal.showModal();
  }

  addOrUpdate() {
    this.asset.givenOnText = this.asset.givenOn ? moment(this.asset.givenOn).format(DatePickerOptions.datePicker.dateInputFormat) : '';
    const asset = Object.assign({}, this.asset);

    if (!this.isUpdating) {
      asset.isActive = true;
      asset.tempId = ++this.tempId;
      this.assets.push(asset);
    } else {
      if (asset.employeeAssetId) {
        const addedAsset = this.assets.find(l => l.employeeAssetId === asset.employeeAssetId);
        if (addedAsset) {
          addedAsset.assetName = asset.assetName;
          addedAsset.assetUniqueId = asset.assetUniqueId;
          addedAsset.description = asset.description;
          addedAsset.givenOn = asset.givenOn;
          addedAsset.assetId = asset.assetId;
          addedAsset.givenOnText = asset.givenOnText;
          addedAsset.assetIdSelection = asset.assetIdSelection;
        }
      } else {
        const addedAsset = this.assets.find(l => l.tempId === asset.tempId);
        if (addedAsset) {
          addedAsset.assetName = asset.assetName;
          addedAsset.assetUniqueId = asset.assetUniqueId;
          addedAsset.description = asset.description;
          addedAsset.givenOn = asset.givenOn;
          addedAsset.assetId = asset.assetId;
          addedAsset.givenOnText = asset.givenOnText;
          addedAsset.assetIdSelection = asset.assetIdSelection;
        }
      }
    }

    this.isProcessing = true;
    const payload: UpdateEmployeeAssetRequest = {
      employeeId: this.employeeId,
      assets: this.assets
    };
    this.employeeService.updateEmployeeAssets(payload)
      .then((response: EmployeeAssetResponse) => {
        if (response.isSuccess) {
          if (response.assetCodeTaken) {
            this.assetUniqueId = response.assetUniqueId;
            if (!this.isUpdating) {
              this.assets = this.assets.filter(a => a !== asset);
            }
          } else {
            this.toaster.success('Updated employee asset details successfully.');
            this.employeeService.getEmployeeVerificationSubject.next();
            this.assets = response.assets;
            this.setActiveAssets();
            this.assetModal.hideModal();
          }
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  deleteAlert(item: EmployeeAsset) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Asset?',
      content: [
        'Once you have deleted the added asset information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Asset',
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
      section: 'asset'
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
