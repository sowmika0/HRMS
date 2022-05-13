import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanyProductLine, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-product-line',
  templateUrl: './settings-product-line.component.html',
  styleUrls: ['./settings-product-line.component.scss']
})
export class SettingsProductLineComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('productLines') productLines: CompanyProductLine[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('productLineModal', { static: false }) productLineModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  activeProductLines: CompanyProductLine[] = [];
  productLine: CompanyProductLine = new CompanyProductLine();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('productLines');
    this.productLines = this.settingsService.getCompanySettingsValue().productLines;

    if (!this.productLines) {
      this.productLines = [];
    }
    this.setActiveProductLines();

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


  private delete = (item: CompanyProductLine) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveProductLines();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('ProductLines', this.productLines)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company product line details successfully.');
          } else {
            this.toaster.success('Company product line deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.productLines = response.productLines;
          this.setActiveProductLines();
          
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
    this.productLine = new CompanyProductLine();
    this.productLineModal.showModal();
  }

  addOrUpdate() {
    const productLine = Object.assign({}, this.productLine);

    const activeOthers = this.activeProductLines.filter(a =>
      productLine.productLineId
        ? a.productLineId !== productLine.productLineId
        : a.tempId
          ? a.tempId !== productLine.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.productLine.trim().toLowerCase() === productLine.productLine.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {

      if (!this.isUpdating) {
        productLine.isActive = true;
        productLine.employeesCount = 0;
        productLine.tempId = ++this.tempId;
        this.productLines.push(productLine);
        this.setActiveProductLines();
      } else {
        if (productLine.productLineId) {
          const addedProductLine = this.productLines.find(l => l.productLineId === productLine.productLineId);
          if (addedProductLine) {
            addedProductLine.productLine = productLine.productLine;
            addedProductLine.description = productLine.description;
          }
        } else {
          const addedProductLine = this.productLines.find(l => l.tempId === productLine.tempId);
          if (addedProductLine) {
            addedProductLine.productLine = productLine.productLine;
            addedProductLine.description = productLine.description;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.productLineModal.hideModal();
    }
  }

  edit(item: CompanyProductLine) {
    this.isAdded = false;
    this.isUpdating = true;
    this.productLine = Object.assign({}, item);
    this.productLineModal.showModal();
  }

  setActiveProductLines() {
    this.productLines = this.productLines.filter(i => i.productLineId || (!i.productLineId && i.isActive));
    this.activeProductLines = this.productLines.filter(i => i.isActive);
  }

  deleteAlert(item: CompanyProductLine) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this productLine. You can delete a productLine only when there are no employees in the productLine.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete ProductLine?',
        content: [
          'When you delete a productLine, it will be removed from the list of all the product lines and this action cannot be undone.',
          'Please click the save productLines button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Product Line',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
