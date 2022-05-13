import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { TicketService } from '../ticket.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import {
  TicketComment, AddUpdateTicketRequest,
  TicketActionRequest, TicketDetailsResponse,
  SubCategorySelect, CategorySelect, TicketCategories,
  TicketCategory, TicketSubCategory, AddTicketCommentRequest,
  AddCommentResponse, Ticket
} from '../ticket.model';
import { EmployeeBaseInfo, EmployeeActionRequest } from '../../employee/employee-details/employee-details.model';
import { DatePickerOptions } from 'src/app/app.constants';
import { SweetAlertValue, BaseResponse } from 'src/app/app.model';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { AddCommentRequest, TaskActionRequest, GetTaskCommentsResponse } from '../../tasks/task.model';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  ticketId = '';
  employeeId = '';
  isHr: boolean;
  isProcessing = false;
  isUpdating = true;
  showTicketDetails = false;
  isCommentProcessing = false;
  categoriesList: TicketCategory[];
  commentsList: TicketComment[] = [];
  subCategoryList: TicketSubCategory[];
  employeePayload: EmployeeActionRequest;
  ticketCategorySelection: CategorySelect[];
  reportingToOptions: EmployeeBaseInfo[] = [];
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  ticketSubCategorySelection: SubCategorySelect[];
  ticketPayload: TicketActionRequest = new TicketActionRequest();
  newTicket: AddUpdateTicketRequest = new AddUpdateTicketRequest();
  ticketDetails: TicketDetailsResponse = new TicketDetailsResponse();
  categoriesListResponse: TicketCategories = new TicketCategories();


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private ticketService: TicketService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    const userInfo = this.localStorageService.getLoggedInUserInfo();
    this.employeeId = userInfo.employeeId;
    this.isHr = userInfo.role === 'HR' ? true : false;
    this.employeePayload = {
      employeeId: this.employeeId
    };
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id && params.id !== '') {
        this.ticketId = params.id;
      }
      if (this.isHr) {
        this.getTicketCategoryInformation();
      } else {
        this.router.navigate(['/tickets']);
      }
    });
  }
  private startTicket = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.startTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTicketDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });

  }
  private undoStartTicket = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.undoStartTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTicketDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });

  }
  private closeTicket = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.closeTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTicketDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });

  }
  private undoCloseTickets = (tkt: Ticket) => {
    this.subjectService.toggleLoading(true);
    const payload: TicketActionRequest = {
      ticketId: tkt.ticketId
    };
    this.ticketService.undoCloseTickets(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTicketDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
  }

  getTicketDetails() {
    if (this.ticketId) {
      const payload: TicketActionRequest = {
        ticketId: this.newTicket.ticketId
      };
      this.ticketService.getTicketDetails(payload)
        .then((response: TicketDetailsResponse) => {
          if (response.isSuccess) {
            this.ticketDetails = Object.assign({ ticketInfo: '', comments: '' }, response);
            this.newTicket.ticketId = response.ticketInfo.ticketId;
            this.newTicket.title = response.ticketInfo.title;
            this.newTicket.categoryId = response.ticketInfo.category;
            this.newTicket.subCategoryId = response.ticketInfo.subCategory;
            this.newTicket.categorySelection = this.ticketCategorySelection.find(r => r.categoryId === response.ticketInfo.category);
            this.loadSubCategory(this.newTicket);
            this.newTicket.subCategorySelection =
              this.ticketSubCategorySelection.find(r => r.subCategoryId === response.ticketInfo.subCategory);
            this.newTicket.isCreator = response.ticketInfo.isCreator;
            this.newTicket.isStarted = response.ticketInfo.isStarted;
            this.newTicket.isCompleted = response.ticketInfo.isCompleted;
            this.commentsList = response.comments;
            this.commentsList.map(t => {
              t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
            });
          }
        });
    }
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

  getTicketCategoryInformation() {
    this.subjectService.toggleLoading(true);
    this.ticketService.getTicketCategoryInformation(this.employeePayload)
      .then((response: TicketCategories) => {
        if (response.isSuccess) {
          this.categoriesListResponse = response;
          this.categoriesList = response.ticketCategories;
          this.ticketCategorySelection = [];
          this.categoriesList.map(each => {
            this.ticketCategorySelection.push({
              category: each.name, categoryId: each.ticketCategoryId, description: each.description
            });
          });
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
        this.getTicketDetails();
      });
  }

  addNewComment(form: NgForm) {
    const addCommentReq: AddTicketCommentRequest = {
      ticketId: this.newTicket.ticketId,
      commentId: '',
      comment: this.newTicket.newComment,
    };
    this.isCommentProcessing = true;
    this.ticketService.addNewComment(addCommentReq)
      .then((response: AddCommentResponse) => {
        if (response.isSuccess) {
          const payload: TicketActionRequest = {
            ticketId: this.newTicket.ticketId
          };
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
    this.subjectService.showSweetAlert(this.alertData, 'primary');

  }
  undoStartTicketAlert(item: Ticket | AddUpdateTicketRequest) {
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
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  undoCloseTicketAlert(item: Ticket | AddUpdateTicketRequest) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Undo Close Ticket?',
      content: [
        'Are you sure you want to undo close for  the ticket? O'
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
