import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableParameters, DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { SelectOption, SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanyHoliday, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';
import { SelectOptionResponse } from './../../../app.model';

@Component({
  selector: 'app-settings-holiday',
  templateUrl: './settings-holiday.component.html',
  styleUrls: ['./settings-holiday.component.scss']
})
export class SettingsHolidayComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('holidays') holidays: CompanyHoliday[] = [];
  
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('holidayModal', { static: false }) holidayModal: CustomModalComponent;

  tempId = 0;
  isUpdating = false;
  isProcessing = false;
  isHolidayAdded = false;
  dtTrigger = new Subject<any>();
  isHolidayLocationAdded = false;
  dtOptions: DataTables.Settings = {};
  locationOptions: SelectOption[] = [];
  activeHolidays: CompanyHoliday[] = [];
  holiday: CompanyHoliday = new CompanyHoliday();
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  holidayTypes: SelectOption[] = SelectionConstants.holidayTypes;

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('calendar');
    this.holidays = this.settingsService.getCompanySettingsValue().holidays;
    this.datePickerWorkaround();

    if (!this.holidays) {
      this.holidays = [];
    }
    this.setActiveHolidays();
    this.getLocationsForDropdown();

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 3
        }, 
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


  private delete = (item: CompanyHoliday) => {
    item.isActive = false;
    this.setActiveHolidays();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Holidays', this.holidays)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company holiday details successfully.');
          } else {
            this.toaster.success('Company holiday deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.holidays = response.holidays;
          this.setActiveHolidays();
          this.datePickerWorkaround();
         
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  getLocationsForDropdown() {
    this.settingsService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
          this.setActiveHolidays();
        }
      })
  }

  add(form: NgForm) {
    this.isHolidayAdded = false;
    this.isHolidayLocationAdded = false;
    form.reset();
    this.isUpdating = false;
    this.holiday = new CompanyHoliday();
    this.holidayModal.showModal();
  }

  addOrUpdate() {
    this.isHolidayAdded = false;
    this.isHolidayLocationAdded = false;

    this.holiday.date = this.holiday.date ?
      new Date(
        moment(this.holiday.date)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      ) : '';

    const holiday = Object.assign({}, this.holiday);

    const activeOthers = this.activeHolidays.filter(a =>
      holiday.holidayId
        ? a.holidayId !== holiday.holidayId
        : a.tempId
          ? a.tempId !== holiday.tempId
          : true);

    if (holiday.locationIds && holiday.locationIds.length > 0) {
      this.isHolidayLocationAdded = activeOthers.find(a => new Date(a.date).getDate() === new Date(holiday.date).getDate()
        && a.locationIds && a.locationIds.filter(l => holiday.locationIds.indexOf(l) >= 0).length > 0)
        ? true
        : false;

    } else {
      this.isHolidayAdded = activeOthers.find(a => new Date(a.date).getDate() === new Date(holiday.date).getDate()
        && (!a.locationIds || a.locationIds.length === 0))
        ? true
        : false;
    }

    if (!this.isHolidayAdded && !this.isHolidayLocationAdded) {
      if (!this.isUpdating) {
        holiday.isActive = true;
        holiday.tempId = ++this.tempId;
        this.holidays.push(holiday);
        this.setActiveHolidays();
      } else {
        if (holiday.holidayId) {
          const addedHoliday = this.holidays.find(l => l.holidayId === holiday.holidayId);
          if (addedHoliday) {
            addedHoliday.date = holiday.date;
            addedHoliday.reason = holiday.reason;
            addedHoliday.type = holiday.type;
            addedHoliday.locationIds = holiday.locationIds;
            addedHoliday.dateText = moment(addedHoliday.date)
              .format(this.datePickerOptions.dateInputFormat);
            if (addedHoliday.locationIds && addedHoliday.locationIds.length > 0) {
              addedHoliday.selectedLocations = this.locationOptions.filter(i => addedHoliday.locationIds.indexOf(i.value) >= 0);
            } else {
              addedHoliday.selectedLocations = [{
                label: 'All Locations',
                value: ''
              }];
            }
          }
        } else {
          const addedHoliday = this.holidays.find(l => l.tempId === holiday.tempId);
          if (addedHoliday) {
            addedHoliday.date = holiday.date;
            addedHoliday.reason = holiday.reason;
            addedHoliday.type = holiday.type;
            addedHoliday.locationIds = holiday.locationIds;
            addedHoliday.dateText = moment(addedHoliday.date)
              .format(this.datePickerOptions.dateInputFormat);
            if (addedHoliday.locationIds && addedHoliday.locationIds.length > 0) {
              addedHoliday.selectedLocations = this.locationOptions.filter(i => addedHoliday.locationIds.indexOf(i.value) >= 0);
            } else {
              addedHoliday.selectedLocations = [{
                label: 'All Locations',
                value: ''
              }];
            }
          }
        }
      }
      this.updateCompanySettings('edit');
      this.holidayModal.hideModal();
    }

  }

  datePickerWorkaround() {
    this.holidays.map(h => {
      const temp = h.date;
      h.date = h.date ?
        new Date(
          moment(h.date)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat)
        ) : '';
      h.dateText = moment(h.date)
        .format(this.datePickerOptions.dateInputFormat);
    });
  }

  edit(item: CompanyHoliday) {
    this.isHolidayAdded = false;
    this.isHolidayLocationAdded = false;
    this.isUpdating = true;
    this.holiday = Object.assign({}, item);
    this.holidayModal.showModal();
  }

  setActiveHolidays() {
    this.holidays.map(h => {
      h.canDelete = moment(h.date) > moment();
      h.typeSelection = this.holidayTypes.find(v => v.value === h.type);
      if (h.locationIds) {
        h.selectedLocations = this.locationOptions.filter(i => h.locationIds.indexOf(i.value) >= 0);
      } else {
        h.selectedLocations = [{
          label: 'All Locations',
          value: ''
        }];
      }
    });
    this.holidays = this.holidays.filter(i => i.holidayId || (!i.holidayId && i.isActive));
    this.activeHolidays = this.holidays.filter(i => i.isActive);
  }

  deleteAlert(item: CompanyHoliday) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Holiday?',
      content: [
        'When you delete a holiday, it will be removed from the list of all the holidays and this action cannot be undone.',
        'Please click the save holidays button in the bottom to save the changes made.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Holiday',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  onLocationChange(items: SelectOption[]) {
    if (items && items.length > 0) {
      items = items.filter(i => i.value !== '');
      this.holiday.selectedLocations = items;
      this.holiday.locationIds = items.map(m => m.value);
    } else {
      this.holiday.locationIds = [];
      this.holiday.selectedLocations = [{
        label: 'All Locations',
        value: ''
      }];
    }
  }

  datePicked($event) {
  }

}
