import * as _ from 'lodash';
import * as moment from 'moment';

import { Component, OnInit, ViewChild } from '@angular/core';
import { CountupTimerComponent, CountupTimerService, countUpTimerConfigModel, timerTexts } from 'ngx-timer';
import { DataTableParameters, DatePickerOptions, SelectionConstants } from 'src/app/app.constants';
import { EProjectTypes, EProjectsStatus, EProjectsTaskStatus, IComment, IDashboardFilter, IProject, IProjectTask, ITimeSheetFilter } from '../projects.model';
import { EmployeeActionRequest, EmployeeBaseInfo, ReportingToResponse } from '../../employee/employee-details/employee-details.model';
import { SelectOption, UserStorageInformation } from 'src/app/app.model';

import { ColorEvent } from 'ngx-color';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { NgForm } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { TasksService } from '../../tasks/tasks.service';
import { ToastrService } from 'ngx-toastr';
import { getExportOptions } from 'src/app/shared/utils/getExportOptions';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  @ViewChild('projectModal', { static: false }) projectModal: CustomModalComponent;
  @ViewChild('tasksModal', { static: false }) tasksModal: CustomModalComponent;
  @ViewChild('commentsModal', { static: false }) commentsModal: CustomModalComponent;
  @ViewChild('countUpTimer', { static: false }) countUpTimer: CountupTimerComponent;


  // projects: IProject[] = [];
  projects: any = [];
  // commentsList: IComment[] = [];
  commentsList: any = [];
  openTasksList: any = [];
  timeSheetTasksList: any = [];
  dashboardTaskList: any = [];
  dashboardReporteesTaskList: any = [];
  projectsList: any = [];
  // openTasksList: IProjectTask[] = [];
  dtOptions: DataTables.Settings = {};
  commentsDataTableOptions: DataTables.Settings = {};
  openTasksTableOptions: DataTables.Settings = {};
  myTimeSheetTableOptions: DataTables.Settings = {};
  datePickerOptions = DatePickerOptions.datePicker;
  completedTasksTableOptions: DataTables.Settings = {};
  reportingTasksTableOptions: DataTables.Settings = {};
  newProject: IProject = new IProject();
  dashboardFilterDetails: IDashboardFilter = { filterType: { value: 'all', label: 'All' } }
  timeSheetFilterDetails: ITimeSheetFilter = {
    startDate: new Date(),
    endDate: new Date(),
    projectName: '',
    taskProjectNameVar: '',
    assignedToSelection: '',

  };
  newTask: IProjectTask = new IProjectTask();
  newComment: IComment = new IComment();
  employeeId = '';
  isUpdating = false;
  isProcessing = false;
  projectTypeOptions: SelectOption[] = SelectionConstants.projectTypeOptions;
  taskPriorityOptions: SelectOption[] = SelectionConstants.taskPriorityOptions;
  taskPriorityDetails: SelectOption;
  dashboardTaskFilterOptions: SelectOption[] = SelectionConstants.dashboardProjectFilterOptions;
  statusFilterOptions: SelectOption[] = SelectionConstants.statusFilterOptions;
  taskTypeOptions: SelectOption[] = SelectionConstants.taskTypeOptions;
  taskProjectNameOptions: IProject[] = [];
  taskPublicProjectNameOptions: IProject[] = [];
  reportingToOptions: EmployeeBaseInfo[] = [];
  currentTab = 'forme';
  projectStatusData: any;
  taskStatusData: any
  taskStatusReporteesData: any
  testConfig: countUpTimerConfigModel;
  taskDefaultColor = '#BEDADC';
  projectDefaultColor = '#BEDADC';
  taskCompletedDone: boolean = false;
  myActivityTaskStatus: any;
  taskProjectName = ''
  isTaskCreator: boolean = false;
  isFilterSet: boolean = false;
  userStorage: UserStorageInformation;
  isLoading: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private taskService: TasksService,
    private localStorageService: LocalStorageService,
    private subjectService: SubjectService,
    private toastrService: ToastrService,
    private countupTimerService: CountupTimerService
  ) {

  }

  ngOnInit() {

    // filter
    this.userStorage = this.localStorageService.getLoggedInUserInfo();
    console.log('user details', this.userStorage)
    // this.countupTimerService = new CountupTimerService()

    console.log('fil..', this.dashboardFilterDetails.filterType)
    // if (this.dashboardFilterDetails.filterType) {
    //   this.dashboardFilterDetails.filterType.value = 'all';
    // }
    this.getTaskStatusInDashboard()

    this.getEmployeesReportingToMe()
    this.getAllProjects();
    this.getAllOpenTasks(undefined);


    this.setDataTable();
    this.setCommentsDataTable()

    this.testConfig = new countUpTimerConfigModel();
    this.testConfig.timerClass = 'test_Timer_class';
    this.testConfig.timerTexts = new timerTexts();
    this.testConfig.timerTexts.hourText = "H";
    this.testConfig.timerTexts.minuteText = "M";
    this.testConfig.timerTexts.secondsText = "S";

    // let cdate = new Date();
    // cdate.setHours(cdate.getHours() - 2);
    // this.countupTimerService.startTimer(cdate);+-

    // this.countupTimerService.stopTimer();00
    let cdate = new Date();
    // cdate.setHours(cdate.getHours() - 2);
    // this.countupTimerService.setTimervalue(0);

    // this.countupTimerService.setTimervalue(100);
    // this.countupTimerService.startTimer();

    console.log('dashboardReporteesTaskList.length', this.dashboardReporteesTaskList.length)

  }

  showFilters() {
    console.log('need to look..')
  }

  updateLoading(updating, message = 'Loading....') {
    this.isLoading = updating;
    // this.toastrService.info(message);
    this.subjectService.toggleLoading(updating);
  }

  setDashboard() {
    console.log('dash basdf', this.dashboardTaskList)
    const onGoingTasks = this.dashboardTaskList.filter(task => [EProjectsTaskStatus.ONGOING, EProjectsTaskStatus.PENDING].includes(task.taskStatus)).length || 0;
    const completedTasks = this.dashboardTaskList.filter(task => task.taskStatus === EProjectsTaskStatus.COMPLETED).length || 0;
    const onHoldTasks = this.dashboardTaskList.filter(task => task.taskStatus === EProjectsTaskStatus.HOLD).length || 0;
    console.log('onGoingTasks', onGoingTasks)
    this.taskStatusData = {
      datasets: [{
        data: [onGoingTasks, completedTasks, onHoldTasks]
      }],
      labels: [
        'On Going',
        'Completed',
        'On Hold'
      ]
    };

  }

  setDashboardForReportees() {
    const onGoingTasks = this.dashboardReporteesTaskList.filter(task => task.taskStatus === EProjectsTaskStatus.ONGOING).length || 0;
    const completedTasks = this.dashboardReporteesTaskList.filter(task => task.taskStatus === EProjectsTaskStatus.COMPLETED).length || 0;
    const onHoldTasks = this.dashboardReporteesTaskList.filter(task => task.taskStatus === EProjectsTaskStatus.HOLD).length || 0;
    console.log('onGoingTasks', onGoingTasks)
    this.taskStatusReporteesData = {
      datasets: [{
        data: [onGoingTasks, completedTasks, onHoldTasks]
      }],
      labels: [
        'On Going',
        'Completed',
        'On Hold'
      ]
    };

  }

  reportingSearchFunction() {
    console.log('need to look..')
  }

  onChangeDashboardTaskStatus(event: any) {
    console.log('event', event);
    if (event.value !== 'projectWise') {
      this.getTaskStatusInDashboard()
    }
  }

  onChangeMyActivitiesTaskstatus(event: any) {
    console.log('onchange activi tas sta', event);
    console.log('myActivityTaskStatus', this.dashboardFilterDetails.myActivityTaskStatusSelection)
    const statuses = this.dashboardFilterDetails.myActivityTaskStatusSelection.map(status => status.value)
    this.getAllOpenTasks(statuses.toString())
  }

  onChangeDashboardProjectWiseTaskStatus(event: any) {
    console.log('event', event);
    this.getTaskStatusInDashboard()
  }

  onChangeDashboardForReportees(event: any) {
    console.log('in dashboard for reportees', event);
    const employeeIds = this.dashboardFilterDetails.assignedToSelection.map(employee => employee.employeeId)
    this.getTaskStatusInDashboardForReportees(employeeIds)
  }

  onReporteeDetailsTaskList() {
    const employeeIds = this.reportingToOptions.map(employee => employee.employeeId)
    this.getTaskStatusInDashboardForReportees(employeeIds)
  }

  getAllProjects() {
    const payload = {
      departmentCode: encodeURIComponent(this.userStorage.department),
      // period: '01-01-2000'timeSheetTasksList
    }
    this.projectsService.getAllRealProjects(payload).then((projectsResponse: any) => {
      if (projectsResponse.type === 'success') {
        this.projects = projectsResponse.value;
        this.taskProjectNameOptions = this.projects;
        this.taskPublicProjectNameOptions = projectsResponse.value.filter(project => project.projectType === 'public');
      }
    });

  }

  onChangeProjectComment(event) {
    console.log('event', event);
    this.getAllComments({ id: event.id })
  }

  async getAllComments(filter: any = {}) {
    const commentsResponse: any = await this.projectsService.getAllComments(filter);
    if (commentsResponse.type === 'success') {
      console.log('this.comm', this.commentsList)
      this.commentsList = commentsResponse.value;
      this.commentsList.map(t => {
        t.commentsFormattedDate = t.commentDate ? moment.utc(t.commentDate).local().format(DatePickerOptions.datePicker.dateInputFormat) : '';
        t.commentBy = t.employee ? t.employee.name : ''
      });
      // this.setCommentsDataTable()
      // this.newComment.comments = '';
      console.log('here..', this.commentsList)
    }

  }


  getAllOpenTasks(statuses) {
    const payload = {
      employeeId: this.userStorage.employeeId,
      period: 'null',
      status: statuses,
    }
    if (!statuses) {
      delete payload.status
    }
    this.updateLoading(true)
    this.projectsService.getAllOpenTasks(payload).then((taskResponse: any) => {
      if (taskResponse.type === 'success') {
        this.openTasksList = taskResponse.value;
        this.setDashboard();
        this.updateLoading(false)

        this.openTasksList.map(t => {
          t.formattedStartDate = moment.utc(t.createdDate).local().format(DatePickerOptions.datePicker.dateTimeFormat);
          t.formattedEndDate = moment.utc(t.modifiedDate).local().format(DatePickerOptions.datePicker.dateTimeFormat);
          // t.timerService = new CountupTimerService();
        });

        // this.openTasksList.map(t => {
        //   t.timeSpend = Math.floor(Math.random() * 101);
        // });

        const activeTask = taskResponse.value.find(task => task.taskStatus === 'ongoing');
        console.log('activeTask', activeTask)
        console.log('activeTask', activeTask.timeSpend)

        if (activeTask) {
          // this.countupTimerService.setTimervalue(activeTask.timeSpend)
          // this.countUpTimer.startTime = activeTask.timeSpend;
          // console.log('time oub..', this.countUpTimer)
          // this.countUpTimer.r()
          this.countupTimerService.startTimer(0)
          // activeTask.timerService.startTimer(0)
        }
      }
    });


    this.updateLoading(false)
  }

  getTaskStatusInDashboard() {
    const payload = {
      period: this.dashboardFilterDetails.filterType.value,
      projectId: null,
    }

    if (payload.period === 'projectWise') {
      payload.projectId = this.dashboardFilterDetails.projectName.id
    } else {
      delete payload.projectId
    }

    this.projectsService.getAllOpenTasks(payload).then((taskResponse: any) => {
      if (taskResponse.type === 'success') {
        this.dashboardTaskList = taskResponse.value;
        this.setDashboard();
      }
    });
  }

  getEmployeeNameForGivenId(id) {
    const filterDetails = this.reportingToOptions.find(employee => employee.employeeCode === id);
    return filterDetails.employeeName || ''
  }

  async onTimeSheetSelect() {
    const payload = {
      employeeId: this.userStorage.employeeId,
    }
    this.getTimeSheetDetails(payload)
  }

  async onTimeSheetFilter() {
    console.log('timeSheetFilterDetails', this.timeSheetFilterDetails)
    const hasAssignedToSelection = this.timeSheetFilterDetails.assignedToSelection && Array.isArray(this.timeSheetFilterDetails.assignedToSelection)
    const assignedToSelection = hasAssignedToSelection ? this.timeSheetFilterDetails.assignedToSelection.map(employee => employee.employeeId) : []
    const payload = {
      employeeId: this.userStorage.employeeId,
      startDate: this.timeSheetFilterDetails.startDate,
      endDate: this.timeSheetFilterDetails.endDate,
      projectId: this.timeSheetFilterDetails.projectName.id,
      assignedToSelection: assignedToSelection.toString()
    }
    this.getTimeSheetDetails(payload)
  }

  async getTimeSheetDetails(payload: any) {
    const timeSheetTasksResponse: any = await this.projectsService.getAllHistoryTasks(payload);
    if (timeSheetTasksResponse.type === 'success') {
      this.timeSheetTasksList = timeSheetTasksResponse.value;
      this.timeSheetTasksList.map(t => {
        t.formattedStartDate = moment.utc(t.startDate).local().format(DatePickerOptions.datePicker.dateTimeFormat);
        t.formattedEndDate = moment.utc(t.endDate).local().format(DatePickerOptions.datePicker.dateTimeFormat);
        t.projectName = t.projects ? t.projects.projectName : '';
        t.taskName = t.tasks ? t.tasks.taskName : '';
        t.employeeName = t.employee ? t.employee.name : '';
      });
    }
  }

  getTaskStatusInDashboardForReportees(employeeIds) {
    const payload = {
      assignedToSelection: employeeIds.toString(),
    }

    this.projectsService.getAllOpenTasks(payload).then((taskResponse: any) => {
      if (taskResponse.type === 'success') {
        this.dashboardReporteesTaskList = taskResponse.value;
        this.dashboardTaskList.map(employee => {
          return {
            ...employee,
            // employeeName: this.getEmployeeNameForGivenId(employee.employeeId)
          }
        })
        this.setDashboardForReportees();

      }
    });
  }

  setDataTable() {

    this.openTasksTableOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 4
        },
        {
          orderable: false,
          targets: 5
        },
        {
          orderable: false,
          targets: 6
        },
        {
          orderable: false,
          targets: 7
        },
        {
          orderable: false,
          targets: 8
        },
      ],
      search: true,
      order: [],
      searching: true,
      id: 'openTasks',
      ...getExportOptions({ fileName: 'OpenTasks' })
    })

    this.dtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 6
        },
        {
          orderable: false,
          targets: 5
        },
      ],
      search: true,
      searching: true,
      ...getExportOptions({ fileName: 'ProjectsActivities' })
    })



    this.completedTasksTableOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 4
        },
      ],
      search: true,
      searching: true,
      ...getExportOptions({ fileName: 'CompletedTasks' })
    })

    this.reportingTasksTableOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 5
        },
      ],
      search: true,
      searching: true,
      ...getExportOptions({ fileName: 'ReportingTasks' })
    })

  }

  setCommentsDataTable() {

    this.commentsDataTableOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
      ],
      search: true,
      searching: true,
      ...getExportOptions({ fileName: 'ReportingTasks' })
    })

  }

  createProjectModal(form: NgForm) {
    form.reset();
    this.newProject = new IProject();
    this.newProject.status = EProjectsStatus.PENDING;
    this.newProject.projectType = EProjectTypes.PUBLIC;
    this.newProject.color = this.projectDefaultColor;
    this.projectModal.showModal()
  }

  createTaskModal(form: NgForm) {
    form.reset();
    this.newTask = new IProjectTask();
    this.newTask.taskStatus = EProjectsTaskStatus.PENDING;
    this.newTask.taskType = EProjectTypes.SELF;
    this.newTask.color = this.taskDefaultColor;
    this.tasksModal.showModal();

  }

  async createCommentModal(form: NgForm) {
    form.reset();
    this.commentsModal.showModal();

    // setTimeout(() => {
    // await this.getAllComments();
    // }, 100);

  }

  async submitNewProject(form: NgForm) {
    console.log(form);
    console.log('project', this.newProject);
    console.log('project', this.userStorage);
    this.newProject.employeeId = this.userStorage.employeeId
    const response = await this.projectsService.createProject(this.newProject);
    console.log('response', response);
    this.getAllProjects();
    this.projectModal.hideModal()
  }

  async submitNewTask(form: NgForm) {
    // this.newTask.assignedTo = this.userStorage.employeeId;
    this.newTask.employeeId = this.userStorage.employeeId
    this.newTask.projectName = this.newTask.taskProjectName.projectName,
      this.newTask.projectId = this.newTask.taskProjectName.id,
      this.newTask.startTime = new Date().getTime();
    this.newTask.taskPriority = Number(this.taskPriorityDetails.value);

    console.log('task', this.newTask);

    const response = await this.projectsService.createTask(this.newTask);
    console.log('response', response)
    this.getAllOpenTasks(undefined)
    this.tasksModal.hideModal()
  }

  async submitNewComment(form: NgForm) {
    console.log(form);

    const payload = {
      employeeId: this.userStorage.employeeId,
      projectId: this.newComment.taskProjectName.id,
      comments: this.newComment.comments,
      projectName: this.newComment.taskProjectName.projectName,
      commentDate: new Date()
    }

    const response: any = await this.projectsService.createComment(payload);

    console.log('response', response)
    if (response.isSuccess) {
      await this.getAllComments();
      form.controls['comments'].reset()
    }

    // this.commentsModal.hideModal()
  }

  onTabSelected(tab: string) {
    this.currentTab = tab;
    // this.setupDatatables();
  }

  getEmployeesReportingToMe() {
    const employeeId = this.userStorage.employeeId;
    const payload: EmployeeActionRequest = {
      employeeId: employeeId
    };
    this.taskService.getEmployeesReportingTo(payload)
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.reportingToOptions = response.employees;
          const self = this.reportingToOptions.find(r => r.employeeId === employeeId);
          self.employeeName = self.employeeName + '  (Self)';
          this.reportingToOptions = this.reportingToOptions.filter(r => r.employeeId !== employeeId);
          this.reportingToOptions = [...this.reportingToOptions];
        }
      });
  }

  handleTaskColor($event: ColorEvent) {
    this.taskDefaultColor = $event.color.hex;
    this.newTask.color = $event.color.hex;
  }

  handleProjectColor($event: ColorEvent) {
    this.projectDefaultColor = $event.color.hex;
    this.newProject.color = $event.color.hex;
  }

  async onTaskUpdate(mode, task: IProjectTask) {
    const status = {
      start: EProjectsTaskStatus.ONGOING,
      hold: EProjectsTaskStatus.HOLD,
      complete: EProjectsTaskStatus.COMPLETED,
      cancel: EProjectsTaskStatus.CANCELLED
    }
    console.log('task..', task)
    const payload = {
      taskId: task.id,
      taskStatus: status[mode] || EProjectsTaskStatus.PENDING,
      startTime: new Date(),
      stopTime: new Date(),
      projectId: task.projectId,
      employeeId: this.userStorage.employeeId
    }
    console.log('payload', payload)
    const updateResponse: any = await this.projectsService.updateTask(payload);
    console.log('updateResponse,', updateResponse)
    this.taskCompletedDone = true;

    if (updateResponse.isSuccess) {

      this.getAllOpenTasks(undefined);

      // const updated = this.openTasksList.map(task => {
      //   if (updateResponse.value.id === task.id) {
      //     return updateResponse.value;
      //   }
      //   return task;
      // })

      // console.log(this.openTasksList)
      // console.log('updated', updated)

      // this.openTasksList = updated;


      // this.projectsService.getAllOpenTasks(payload).then((taskResponse: any) => {
      //   if (taskResponse.type === 'success') {
      //     this.openTasksList = taskResponse.value;
      //     this.setDashboard();
      //   }
      // });
      this.openTasksList.map(t => {
        t.formattedStartDate = moment.utc(t.createdDate).local().format(DatePickerOptions.datePicker.dateTimeFormat);
        t.formattedEndDate = moment.utc(t.modifiedDate).local().format(DatePickerOptions.datePicker.dateTimeFormat);
      });

      setTimeout(() => {
        this.taskCompletedDone = false;
      }, 2000)

    }

  }


}
