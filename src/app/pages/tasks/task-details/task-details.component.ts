import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DatePickerOptions } from 'src/app/app.constants';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import {
  EmployeeActionRequest,
  EmployeeBaseInfo,
  ReportingToResponse,
} from '../../employee/employee-details/employee-details.model';
import {
  AddCommentRequest,
  AddUpdateTaskResponse,
  AddUpdateTasksRequest,
  Comments,
  DeleteCommentActionRequest,
  GetTaskCommentsResponse,
  TaskActionRequest,
  TaskDetailsResponse,
  Tasks,
} from '../task.model';
import { TasksService } from './../tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  taskId = '';
  employeeId = '';
  isProcessing = false;
  showTaskDetails = false;
  isCommentProcessing = false;
  commentsList: Comments[] = [];
  reportingToOptions: EmployeeBaseInfo[] = [];
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  newTask: AddUpdateTasksRequest = new AddUpdateTasksRequest();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private taskService: TasksService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    const userInfo = this.localStorageService.getLoggedInUserInfo();
    this.employeeId = userInfo.employeeId;
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id && params.id !== '') {
        this.taskId = params.id;
      }
      this.getTaskDetails();
      this.getEmployeesReportingToMe();
    });
  }

  private startTask = (task: Tasks| AddUpdateTasksRequest) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.toggleStartTask(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTaskDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
  }

  private undoStartTask = (task: Tasks| AddUpdateTasksRequest) => {
    if (task.isStarted) {
      this.startTask(task);
    }
  }

  private completeTask = (task: Tasks| AddUpdateTasksRequest) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.toggleCompleteTask(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTaskDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });

  }

  private undoCompleteTask = (task: Tasks| AddUpdateTasksRequest) => {
    if (task.isCompleted) {
      this.completeTask(task);
    }
  }

  private verifyTask = (task: Tasks| AddUpdateTasksRequest) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.toggleVerifyTask(payload)
      .then((response: BaseResponse) => {

        if (response.isSuccess) {
          this.getTaskDetails();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
  }

  private undoVerifyTask = (task: Tasks) => {
    if (task.isVerified) {
      this.verifyTask(task);
    }
  }

  private deleteTask = (task: Tasks) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.deleteTask(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Deleted !!');
        }
      })
      .finally(() => { this.subjectService.toggleLoading(false); });
  }


  addNewTask(form: NgForm, task: Tasks | AddUpdateTasksRequest) {
    if (!form.valid) {
    } else {
      this.isProcessing = true;
      this.newTask.assignedTo = task.assignedToId;
      this.taskService.createNewTask(this.newTask)
        .then((response: AddUpdateTaskResponse) => {
          if (response.isSuccess) {
            this.toaster.success(
              'Task details successfully updated');

          }
        })
        .finally(() => {
          this.isProcessing = false;
        });
    }
  }

  getTaskDetails() {
    if (this.taskId) {
      const payload: TaskActionRequest = new TaskActionRequest();
      payload.taskId = this.taskId;
      this.taskService.getTaskDetails(payload)
        .then((response: TaskDetailsResponse) => {
          if (response.isSuccess) {
            this.newTask = Object.assign({ taskContent: '', dueDate: '', dueTime: null }, response);
            this.newTask.dueDate = new Date(moment(response.dueOn)
              .add(10, 'hours')
              .format(DatePickerOptions.datePicker.dateInputFormat));
            this.newTask.taskContent = response.content;
            this.newTask.assignedToSelection = this.reportingToOptions.find(r => r.employeeId === response.assignedToId);
            this.commentsList = response.comments;
            this.commentsList.map(t => {
              t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
            });

          }
        });
    }
  }
  getEmployeesReportingToMe() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.taskService.getEmployeesReportingTo(payload)
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.reportingToOptions = response.employees;
          const self = this.reportingToOptions.find(r => r.employeeId === this.employeeId);
          self.employeeName = self.employeeName + '  (Self)';
          this.reportingToOptions = this.reportingToOptions.filter(r => r.employeeId !== this.employeeId);
          this.reportingToOptions = [self, ...this.reportingToOptions];
        }
      });
  }

  addNewComment(form: NgForm) {
    const addCommentReq: AddCommentRequest = new AddCommentRequest();
    addCommentReq.taskId = this.newTask.taskId;
    addCommentReq.commentId = '';
    addCommentReq.comment = this.newTask.newComment;
    this.isCommentProcessing = true;
    this.taskService.addNewComment(addCommentReq)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          const payload = new TaskActionRequest();
          payload.taskId = this.newTask.taskId;
          this.taskService.getTaskComments(payload)
            .then((response1: GetTaskCommentsResponse) => {
              if (response1.isSuccess) {
                this.commentsList = response1.comments;
                this.commentsList.map(t => {
                  t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
                });
              }
            });
          form.reset();
        }
      }).finally(() => {
        this.isCommentProcessing = false;
      });
  }

  deleteAddedComment(taskId, commentId, isCreator) {
    const deleteAction: DeleteCommentActionRequest = {
      taskId,
      commentId
    };
    if (isCreator) {
      this.subjectService.toggleLoading(true);
      this.taskService.deleteAddedComment(deleteAction)
        .then((response: BaseResponse) => {
          if (response.isSuccess) {
            const payload1: TaskActionRequest = {
              taskId
            };
            this.taskService.getTaskComments(payload1)
              .then((taskCommentResponse: GetTaskCommentsResponse) => {
                this.commentsList = taskCommentResponse.comments;
              });
          }
        }).finally(() => { this.subjectService.toggleLoading(false); });
    }
  }

  startTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Mark Started ?',
      content: [
        'Are you sure you want to Mark Started for the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Start Task ',
      cancelButtonText: 'Cancel',
      onConfirm: this.startTask,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'success');
  }

  undoStartTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Undo Start ?',
      content: [
        'Are you sure you want to undo  start for the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Undo Start ',
      cancelButtonText: 'Cancel',
      onConfirm: this.undoStartTask,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  completeTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Mark Completed ?',
      content: [
        'Are you sure you want to Mark Completed for  the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Complete Task ',
      cancelButtonText: 'Cancel',
      onConfirm: this.completeTask,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'success');
  }

  undoCompleteTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Undo Complete ?',
      content: [
        'Are you sure you want to undo complete for  the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Undo Complete',
      cancelButtonText: 'Cancel',
      onConfirm: this.undoCompleteTask,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  verifyTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Mark Started ?',
      content: [
        'Are you sure you want to Mark Verified for the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Verify Task ',
      cancelButtonText: 'Cancel',
      onConfirm: this.verifyTask,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'success');
  }

  undoVerifyTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Undo Verify ?',
      content: [
        'Are you sure you want to Mark Verified for the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Undo Verify ',
      cancelButtonText: 'Cancel',
      onConfirm: this.undoVerifyTask,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }

  deleteTaskAlert(item: Tasks | AddUpdateTasksRequest) {
    if (item.isCreator) {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Task?',
        content: [
          'Are you sure you want to delete the task? Once deleted the action cannot be undone.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Task',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.deleteTask,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }
}
