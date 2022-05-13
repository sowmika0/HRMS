import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { SettingsService } from '../settings.service';
import { EmployeeBaseInfo, ReportingToResponse } from './../../employee/employee-details/employee-details.model';
import { CompanysettingsResponse, TicketCategory, TicketSubCategory } from './../settings.model';

@Component({
  selector: 'app-settings-ticket',
  templateUrl: './settings-ticket.component.html',
  styleUrls: ['./settings-ticket.component.scss']
})
export class SettingsTicketComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('ticketCategories') ticketCategories: TicketCategory[] = [];
  
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('ticketCategoryModal', { static: false }) ticketCategoryModal: CustomModalComponent;
  @ViewChild('ticketSubCategoryModal', { static: false }) ticketSubCategoryModal: CustomModalComponent;

  tempId = 0;
  isUpdating = false;
  isProcessing = false;
  isCategoryAdded = false;
  isSubCategoryAdded = false;
  isSubCategoryUpdating = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  hrEmployees: EmployeeBaseInfo[] = [];
  activeTicketCategories: TicketCategory[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();
  activeTicketSubCategories: TicketSubCategory[] = [];
  ticketCategory: TicketCategory = new TicketCategory();
  ticketSubCategory: TicketSubCategory = new TicketSubCategory();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('tickets');
    this.ticketCategories = this.settingsService.getCompanySettingsValue().ticketCategories;

    if (!this.ticketCategories) {
      this.ticketCategories = [];
    }
    this.setActiveTicketCategories();
    this.getAllHrEmployees();
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

  private delete = (item: TicketCategory) => {
    item.isActive = false;
    item.ticketsCount = 0;
    this.setActiveTicketCategories();
    this.updateCompanySettings('delete');
  }

  private deleteSubCategory = (item: TicketSubCategory) => {
    item.isActive = false;
    item.ticketsCount = 0;
    this.setActiveTicketSubCategories();
  }

  getAllHrEmployees() {
    this.settingsService.getHrEmployeesForDropdown()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.hrEmployees = response.employees;
          this.setActiveTicketCategories();
        }
      });
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('TicketCategory', this.ticketCategories)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company ticket category and sub category details successfully.');
          } else {
            this.toaster.success('Company ticket category and sub category deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.ticketCategories = response.ticketCategories;
          this.setActiveTicketCategories();
         
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isCategoryAdded = false;
    form.reset();
    this.isUpdating = false;
    this.ticketCategory = new TicketCategory();
    this.ticketCategory.ticketSubCategories = [];
    this.setActiveTicketSubCategories();
    this.ticketCategoryModal.showModal();
  }

  addSubCategory(form: NgForm) {
    this.isSubCategoryAdded = false;
    form.reset();
    this.isSubCategoryUpdating = false;
    this.ticketSubCategory = new TicketSubCategory();
    this.ticketSubCategoryModal.showModal();
  }

  addOrUpdate() {
    const ticketCategory = Object.assign({}, this.ticketCategory);

    const activeOthers = this.activeTicketCategories.filter(a =>
      ticketCategory.ticketCategoryId
        ? a.ticketCategoryId !== ticketCategory.ticketCategoryId
        : a.tempId
          ? a.tempId !== ticketCategory.tempId
          : true);

    this.isCategoryAdded = activeOthers.find(a => a.name.trim().toLowerCase() === ticketCategory.name.trim().toLowerCase())
      ? true
      : false;
    if (!this.isCategoryAdded) {

      if (!this.isUpdating) {
        ticketCategory.isActive = true;
        ticketCategory.ticketsCount = 0;
        ticketCategory.tempId = ++this.tempId;
        this.ticketCategories.push(ticketCategory);
        this.setActiveTicketCategories();
      } else {
        if (ticketCategory.ticketCategoryId) {
          const addedTicketCategory = this.ticketCategories.find(l => l.ticketCategoryId === ticketCategory.ticketCategoryId);
          if (addedTicketCategory) {
            addedTicketCategory.owners = ticketCategory.owners;
            addedTicketCategory.name = ticketCategory.name;
            addedTicketCategory.description = ticketCategory.description;
            addedTicketCategory.ticketSubCategories = ticketCategory.ticketSubCategories;
            addedTicketCategory.activeSubCategoriesCount = addedTicketCategory.ticketSubCategories.filter(s => s.isActive).length;
          }
        } else {
          const addedTicketCategory = this.ticketCategories.find(l => l.tempId === ticketCategory.tempId);
          if (addedTicketCategory) {
            addedTicketCategory.name = ticketCategory.name;
            addedTicketCategory.owners = ticketCategory.owners;
            addedTicketCategory.description = ticketCategory.description;
            addedTicketCategory.ticketSubCategories = ticketCategory.ticketSubCategories;
            addedTicketCategory.activeSubCategoriesCount = addedTicketCategory.ticketSubCategories.filter(s => s.isActive).length;
          }
        }
      }
      this.updateCompanySettings('edit');
      this.ticketCategoryModal.hideModal();
    }

  }

  addOrUpdateSubCategory() {
    if (!this.ticketCategory.ticketSubCategories) {
      this.ticketCategory.ticketSubCategories = [];
    }
    const ticketSubCategory = Object.assign({}, this.ticketSubCategory);

    const activeOthers = this.activeTicketSubCategories.filter(a =>
      ticketSubCategory.ticketSubCategoryId
        ? a.ticketSubCategoryId !== ticketSubCategory.ticketSubCategoryId
        : a.tempId
          ? a.tempId !== ticketSubCategory.tempId
          : true);

    this.isSubCategoryAdded = activeOthers.find(a => a.name.trim().toLowerCase() === ticketSubCategory.name.trim().toLowerCase())
      ? true
      : false;
    if (!this.isSubCategoryAdded) {

      if (!this.isSubCategoryUpdating) {
        ticketSubCategory.isActive = true;
        ticketSubCategory.ticketsCount = 0;
        ticketSubCategory.tempId = ++this.tempId;
        this.ticketCategory.ticketSubCategories.push(ticketSubCategory);
        this.setActiveTicketSubCategories();
        this.ticketCategory.activeSubCategoriesCount += 1;
      } else {
        if (ticketSubCategory.ticketSubCategoryId) {
          const addedTicketSubCategory = this.ticketCategory.ticketSubCategories
            .find(l => l.ticketSubCategoryId === ticketSubCategory.ticketSubCategoryId);
          if (addedTicketSubCategory) {
            addedTicketSubCategory.name = ticketSubCategory.name;
            addedTicketSubCategory.description = ticketSubCategory.description;
          }
        } else {
          const addedTicketSubCategory = this.ticketCategory.ticketSubCategories
            .find(l => l.tempId === ticketSubCategory.tempId);
          if (addedTicketSubCategory) {
            addedTicketSubCategory.name = ticketSubCategory.name;
            addedTicketSubCategory.description = ticketSubCategory.description;
          }
        }
      }
      this.ticketSubCategoryModal.hideModal();
    }

  }

  edit(item: TicketCategory) {
    this.isCategoryAdded = false;
    this.isUpdating = true;
    this.ticketCategory = Object.assign({}, item);
    this.setActiveTicketSubCategories();
    this.ticketCategoryModal.showModal();
  }

  editSubCategory(item: TicketSubCategory) {
    this.isSubCategoryAdded = false;
    this.isSubCategoryUpdating = true;
    this.ticketSubCategory = Object.assign({}, item);
    this.ticketSubCategoryModal.showModal();
  }

  setActiveTicketCategories() {
    this.ticketCategories = this.ticketCategories.filter(i => i.ticketCategoryId || (!i.ticketCategoryId && i.isActive));
    this.activeTicketCategories = this.ticketCategories.filter(i => i.isActive);
    this.activeTicketCategories.map(t => {
      t.activeSubCategoriesCount = t.ticketSubCategories.filter(s => s.isActive).length;
      t.ownersSelection = this.hrEmployees.filter(f => t.owners.find(o => o === f.employeeId));
    })
  }

  setActiveTicketSubCategories() {
    this.ticketCategory.ticketSubCategories =
      this.ticketCategory.ticketSubCategories.filter(i => i.ticketSubCategoryId || (!i.ticketSubCategoryId && i.isActive));
    this.activeTicketSubCategories = this.ticketCategory.ticketSubCategories.filter(i => i.isActive);
  }

  deleteAlert(item: TicketCategory) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Ticket Category?',
      content: [
        'When you delete a ticket category, it will be removed from the list of all the ticket categories and this action cannot be undone.',
        'Please click the save ticket categories button in the bottom to save the changes made.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  deleteSubCategoryAlert(item: TicketCategory) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Ticket Sub Category?',
      content: [
        'When you delete a ticket sub category, it will be removed from the list of all the ticket sub categories and this action cannot be undone.',
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.deleteSubCategory,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
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
