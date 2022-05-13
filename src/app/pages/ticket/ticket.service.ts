import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { UploadFile } from 'src/app/app.model';
import { HttpService } from 'src/app/shared/services/http-service';

import { EmployeeActionRequest } from '../employee/employee-details/employee-details.model';
import {
  AddTicketCommentRequest,
  AddUpdateTicketRequest,
  DeleteTicketCommentActionRequest,
  TicketActionRequest,
  TicketFilterRequest,
} from './ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private httpService: HttpService) { }

  getAllTickets(payload: TicketFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.ticketRoute.getAllTickets, payload, false);
  }

  getReportingToForDropdown(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeesForReportingDropdown, payload, false);
  }

  createNewTicket(payload: AddUpdateTicketRequest, files: UploadFile[]) {
    return this.httpService.postMethodWithFile(AppApiEndpoints.ticketRoute.updateTicket, payload, files);
  }

  getTicketCategoryInformation(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTicketCategoryForDropdown, payload, false);
  }

  getTicketDetails(payload: TicketActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.ticketRoute.getTicketDetails, payload, false);
  }

  startTickets(payload: TicketActionRequest) {

    return this.httpService.postMethod(AppApiEndpoints.ticketRoute.startTicket, payload, false);
  }

  undoStartTickets(payload: TicketActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.ticketRoute.undoStartTicket, payload, false);
  }

  closeTickets(payload: TicketActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.ticketRoute.closeTicket, payload, false);
  }

  undoCloseTickets(payload: TicketActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.ticketRoute.undoCloseTicket, payload, false);
  }

  addNewComment(payload: AddTicketCommentRequest) {
    return this.httpService.postMethod(AppApiEndpoints.ticketRoute.addTicketComment, payload, false);
  }

  deleteTicketComment(payload: DeleteTicketCommentActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.ticketRoute.deleteTicketComment, payload, false);
  }

  getFaq() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTicketFaq, null, false);
  }
}
