import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DataTableParameters, SelectionConstants } from 'src/app/app.constants';
import { BaseResponse, SelectOption, SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { ObjectToUrlService } from 'src/app/shared/services/obj-to-url-service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import {
  EmployeeActionRequest,
  EmployeeBaseInfo,
  ReportingToResponse,
  TaskFilterResponse,
} from '../../employee/employee-details/employee-details.model';
import {
  AddCommentRequest,
  AddUpdateTaskResponse,
  AddUpdateTasksRequest,
  Comments,
  DateWiseTask,
  DeleteCommentActionRequest,
  GetTaskCommentsResponse,
  TaskActionRequest,
  TaskDetailsResponse,
  TaskFilterRequest,
  Tasks,
  TasksListResponse,
} from '../task.model';
import { TasksService } from '../tasks.service';
import { DatePickerOptions } from './../../../app.constants';
import { MiscService } from './../../../shared/services/misc.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  @ViewChild('taskModal', { static: false }) taskModal: CustomModalComponent;
  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;
  @ViewChild('commentForm', { static: false }) commentForm: NgForm;

  employeeId = '';
  today = new Date();
  isUpdating = false;
  isFilterSet = false;
  tasks: Tasks[] = [];
  isFiltering = false;
  isProcessing = false;
  isTaskCreator = false;
  progressPositive: string;
  progressNegative: string;
  isCommentProcessing = false;
  commentsList: Comments[] = [];
  taskFilter: TaskFilterRequest;
  defaultFilter: TaskFilterRequest;
  dateWiseTask: DateWiseTask[] = [];
  dtOptions: DataTables.Settings = {};
  startedOptions: SelectOption[] = [];
  verifiedOptions: SelectOption[] = [];
  completedOptions: SelectOption[] = [];
  commentOptions: DataTables.Settings = {};
  reportingToOptions: EmployeeBaseInfo[] = [];
  createdByFilterOptions: EmployeeBaseInfo[] = [];
  assignedToFilterOptions: EmployeeBaseInfo[] = [];
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  newTask: AddUpdateTasksRequest = new AddUpdateTasksRequest();
  taskPriorityOptions: SelectOption[] = SelectionConstants.taskPriorityOptions;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private taskService: TasksService,
    private localStorageService: LocalStorageService,
    private miscService: MiscService,
    private objToUrlService: ObjectToUrlService
  ) {
  }

  ngOnInit() {
    const userInfo = this.localStorageService.getLoggedInUserInfo();
    this.employeeId = userInfo.employeeId;

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 9
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

    this.defaultFilter = {
      employeeId: '',
      assignedBy: [],
      assignedTo: [],
      completed: [],
      endDate: '',
      startDate: '',
      started: [],
      title: '',
      verified: []
    };
    this.taskFilter = Object.assign({}, this.defaultFilter);

    this.startedOptions = [
      { label: 'Started', value: 'true' },
      { label: 'Not Started', value: 'false' }
    ];

    this.completedOptions = [
      { label: 'Completed', value: 'true' },
      { label: 'Not Completed', value: 'false' }
    ];

    this.verifiedOptions = [
      { label: 'Verified', value: 'true' },
      { label: 'Not Verified', value: 'false' }
    ];

    this.getAllTaskFilters();
    this.setFilterParametersFromUrl();
    this.getEmployeesReportingToMe();
    this.getAlEmployeesForFilter();
  }

  private markIrrelevantStatus = (task: Tasks) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };

    this.taskService.toggleMarkIrrelevant(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllTasks();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
  }

  private startTask = (task: Tasks) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.toggleStartTask(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {

          this.getAllTasks();
        }
        if (this.isUpdating) {
          this.taskModal.hideModal();
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });
    if (this.isUpdating) {
      this.taskModal.hideModal();
    }
  }

  private undoStartTask = (task: Tasks) => {
    if (task.isStarted) {
      this.startTask(task);
    }
  }

  private completeTask = (task: Tasks) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.toggleCompleteTask(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllTasks();
          if (this.isUpdating) {
            this.taskModal.hideModal();
          }
        }
      }).finally(() => { this.subjectService.toggleLoading(false); });

  }

  private undoCompleteTask = (task: Tasks) => {
    if (task.isCompleted) {
      this.completeTask(task);
    }
  }

  private verifyTask = (task: Tasks) => {
    this.subjectService.toggleLoading(true);
    const payload: TaskActionRequest = {
      taskId: task.taskId
    };
    this.taskService.toggleVerifyTask(payload)
      .then((response: BaseResponse) => {

        if (response.isSuccess) {
          this.getAllTasks();
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
          this.toaster.success(
            'Deleted !!');

          this.getAllTasks();
        }
      })
      .finally(() => { this.subjectService.toggleLoading(false); });
  }

  getEmployeesReportingToMe() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.taskService.getEmployeesReportingTo(payload)
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.reportingToOptions = response.employees;
          if (this.reportingToOptions.length > 0) {
            const self = this.reportingToOptions.find(r => r.employeeId === this.employeeId);
            if (self) {
              self.employeeName = self.employeeName + '  (Self)';
            }
            this.reportingToOptions = this.reportingToOptions.filter(r => r.employeeId !== this.employeeId);
            this.reportingToOptions = [self, ...this.reportingToOptions];
          }
        }
      });
  }

  getAllTaskFilters() {
    this.taskService.getTaskFilters()
      .then((response: TaskFilterResponse) => {
        if (response.isSuccess) {
          this.createdByFilterOptions = response.createdBy;
          this.assignedToFilterOptions = response.assignedTo;
          this.setFilterSelections(true);
        }
      });
  }

  getAlEmployeesForFilter() {
    // const payload: EmployeeActionRequest = {
    //   employeeId: this.employeeId
    // };
    // this.taskService.getReportingToForDropdown(payload)
    //   .then((response: ReportingToResponse) => {
    //     if (response.isSuccess) {
    //       this.employeeFitlerOptions = response.employees;
    //       this.setFilterSelections();
    //     }
    //   });
  }

  getAllTasks() {
    this.subjectService.toggleLoading(true);
    this.taskFilter.employeeId = this.employeeId;
    this.taskService.getAllTasks(this.taskFilter)
      .then((response: TasksListResponse) => {
        if (response.isSuccess) {
          this.tasks = response.tasks;
          this.tasks.map(t => {
            t.dueOnText = moment.utc(t.dueOn).local().format(DatePickerOptions.datePicker.dateInputFormat);
            t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);

            t.dueOn = t.dueOn ?
              new Date(
                moment(t.dueOn)
                  .startOf('day')
                  .add(10, 'hours')
                  .format(this.datePickerOptions.dateTimeFormat)
              ) : '';

            t.completedInTime = t.isCompleted ? moment(t.completetedOn) < moment(t.dueOn) : null;
          });

          this.parseDateWiseTasks();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
        if (this.isUpdating) {
          this.taskModal.hideModal();
        }
      });
  }

  parseDateWiseTasks() {
    const uniqueDates = this.tasks.map(t => t.dueOnText).filter((value, index, self) => self.indexOf(value) === index);
    this.dateWiseTask = [];
    uniqueDates.map(d => {
      const tasks = this.tasks.filter(t => t.dueOnText === d);
      this.dateWiseTask.push({
        date: d,
        tasks
      });
    });
  }

  addNewTask(form: NgForm) {
    if (!form.valid) {
      // Object.keys(form.controls).forEach(field => {
      //   form.hasError()
      // });
    } else {
      this.isProcessing = true;
      this.newTask.hourTime = this.newTask.dueTime.getHours();
      this.newTask.minuteTime = this.newTask.dueTime.getMinutes();
      this.taskService.createNewTask(this.newTask)
        .then((response: AddUpdateTaskResponse) => {
          if (response.isSuccess) {
            if (this.newTask.taskId === '') {
              this.toaster.success(
                'New task created and you are navigated to the task details page of the newly created task.');
            } else {
              this.toaster.success(
                'Task details successfully updated');
            }
            this.getAllTasks();
            this.taskModal.hideModal();
          }
        })
        .finally(() => {
          this.isProcessing = false;
        });
    }
  }

  addTaskModal(form: NgForm) {
    form.reset();
    this.isUpdating = false;
    this.newTask = new AddUpdateTasksRequest();
    this.newTask.assignedToSelection = this.reportingToOptions.find(r => r.employeeId === this.employeeId);
    const time = new Date();
    time.setHours(10);
    time.setMinutes(0);
    this.newTask.dueTime = time;
    this.taskModal.showModal();
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

  viewTaskDetails(item: Tasks | AddUpdateTasksRequest) {
    this.isUpdating = true;
    this.subjectService.toggleLoading(true);

    const payload: TaskActionRequest = new TaskActionRequest();
    payload.taskId = item.taskId;

    this.taskService.getTaskDetails(payload)
      .then((response: TaskDetailsResponse) => {
        if (response.isSuccess) {
          this.newTask = Object.assign({ taskContent: '', dueDate: '', dueTime: null }, response);
          this.newTask.dueDate = new Date(moment(response.dueOn)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat));
          this.newTask.taskContent = response.content;
          this.isTaskCreator = response.isCreator;
          const time = new Date();
          time.setHours(this.newTask.hourTime);
          time.setMinutes(this.newTask.minuteTime);
          this.newTask.dueTime = time;
          this.newTask.assignedTo = response.assignedToId;
          if (this.newTask.taskPriority) {
            this.newTask.taskPrioritySelection = this.taskPriorityOptions.find(t => t.value === this.newTask.taskPriority);
          }
          this.newTask.assignedToSelection = this.reportingToOptions.find(r => r.employeeId === response.assignedToId);
          this.newTask.startedOn = moment.utc(this.newTask.startedOn).local().format(this.datePickerOptions.dateTimeFormat);
          this.newTask.completedOn = moment.utc(this.newTask.completedOn).local().format(this.datePickerOptions.dateTimeFormat);
          this.newTask.verifiedOn = moment.utc(this.newTask.verifiedOn).local().format(this.datePickerOptions.dateTimeFormat);

          this.commentsList = response.comments;
          this.commentsList.map(t => {
            t.addedOnText = moment.utc(t.addedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
          });
          this.taskModal.showModal();
        }
      })
      .finally(() => { this.subjectService.toggleLoading(false); });
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

  showFilters() {
    this.filterModal.showModal();
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

  undoStartTaskAlert(item: Tasks | AddUpdateTasksRequest, form: NgForm) {
    if (form.invalid) {
      this.toaster.error("Please add a comment when trying to undo a started task.");
    } else {
      this.addNewComment(form);

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

  undoCompleteTaskAlert(item: Tasks | AddUpdateTasksRequest, form: NgForm) {
    if (form.invalid) {
      this.toaster.error("Please add a comment when trying to undo a completed task.");
    } else {
      this.addNewComment(form);

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

  undoVerifyTaskAlert(item: Tasks | AddUpdateTasksRequest, form: NgForm) {
    if (form.invalid) {
      this.toaster.error("Please add a comment when trying to undo a verified task.");
    } else {
      this.addNewComment(form);

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
  }

  markIrrelevant(item: Tasks | AddUpdateTasksRequest) {
    this.alertData = {
      emoji: 'assets/emoji/neutral.png',
      header: item.isIrrelevant ? 'Mark Relevant' : 'Mark Irrelevant',
      content: [
        'Are you sure you want to change the relevancy for the selected task?'
      ],
      confirmText: null,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      onConfirm: this.markIrrelevantStatus,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, item.isIrrelevant ? 'success' : 'danger');
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

  onFilterDateChosen($event) {
    // if ($event) {
    //   this.taskFilter.startDate = $event[0];
    //   this.taskFilter.endDate = $event[1];
    // }
  }

  applyFilter() {
    if (this.taskFilter.dateRangeSelection) {
      this.taskFilter.startDate = this.taskFilter.dateRangeSelection[0];
      this.taskFilter.endDate = this.taskFilter.dateRangeSelection[1];
    }
    const filter = Object.assign({}, this.taskFilter);

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
    filter.assignedBySelection = [];
    filter.assignedToSelection = [];
    filter.startedSelection = [];
    filter.completedSelection = [];
    filter.verifiedSelection = [];

    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.taskFilter);
    this.getAllTasks();
    this.filterModal.hideModal();
  }

  clearFilter(form: NgForm) {
    this.taskFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.taskFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAllTasks();
    this.filterModal.hideModal();
  }

  setFilterParametersFromUrl() {
    this.taskFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.taskFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.taskFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections(isDone: boolean = false) {
    this.taskFilter.dateRangeSelection = this.taskFilter.startDate ? [
      new Date(moment(this.taskFilter.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)),
      new Date(moment(this.taskFilter.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)),
    ] : [];

    if (isDone) {

      this.taskFilter.assignedToSelection =
        this.assignedToFilterOptions.filter(f => this.taskFilter.assignedTo.find(d => d === f.employeeId));

      this.taskFilter.assignedBySelection =
        this.createdByFilterOptions.filter(f => this.taskFilter.assignedBy.find(d => d === f.employeeId));

      this.taskFilter.completedSelection =
        this.completedOptions.filter(f => this.taskFilter.completed.find(d => d.toString() === f.value));

      this.taskFilter.verifiedSelection =
        this.verifiedOptions.filter(f => this.taskFilter.verified.find(d => d.toString() === f.value));

      this.taskFilter.startedSelection =
        this.startedOptions.filter(f => this.taskFilter.started.find(d => d.toString() === f.value));

      this.getAllTasks();
    }
  }
}
