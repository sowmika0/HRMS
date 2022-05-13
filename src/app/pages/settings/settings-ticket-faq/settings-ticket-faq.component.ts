import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters, QuillConfig } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanysettingsResponse, TicketCategory, TicketFaq } from '../settings.model';
import { SettingsService } from '../settings.service';
import { SelectOption } from './../../../app.model';

@Component({
  selector: 'app-settings-ticket-faq',
  templateUrl: './settings-ticket-faq.component.html',
  styleUrls: ['./settings-ticket-faq.component.scss']
})
export class SettingsTicketFaqComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('ticketFaqs') ticketFaqs: TicketFaq[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('ticketFaqModal', { static: false }) ticketFaqModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  quillConfig = QuillConfig.config;
  activeTicketFaqs: TicketFaq[] = [];
  dtOptions: DataTables.Settings = {};
  ticketFaq: TicketFaq = new TicketFaq();
  ticketCategories: TicketCategory[] = [];
  ticketCategoryOptions: SelectOption[] = [];
  ticketSubCategoryOptions: SelectOption[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('ticketFaq');
    this.ticketFaqs = this.settingsService.getCompanySettingsValue().ticketFaqs;

    if (!this.ticketFaqs) {
      this.ticketFaqs = [];
    }
    this.setActiveTicketFaqs();
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 2
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


  private delete = (item: TicketFaq) => {
    item.isActive = false;
    this.setActiveTicketFaqs();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('TicketFaq', this.ticketFaqs)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company ticket faq details successfully.');
          } else {
            this.toaster.success('Company ticket faq deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.ticketFaqs = response.ticketFaqs;
          this.setActiveTicketFaqs();

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  // getTicketCategories() {
  //   this.settingsService.getTicketCategoryForDropdown()
  //     .then((response: TicketCategoryInfoResponse) => {
  //       if (response.isSuccess) {
  //         this.ticketCategories = response.ticketCategories;
  //         this.ticketCategoryOptions = [];
  //         this.ticketCategories.map(m => {
  //           this.ticketCategoryOptions.push({
  //             label: m.name,
  //             value: m.ticketCategoryId
  //           });
  //         })
  //       }
  //     });
  // }

  add(form: NgForm) {
    this.isAdded = false;
    form.reset();
    this.isUpdating = false;
    this.ticketFaq = new TicketFaq();
    this.ticketFaqModal.showModal();
  }

  addOrUpdate() {
    const ticketFaq = Object.assign({}, this.ticketFaq);

    const activeOthers = this.activeTicketFaqs.filter(a =>
      ticketFaq.ticketFaqId
        ? a.ticketFaqId !== ticketFaq.ticketFaqId
        : a.tempId
          ? a.tempId !== ticketFaq.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.faqTitle.trim().toLowerCase() === ticketFaq.faqTitle.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {

      if (!this.isUpdating) {
        ticketFaq.isActive = true;
        ticketFaq.tempId = ++this.tempId;
        this.ticketFaqs.push(ticketFaq);
        this.setActiveTicketFaqs();
      } else {
        if (ticketFaq.ticketFaqId) {
          const addedTicketFaq = this.ticketFaqs.find(l => l.ticketFaqId === ticketFaq.ticketFaqId);
          if (addedTicketFaq) {
            addedTicketFaq.faqTitle = ticketFaq.faqTitle;
            addedTicketFaq.description = ticketFaq.description;
            addedTicketFaq.ticketCategoryId = ticketFaq.ticketCategoryId;
            addedTicketFaq.ticketSubCategoryId = ticketFaq.ticketSubCategoryId;
          }
        } else {
          const addedTicketFaq = this.ticketFaqs.find(l => l.tempId === ticketFaq.tempId);
          if (addedTicketFaq) {
            addedTicketFaq.faqTitle = ticketFaq.faqTitle;
            addedTicketFaq.description = ticketFaq.description;
            addedTicketFaq.ticketCategoryId = ticketFaq.ticketCategoryId;
            addedTicketFaq.ticketSubCategoryId = ticketFaq.ticketSubCategoryId;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.ticketFaqModal.hideModal();
    }
  }

  edit(item: TicketFaq) {
    this.isAdded = false;
    this.isUpdating = true;
    this.ticketFaq = Object.assign({}, item);
    this.ticketFaqModal.showModal();
  }

  setActiveTicketFaqs() {
    this.ticketFaqs = this.ticketFaqs.filter(i => i.ticketFaqId || (!i.ticketFaqId && i.isActive));
    this.activeTicketFaqs = this.ticketFaqs.filter(i => i.isActive);
  }

  deleteAlert(item: TicketFaq) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Ticket Faq?',
      content: [
        'When you delete a ticket faq, it will be removed from the list of all the questions and this action cannot be undone.',
        'After the question is deleted, the user will not be able to see this question when creating a ticket.',
        'Please click the save ticket faqs button in the bottom to save the changes made.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  // ticketCategorySelected(category: SelectOption) {
  //   const selectedCategory = this.ticketCategories.find(t => t.ticketCategoryId === category.value);
  //   if (selectedCategory) {
  //     this.ticketFaq.subCategorySelection = null;
  //     this.ticketSubCategoryOptions = [];
  //     selectedCategory.ticketSubCategories.map(s => {
  //       this.ticketSubCategoryOptions.push({
  //         label: s.name,
  //         value: s.ticketSubCategoryId
  //       });
  //     });
  //   }
  // }

}
