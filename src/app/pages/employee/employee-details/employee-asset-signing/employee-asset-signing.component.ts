import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import {
  AssetSigning,
  EmployeeActionRequest,
  EmployeeAssetResponse,
  GetAssetSigningResponse,
  UpdateEmployeeAssetSigningRequest,
} from '../employee-details.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectOption, SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { DatePickerOptions } from 'src/app/app.constants';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-asset-signing',
  templateUrl: './employee-asset-signing.component.html',
  styleUrls: ['./employee-asset-signing.component.scss']
})
export class EmployeeAssetSigningComponent implements OnInit {

  @ViewChild('assetForm', { static: false }) assetForm: NgForm;
  @ViewChild('assetModal', { static: false }) assetModal: CustomModalComponent;

  icon = '';
  employeeId = '';
  isUpdating = false;
  assetUniqueId = '';
  isProcessing = false;
  assetTypes: SelectOption[] = [];
  ownedAssets: AssetSigning[] = [];
  asset: AssetSigning = new AssetSigning();
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  maxDate: Date | string = new Date(moment().format(DatePickerOptions.datePicker.dateTimeFormat));

  loggedInUserScreen = true;
  haveAccess: boolean = false;
  role = '';

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
    this.icon = this.employeeService.getSectionTypeIcon('signing');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeAssetsOwned();
    this.getAssetsForDropdown();
  }

  getAssetsForDropdown() {
    this.employeeService.getAssetsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.assetTypes = response.options;

          this.ownedAssets.map(m => {
            m.assetIdSelection = this.assetTypes.find(a => a.value === m.assetId);
          });
        }
      })
  }

  findAccess(data: GetAssetSigningResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeAssetsOwned() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeAssetsSigning(payload)
      .then((response: GetAssetSigningResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.ownedAssets = response.assets;
          this.ownedAssets.map(m => {

            if (m.doj) {
              m.doj = new Date(moment(m.doj).format(DatePickerOptions.datePicker.dateTimeFormat));

              if (moment(this.maxDate).isSameOrBefore(moment(m.doj))) {
                m.maxDate = m.doj;
              } else {
                m.maxDate = this.maxDate;
              }
            } else {
              m.maxDate = this.maxDate;
            }

            m.givenOnText = m.givenOn ? moment(m.givenOn).format(this.datePickerOptions.dateInputFormat) : '';
            m.givenOn = m.givenOn ? new Date(
              moment(m.givenOn)
                .add(10, 'hours')
                .format(this.datePickerOptions.dateTimeFormat)
            ) : null;
            m.assetIdSelection = this.assetTypes.find(a => a.value === m.assetId);
          });
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeAssets() {
  }

  edit(item: AssetSigning) {
    this.isUpdating = true;
    this.asset = Object.assign({}, item);
    this.assetModal.showModal();
  }

  addOrUpdate() {
    this.assetUniqueId = '';
    const asset = Object.assign({}, this.asset);
    asset.givenOnText = moment(asset.givenOn).format(DatePickerOptions.datePicker.dateInputFormat);

    let addedAsset = this.ownedAssets.find(l => l.employeeAssetId === asset.employeeAssetId);
    const originalAsset = Object.assign({}, addedAsset);
    if (addedAsset) {
      addedAsset.assetUniqueId = asset.assetUniqueId;
      addedAsset.description = asset.description;
      addedAsset.givenOn = asset.givenOn;
      addedAsset.givenOnText = asset.givenOnText;
    }

    this.isProcessing = true;
    const payload: UpdateEmployeeAssetSigningRequest = {
      employeeId: this.employeeId,
      assets: this.ownedAssets
    };

    this.employeeService.updateEmployeeAssetSignings(payload)
      .then((response: EmployeeAssetResponse) => {
        if (response.isSuccess) {
          if (response.assetCodeTaken) {
            this.assetUniqueId = response.assetUniqueId;
            addedAsset.assetUniqueId = originalAsset.assetUniqueId;
            addedAsset.description = originalAsset.description;
            addedAsset.givenOn = originalAsset.givenOn;
            addedAsset.givenOnText = originalAsset.givenOnText;
          } else {
            this.assetModal.hideModal();
            this.toaster.success('Updated employee asset details successfully.');
            this.getEmployeeAssetsOwned();
          }
        }
      })
      .finally(() => { this.isProcessing = false; });

    this.updateEmployeeAssets();
  }

}
