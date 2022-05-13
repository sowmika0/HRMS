import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from 'src/app/shared/services/http-service';

import { EmployeeActionRequest } from './../employee/employee-details/employee-details.model';
import { AddUpdateTasksRequest, TaskActionRequest, TaskFilterRequest } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private httpService: HttpService
  ) { }

  getEmployeesReportingTo(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeesReportingTo, payload, false);
  }

  getReportingToForDropdown(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeesForReportingDropdown, payload, false);
  }

  getAllTasks(payload: TaskFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.taskRoute.getAllTasks, payload, false);
  }

  getTaskFilters() {
    return this.httpService.getMethod(AppApiEndpoints.taskRoute.getTaskFilters, null, false);
  }

  getTaskDetails(payload: TaskActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.taskRoute.getTaskDetails, payload, false);
  }

  getTaskComments(payload: TaskActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.taskRoute.getTaskComments, payload, false);
  }

  createNewTask(payload: AddUpdateTasksRequest) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.addUpdateTask, payload, false);
  }

  addNewComment(payload) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.addCommentToTask, payload, false);
  }

  deleteAddedComment(payload) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.deleteCommentOnTask, payload, false);
  }

  deleteTask(payload) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.deleteTask, payload, false);
  }

  toggleStartTask(payload: TaskActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.toggleStartTask, payload, false);
  }

  toggleCompleteTask(payload: TaskActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.toggleCompleteTask, payload, false);
  }

  toggleVerifyTask(payload: TaskActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.toggleVerifyTask, payload, false);
  }

  toggleMarkIrrelevant(payload: TaskActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.taskRoute.toggleIrrelevant, payload, false);
  }

}
