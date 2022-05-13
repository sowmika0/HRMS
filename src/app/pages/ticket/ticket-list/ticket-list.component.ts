import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BaseResponse, SelectOption, SweetAlertValue, UploadFile } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { ObjectToUrlService } from 'src/app/shared/services/obj-to-url-service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import {
  EmployeeActionRequest,
  EmployeeBaseInfo,
  ReportingToResponse,
} from '../../employee/employee-details/employee-details.model';
import {
  AddCommentResponse,
  AddTicketCommentRequest,
  AddUpdateTicketRequest,
  CategorySelect,
  DeleteTicketCommentActionRequest,
  SubCategorySelect,
  Ticket,
  TicketActionRequest,
  TicketCategories,
  TicketCategory,
  TicketComment,
  TicketDetailsResponse,
  TicketFaq,
  TicketFilterRequest,
  TicketListResponse,
  TicketSubCategory,
} from '../ticket.model';
import { TicketService } from '../ticket.service';
import { DataTableParameters, DatePickerOptions, FileFormats, SelectionConstants } from './../../../app.constants';
import { MiscService } from './../../../shared/services/misc.service';
import { FaqResponse, TicketAttachment } from './../ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

  @ViewChild('faqModal', { static: false }) faqModal: CustomModalComponent;
  @ViewChild('ticketModal', { static: false }) ticketModal: CustomModalComponent;
  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;
  @ViewChild('faqInfoModal', { static: false }) faqInfoModal: CustomModalComponent;
  @ViewChild('commentForm', { static: false }) commentForm: NgForm;

  isHr: boolean;
  employeeId = '';
  filtersDone = 0;
  isAdmin: boolean;
  today = new Date();
  isUpdating = false;
  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;
  fileRejected = false;
  faqSearchText: string;
  selectedFaq: TicketFaq;
  tickets: Ticket[] = [];
  isticketCreator = false;
  uploadingPercentage = 0;
  faqList: TicketFaq[] = [];
  isCommentProcessing = false;
  categoriesList: TicketCategory[];
  searchedFaqList: TicketFaq[] = [];
  ticketFilter: TicketFilterRequest;
  commentsList: TicketComment[] = [];
  defaultFilter: TicketFilterRequest;
  statusOptions: SelectOption[] = [];
  dtOptions: DataTables.Settings = {};
  newAttachmentInfo: UploadFile[] = [];
  subCategoryList: TicketSubCategory[];
  assignedToSameAsLoggedInUser = false;
  categoryOptions: SelectOption[] = [];
  employeePayload: EmployeeActionRequest;
  subCategoryOptions: SelectOption[] = [];
  commentOptions: DataTables.Settings = {};
  ticketCategorySelection: CategorySelect[];
  activeAttachments: TicketAttachment[] = [];
  reportingToOptions: EmployeeBaseInfo[] = [];
  employeeFitlerOptions: EmployeeBaseInfo[] = [];
  ticketSubCategorySelection: SubCategorySelect[];
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  attachmentTypeOptions = SelectionConstants.attachmentTypeOptions;
  newTicket: AddUpdateTicketRequest = new AddUpdateTicketRequest();
  categoriesListResponse: TicketCategories = new TicketCategories();

  fileFormats = FileFormats.allFormats;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private ticketService: TicketService,
    private localStorageService: LocalStorageService,
    private miscService: MiscService,
    private objToUrlService: ObjectToUrlService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.faqSearchText = '';
    const userInfo = this.localStorageService.getLoggedInUserInfo();
    this.employeeId = userInfo.employeeId;
    this.isHr = userInfo.role === 'HR' ? true : false;
    this.isAdmin = userInfo.role === 'Admin' ? true : false;
    this.employeePayload = {
      employeeId: this.employeeId
    };

    this.defaultFilter = {
      employeeId: '',
      addedBy: [],
      category: '',
      endDate: '',
      startDate: '',
      status: [],
      subCategory: '',
      title: '',
      addedBySelections: null
    };
    this.ticketFilter = Object.assign({}, this.defaultFilter);

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 7
        }
      ]
    });

    this.commentOptions = Object.assign(DataTableParameters.dataTableOptions, {
      lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
      columnDefs: [
        {
          orderable: false,
          targets: 2
        }
      ]
    });

    this.statusOptions = [
      { label: 'Open', value: 'Open' },
      { label: 'Working', value: 'Working' },
      { label: 'Closed', value: 'Closed' },
    ];

    this.getTicketCategoryInformation();
    this.setFilterParametersFromUrl();
    this.getAllEmployeesForFilter();
    // this.getAllTickets();
    this.getFaq();
    this.trackUploading();
  }

  private startTicket = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.startTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllTickets();
        }
        if (this.isUpdating) {
          this.ticketModal.hideModal();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
    if (this.isUpdating) {
      this.ticketModal.hideModal();
    }
  }

  private undoStartTicket = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.undoStartTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {

          this.getAllTickets();
        }
        if (this.isUpdating) {
          this.ticketModal.hideModal();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
    if (this.isUpdating) {
      this.ticketModal.hideModal();
    }
  }

  private closeTicket = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.closeTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {

          this.getAllTickets();
        }
        if (this.isUpdating) {
          this.ticketModal.hideModal();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
    if (this.isUpdating) {
      this.ticketModal.hideModal();
    }
  }

  private undoCloseTickets = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.undoCloseTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {

          this.getAllTickets();
        }
        if (this.isUpdating) {
          this.ticketModal.hideModal();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
    if (this.isUpdating) {
      this.ticketModal.hideModal();
    }
  }

  // private deleteTicket = (tkt: Ticket) => {
  //   this.subjectService.toggleLoading(true);
  //   const payload: TicketActionRequest = {
  //     ticketId: tkt.ticketId
  //   };
  //   this.ticketService.deleteTickets(payload)
  //     .then((response: BaseResponse) => {

  //       if (response.isSuccess) {
  //         this.toaster.success(
  //           'Deleted !!');

  //         this.getAllTickets();
  //       }
  //     })
  //     .finally(() => { this.subjectService.toggleLoading(false); });
  // }

  getTicketCategoryInformation() {
    this.subjectService.toggleLoading(true);
    this.ticketService.getTicketCategoryInformation(this.employeePayload)
      .then((response: TicketCategories) => {
        if (response.isSuccess) {
          ++this.filtersDone;
          this.categoriesList = response.ticketCategories;
          this.ticketCategorySelection = [];
          this.categoriesList.map(each => {
            this.ticketCategorySelection.push({
              category: each.name, categoryId: each.ticketCategoryId, description: each.description
            });
          });
          this.categoriesList.map(c => {
            this.categoryOptions.push({
              label: c.name, value: c.ticketCategoryId
            });
          });
          this.setFilterSelections();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  getAllTickets() {
    this.subjectService.toggleLoading(true);
    if (!this.isHr && !this.isAdmin) {
      this.ticketFilter.addedBy = [this.employeeId];
    }
    this.ticketService.getAllTickets(this.ticketFilter)
      .then((response: TicketListResponse) => {
        if (response.isSuccess) {
          this.tickets = response.tickets;
          this.tickets.map(t => {
            t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateInputFormat);
          });
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  getAllEmployeesForFilter() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.ticketService.getReportingToForDropdown(payload)
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          ++this.filtersDone;
          this.employeeFitlerOptions = response.employees;
          this.setFilterSelections();
        }
      });
  }

  getFaq() {
    this.ticketService.getFaq()
      .then((response: FaqResponse) => {
        this.faqList = response.ticketFaqs;
        this.searchedFaqList = this.faqList.slice(0, 10);
        this.faqList.forEach((each: TicketFaq) => {
          if (each.ticketCategoryId !== null || each.ticketSubCategoryId !== null) {
            each.ticketCategoryName = this.ticketCategorySelection.find(cat => cat.categoryId === each.ticketCategoryId).category;
            each.ticketSubCategoryName = this.ticketSubCategorySelection
              .find(cat => cat.subCategoryId === each.ticketSubCategoryId).subCategory;
          }
        });
      });
  }

  addTicketModal(form: NgForm) {
    this.newAttachmentInfo = [];
    this.faqModal.hideModal();
    form.reset();
    this.isUpdating = false;
    this.newTicket = new AddUpdateTicketRequest();
    setTimeout(() => {
      this.ticketModal.showModal();
    }, 500);
  }

  addnewTicket(form: NgForm) {
    this.isProcessing = true;
    this.ticketService.createNewTicket(this.newTicket, this.newAttachmentInfo)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.newAttachmentInfo = [];
          this.uploadingPercentage = 0;
          if (this.newTicket.ticketId === '') {
            this.toaster.success(
              'New ticket created and you are navigated to the ticket details page of the newly created ticket.');
          } else {
            this.toaster.success(
              'Ticket details successfully updated');
          }
          this.getAllTickets();
          this.ticketModal.hideModal();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

  addFaqModal(form: NgForm) {
    form.reset();
    this.searchedFaqList = this.faqList.slice(0, 10);
    this.faqModal.showModal();
  }

  assignSubCategoryId(event: SubCategorySelect) {
    this.newTicket.subCategoryId = event.subCategoryId;
  }

  loadSubCategory(event) {
    this.newTicket.categoryId = event.categoryId;
    this.subCategoryList = this.categoriesList.find(
      each => each.ticketCategoryId === event.categoryId).ticketSubCategories;
    this.ticketSubCategorySelection = [];

    this.subCategoryList.map(each => {
      this.ticketSubCategorySelection.push({
        subCategory: each.name, subCategoryId: each.ticketSubCategoryId, description: each.description
      });
    });

  }

  viewTicketDetails(item: Ticket) {
    this.newAttachmentInfo = [];
    this.isUpdating = true;
    this.subjectService.toggleLoading(true);
    this.newTicket = new AddUpdateTicketRequest();
    const payload: TicketActionRequest = {
      ticketId: item.ticketId
    };

    this.ticketService.getTicketDetails(payload)
      .then((response: TicketDetailsResponse) => {
        if (response.isSuccess) {
          this.newTicket.title = response.ticketInfo.title;
          this.newTicket.ticketId = response.ticketInfo.ticketId;
          this.newTicket.categoryId = response.ticketInfo.category;
          this.newTicket.subCategoryId = response.ticketInfo.subCategory;
          this.newTicket.explanation = response.ticketInfo.explanation;
          this.newTicket.isStarted = response.ticketInfo.isStarted;
          this.newTicket.isCompleted = response.ticketInfo.isCompleted;
          this.newTicket.categorySelection = this.ticketCategorySelection.find(r => r.categoryId === response.ticketInfo.category);
          this.loadSubCategory(this.newTicket);
          this.newTicket.subCategorySelection =
            this.ticketSubCategorySelection.find(r => r.subCategoryId === response.ticketInfo.subCategory);
          this.newTicket.isCreator = response.ticketInfo.isCreator;

          this.commentsList = response.comments;
          this.commentsList.map(t => {
            t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
          });

          this.newTicket.attachments = response.attachments;
          this.activeAttachments = response.attachments.filter(i => i.isActive);
          this.activeAttachments.map(a => {
            a.fileUrl = this.appService.fileBaseUrl + a.fileUrl;
            a.type = a.type ? a.type : 'Document';
          });

          this.ticketModal.showModal();
        }
      })
      .finally(() => { this.subjectService.toggleLoading(false); });
  }

  // deleteTicketAlert(item: Ticket | AddUpdateTicketRequest) {
  //   if (item.isCreator) {
  //     this.alertData = {
  //       emoji: 'assets/emoji/sad.png',
  //       header: 'Delete Task?',
  //       content: [
  //         'Are you sure you want to delete the task? Once deleted the action cannot be undone.'
  //       ],
  //       confirmText: null,
  //       confirmButtonText: 'Delete Task',
  //       cancelButtonText: 'Dont Delete',
  //       onConfirm: this.deleteTicket,
  //       data: item
  //     };
  //     this.subjectService.showSweetAlert(this.alertData, 'danger');
  //   }
  // }

  startTicketAlert(item: Ticket | AddUpdateTicketRequest) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Start Ticket?',
      content: [
        'Are you sure you want to start working on the ticket? '
      ],
      confirmText: null,
      confirmButtonText: 'Start Ticket',
      cancelButtonText: 'Dont Start',
      onConfirm: this.startTicket,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'success');
  }

  undoStartTicketAlert(item: Ticket | AddUpdateTicketRequest, form: NgForm) {
    if (form.invalid) {
      this.toaster.error("Please add a comment when trying to undo a closed ticket.");
    } else {
      this.addNewComment(form);

      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Undo Start Ticket?',
        content: [
          'Are you sure you want to delete the task? Once deleted the action cannot be undone.'
        ],
        confirmText: null,
        confirmButtonText: 'Undo Start Ticket',
        cancelButtonText: 'Cancel',
        onConfirm: this.undoStartTicket,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

  closeTicketAlert(item: Ticket | AddUpdateTicketRequest) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Close Ticket?',
      content: [
        'Are you sure you want to close the ticket? '
      ],
      confirmText: null,
      confirmButtonText: 'Close Ticket',
      cancelButtonText: 'Cancel',
      onConfirm: this.closeTicket,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'success');
  }

  undoCloseTicketAlert(item: Ticket | AddUpdateTicketRequest, form: NgForm) {
    if (form.invalid) {
      this.toaster.error("Please add a comment when trying to undo a closed ticket.");
    } else {
      this.addNewComment(form);

      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Undo Close Ticket?',
        content: [
          'Are you sure you want to undo close for the ticket?'
        ],
        confirmText: null,
        confirmButtonText: 'Undo Close Ticket',
        cancelButtonText: 'Cancel',
        onConfirm: this.undoCloseTickets,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

  addNewComment(form: NgForm) {
    const addCommentReq: AddTicketCommentRequest = {
      comment: this.newTicket.newComment,
      commentId: '',
      ticketId: this.newTicket.ticketId
    };

    this.isCommentProcessing = true;
    this.ticketService.addNewComment(addCommentReq)
      .then((response: AddCommentResponse) => {
        if (response.isSuccess) {
          this.commentsList = response.comments;
          this.commentsList.map(t => {
            t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
          });
          form.reset();
        }
      }).finally(() => {
        this.isCommentProcessing = false;
      });
  }

  deleteAddedComment(ticketId, commentId, isCreator) {
    const deleteAction: DeleteTicketCommentActionRequest = {
      ticketId,
      commentId
    };
    if (isCreator) {
      this.subjectService.toggleLoading(true);
      this.ticketService.deleteTicketComment(deleteAction)
        .then((response: AddCommentResponse) => {
          if (response.isSuccess) {
            this.commentsList = response.comments;
            this.commentsList.map(t => {
              t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
            });
          }
        }).finally(() => { this.subjectService.toggleLoading(false); });
    }
  }

  onFileSelected(files: any) {
    if (files.rejectedFiles.length > 0) {
      this.fileRejected = true;
    }

    let isWrongExtension = false;
    files.addedFiles.map(f => {
      var count = (f.name.match(/\./g) || []).length;
      if (count > 1) {
        this.fileRejected = true;
        isWrongExtension = true;
      }
    });

    if (!isWrongExtension) {
      files.addedFiles.map(f => {
        this.newAttachmentInfo.push({
          file: f,
          name: '',
          type: 'Document',
          isNew: true,
          typeSelection: this.attachmentTypeOptions.find(a => a.value === 'Document')
        });
      });
    }
  }

  removeExistingFile(item: TicketAttachment) {
    item.isActive = false;
    this.activeAttachments = this.newTicket.attachments.filter(i => i.isActive);
  }

  removeUploadedFile(item: UploadFile) {
    this.newAttachmentInfo = this.newAttachmentInfo.filter(i => i !== item);
  }

  searchFaq() {
    if (this.faqSearchText && this.faqSearchText !== '') {
      this.searchedFaqList = this.faqList.filter(f => f.faqTitle.trim().toLowerCase().indexOf(this.faqSearchText.trim().toLowerCase()) >= 0);
    } else {
      this.searchedFaqList = this.faqList.slice(0, 10);
    }
  }

  showFaqDetail(item: TicketFaq) {
    this.selectedFaq = item;
    this.faqInfoModal.showModal();
  }


  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }

    return item;
  }

  selectMultipleEmployee(values: EmployeeBaseInfo[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.employeeId);
    }

    return item;
  }

  selectCategory(category: SelectOption) {
    this.ticketFilter.category = category.value;
    const subCatgList = this.categoriesList.find(
      each => each.ticketCategoryId === category.value).ticketSubCategories;
    subCatgList.map(s => {
      this.subCategoryOptions.push(
        { label: s.name, value: s.ticketSubCategoryId }
      );
    });
  }

  onFilterDateChosen($event) {
    // if ($event) {
    //   this.ticketFilter.startDate = $event[0];
    //   this.ticketFilter.endDate = $event[1];
    // }
  }

  applyFilter() {
    if (this.ticketFilter.dateRangeSelection) {
      this.ticketFilter.startDate = this.ticketFilter.dateRangeSelection[0];
      this.ticketFilter.endDate = this.ticketFilter.dateRangeSelection[1];
    }
    const filter = Object.assign({}, this.ticketFilter);

    filter.startDate = filter.startDate
      ? moment(filter.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : '';
    filter.endDate = filter.endDate
      ? moment(filter.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : '';

    filter.employeeId = '';
    filter.dateRangeSelection = [];
    filter.categorySelection = null
    filter.subCategorySelection = null;
    filter.statusSelection = null;

    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.ticketFilter);
    this.getAllTickets();
    this.filterModal.hideModal();
  }

  clearFilter(form: NgForm) {
    this.ticketFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.ticketFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAllTickets();
    this.filterModal.hideModal();
  }

  setFilterParametersFromUrl() {
    this.ticketFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.ticketFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.ticketFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections() {
    this.ticketFilter.dateRangeSelection = this.ticketFilter.startDate ? [
      new Date(moment(this.ticketFilter.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)),
      new Date(moment(this.ticketFilter.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)),
    ] : [];

    if (this.filtersDone === 2) {

      this.ticketFilter.addedBySelections =
        this.employeeFitlerOptions.filter(f => this.ticketFilter.addedBy.find(d => d === f.employeeId));

      this.ticketFilter.categorySelection =
        this.categoryOptions.find(f => this.ticketFilter.category === f.value);
      if (this.ticketFilter.category) {
        const subCatgList = this.categoriesList.find(each => each.ticketCategoryId === this.ticketFilter.category)
          .ticketSubCategories;
        subCatgList.map(s => {
          this.subCategoryOptions.push(
            { label: s.name, value: s.ticketSubCategoryId }
          );
        });

        this.ticketFilter.subCategorySelection =
          this.subCategoryOptions.find(f => this.ticketFilter.subCategory === f.value);
      }
      this.ticketFilter.statusSelection =
        this.statusOptions.filter(f => this.ticketFilter.status.find(d => d === f.value));

      this.getAllTickets();
    }
  }

  showFilters() {
    this.filterModal.showModal();
  }

  trackUploading() {
    this.subjectService.uploadingSubject.subscribe((done: number) => {
      this.uploadingPercentage = done;
    });
  }

  categorySearchFunction(term: string, item: CategorySelect) {
    term = term.trim().toLowerCase();
    return item.category.trim().toLowerCase().indexOf(term) > -1;
  }

  subCategorySearchFunction(term: string, item: SubCategorySelect) {
    term = term.trim().toLowerCase();
    return item.subCategory.trim().toLowerCase().indexOf(term) > -1;
  }
}
