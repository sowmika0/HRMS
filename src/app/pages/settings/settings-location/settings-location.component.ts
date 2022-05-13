import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters, RegEx, States } from 'src/app/app.constants';
import { SelectOption, SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanyLocation, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-location',
  templateUrl: './settings-location.component.html',
  styleUrls: ['./settings-location.component.scss']
})
export class SettingsLocationComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('locations') locations: CompanyLocation[] = [];
  
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('locationModal', { static: false }) locationModal: CustomModalComponent;

  regex = RegEx;
  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  statesList: SelectOption[] = [];
  dtOptions: DataTables.Settings = {};
  activeLocations: CompanyLocation[] = [];
  location: CompanyLocation = new CompanyLocation();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('locations');
    this.locations = this.settingsService.getCompanySettingsValue().locations;

    if (!this.locations) {
      this.locations = [];
    }
    var stateList = States.states;
    stateList.map(s => {
      this.statesList.push({
        label: s.name,
        value: s.code
      });
    })
    this.setActiveLocations();
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 4
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

  private delete = (item: CompanyLocation) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveLocations();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Locations', this.locations)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company category details successfully.');
          } else {
            this.toaster.success('Company category deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.locations = response.locations;
          this.setActiveLocations();
          
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
    this.location = new CompanyLocation();
    this.location.country = 'India';
    this.locationModal.showModal();
  }

  addOrUpdate() {
    const location = Object.assign({}, this.location);

    const activeOthers = this.activeLocations.filter(a =>
      location.locationId
        ? a.locationId !== location.locationId
        : a.tempId
          ? a.tempId !== location.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.location.trim().toLowerCase() === location.location.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {

      if (!this.isUpdating) {
        location.isActive = true;
        location.employeesCount = 0;
        location.tempId = ++this.tempId;
        this.locations.push(location);
        this.setActiveLocations();
      } else {
        if (location.locationId) {
          const addedLocation = this.locations.find(l => l.locationId === location.locationId);
          if (addedLocation) {
            addedLocation.location = location.location;
            addedLocation.gstNumber = location.gstNumber;
            addedLocation.address = location.address;
            addedLocation.phone = location.phone;
            addedLocation.email = location.email;
            addedLocation.state = location.state;
            addedLocation.stateSelection = location.stateSelection;
            addedLocation.country = location.country;
          }
        } else {
          const addedLocation = this.locations.find(l => l.tempId === location.tempId);
          if (addedLocation) {
            addedLocation.location = location.location;
            addedLocation.gstNumber = location.gstNumber;
            addedLocation.address = location.address;
            addedLocation.phone = location.phone;
            addedLocation.email = location.email;
            addedLocation.state = location.state;
            addedLocation.country = location.country;
            addedLocation.stateSelection = location.stateSelection;
          }
        }
      }
      this.updateCompanySettings('edit');
      this.locationModal.hideModal();
    }
  }

  edit(item: CompanyLocation) {
    this.isAdded = false;
    this.isUpdating = true;
    this.location = Object.assign({}, item);
    if (!this.location.country) {
      this.location.country = 'India';
    }
    this.locationModal.showModal();
  }

  setActiveLocations() {
    this.locations = this.locations.filter(i => i.locationId || (!i.locationId && i.isActive));
    this.activeLocations = this.locations.filter(i => i.isActive);
    this.activeLocations.map(l => {
      l.stateSelection = this.statesList.find(s => s.value === l.state);
    });
  }

  deleteAlert(item: CompanyLocation) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this category. You can delete a category only when there are no employees in the category.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete category?',
        content: [
          'When you delete a category, it will be removed from the list of all the category and this action cannot be undone.',
          'Please click the save category button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete category',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
