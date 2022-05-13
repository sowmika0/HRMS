import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { Category, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-category',
  templateUrl: './settings-category.component.html',
  styleUrls: ['./settings-category.component.scss']
})
export class SettingsCategoryComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('categories') categories: Category[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('categoryModal', { static: false }) categoryModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  activeCategories: Category[] = [];
  dtOptions: DataTables.Settings = {};
  category: Category = new Category();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('categories');
    this.categories = this.settingsService.getCompanySettingsValue().categories;

    if (!this.categories) {
      this.categories = [];
    }
    this.setActiveCategories();
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

  private delete = (item: Category) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveCategories();
    this.updateCompanySettings('delete')
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Categories', this.categories)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company location details successfully.');
          } else {
            this.toaster.success('Company location deleted successfully.');
          }
          this.settingsService.setCompanySettingsValue(response);
          this.categories = response.categories;
          this.setActiveCategories();
          
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
    this.category = new Category();
    this.categoryModal.showModal();
  }

  addOrUpdate() {
    const category = Object.assign({}, this.category);

    const activeOthers = this.activeCategories.filter(a =>
      category.categoryId
        ? a.categoryId !== category.categoryId
        : a.tempId
          ? a.tempId !== category.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.category.trim().toLowerCase() === category.category.trim().toLowerCase())
      ? true
      : false;

    if (!this.isAdded) {
      if (!this.isUpdating) {
        category.isActive = true;
        category.employeesCount = 0;
        category.tempId = ++this.tempId;
        this.categories.push(category);
        this.setActiveCategories();
      } else {
        if (category.categoryId) {
          const addedGrade = this.categories.find(l => l.categoryId === category.categoryId);
          if (addedGrade) {
            addedGrade.category = category.category;
            addedGrade.description = category.description;
          }
        } else {
          const addedGrade = this.categories.find(l => l.tempId === category.tempId);
          if (addedGrade) {
            addedGrade.category = category.category;
            addedGrade.description = category.description;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.categoryModal.hideModal();
    }
  }

  edit(item: Category) {
    this.isAdded = false;
    this.isUpdating = true;
    this.category = Object.assign({}, item);
    this.categoryModal.showModal();
  }

  setActiveCategories() {
    this.categories = this.categories.filter(i => i.categoryId || (!i.categoryId && i.isActive));
    this.activeCategories = this.categories.filter(i => i.isActive);
  }

  deleteAlert(item: Category) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this location. You can delete a location only when there are no employees in the location.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete location?',
        content: [
          'When you delete a location, it will be removed from the list of all the locations and this action cannot be undone.',
          'Please click the save locations button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete location',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
