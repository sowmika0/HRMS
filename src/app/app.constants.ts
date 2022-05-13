import { ColorPickerItem, NotificationConstant } from './app.model';
import { EProjectTypes, EProjectsStatus, EProjectsTaskStatus } from './pages/projects/projects.model';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { MenuItem } from './shared/layout/menu-bar/menu-bar.model';

export class AppSettings {
  public static probationDays = 184;

  public static holidayTypes = [
    { label: 'National Holiday', value: 'national', color: '#f46600' },
    { label: 'Festival Holiday', value: 'festival', color: '#c6a670' },
    { label: 'Internal Holiday', value: 'internal', color: '#bcd6e7' },
    { label: 'Saturday Week Off', value: 'saturday-off', color: '#f0b89a' },
  ];

  public static notificationType: NotificationConstant[] = [
    {
      id: 1,
      type: 'newTask',
      text: 'A new task is created for you by {userName}.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },
    {
      id: 2,
      type: 'deleteTask',
      text: 'A task assigned to you was deleted by {userName}.',
      route: null,
      icon: 'fas fa-tasks'
    },
    {
      id: 3,
      type: 'updateTask',
      text: 'A task assigned to you was updated by {userName}.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },
    {
      id: 4,
      type: 'changeAssignedTask',
      text: 'A task has been assigned to you by {userName}.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },
    {
      id: 5,
      type: 'completeTask',
      text: 'A task assigned to {userName} has been marked completed.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },
    {
      id: 6,
      type: 'verifyTask',
      text: 'A task marked completed by you is verified by {userName}.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },
    {
      id: 7,
      type: 'addCommentAssigned',
      text: 'A new comment is added by {userName} in a task assigned to you.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },
    {
      id: 8,
      type: 'addCommentAddedBy',
      text: 'A new comment is added by {userName} in a task created by you.',
      route: 'tasks/{taskId}',
      icon: 'fas fa-tasks'
    },

    {
      id: 9,
      type: 'appraisalAdded',
      text: 'A new appraisal window has been set for you.',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 10,
      type: 'appraisadUpdated',
      text: 'The active appraisal details are updated.',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 11,
      type: 'appraisalDeleted',
      text: 'The active appraisal for you is deleted.',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 12,
      type: 'appraisalSelfSubmitted',
      text: 'You have submitted your self appraisal for the active appraisal.',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 13,
      type: 'appraisalManagerSubmitted',
      text: 'Your appraisal process has been forwarded to HR by {userName}',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 14,
      type: 'appraisalCompleted',
      text: 'Your appraisal process has been completed by {userName} and your rating is set.',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },

    {
      id: 15,
      type: 'employeeSelfUpdate',
      text: 'You have updated your profile - {section}.',
      route: 'my-profile',
      icon: 'fas fa-user'
    },
    {
      id: 16,
      type: 'employeeHrUpdate',
      text: '{userName} has updated your profile - {section}.',
      route: 'my-profile',
      icon: 'fas fa-user'
    },
    {
      id: 17,
      type: 'employeeHrVerified',
      text: '{userName} has verified the changes in your profile - {section}.',
      route: 'my-profile',
      icon: 'fas fa-user'
    },

    {
      id: 18,
      type: 'ticketNewSelf',
      text: 'A new ticket has been added by you.',
      route: 'tickets/{ticketId}',
      icon: 'fas fa-flag'
    },
    {
      id: 19,
      type: 'ticketStarted',
      text: '{userName} started working on the ticket created by you.',
      route: 'tickets/{ticketId}',
      icon: 'fas fa-flag'
    },
    {
      id: 20,
      type: 'ticketClosed',
      text: '{userName} closed the ticket created by you.',
      route: 'tickets/{ticketId}',
      icon: 'fas fa-flag'
    },
    {
      id: 21,
      type: 'ticketAddedOwner',
      text: 'A new ticket has been created by {userName} in a category you own - {category}',
      route: 'tickets/{ticketId}',
      icon: 'fas fa-flag'
    },
    {
      id: 22,
      type: 'ticketComment',
      text: 'A new comment has been added to a ticket you created.',
      route: 'tickets/{ticketId}',
      icon: 'fas fa-flag'
    },

    {
      id: 18,
      text: 'A new ticket has been added by you.',
      route: 'tickets/{ticketId}'
    },
    {
      id: 23,
      type: 'objectiveSelfSubmitted',
      text: 'You have submitted your self objective for the active appraisal.',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 24,
      type: 'objectiveManagerSubmitted',
      text: 'Your objective process has been forwarded to HR by {userName}',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 25,
      type: 'objectiveHRSubmitted',
      text: 'Your objective has been submitted by HR',
      route: 'my-profile/appraisal',
      icon: 'fas fa-scroll'
    },
    {
      id: 26,
      type: 'resignationInitiated',
      text: 'Resignation has been initiated by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 27,
      type: 'L1ApprovedResignation',
      text: '{empCode} Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 28,
      type: 'L1ApprovedResignationToEmp',
      text: 'Your Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 29,
      type: 'L2ApprovedResignation',
      text: 'Your Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 30,
      type: 'L1RejectedResignation',
      text: '{empCode} Resignation has been Rejected by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 31,
      type: 'L1RejectedResignationToEmp',
      text: 'Your Resignation has been Rejected by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 32,
      type: 'L2RejectedResignation',
      text: 'Your Resignation has been Rejected  by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 33,
      type: 'L2ApprovedResignationToRM',
      text: '{empCode} Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 34,
      type: 'HRApprovedResignation',
      text: 'Your Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 35,
      type: 'L2RejectedResignationToRM',
      text: '{empCode} Resignation has been rejected by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 36,
      type: 'HRApprovedResignationToRM',
      text: '{empCode} Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 37,
      type: 'HRApprovedResignationToL2',
      text: '{empCode} Resignation has been approved by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 38,
      type: 'HRRejectedResignationToRM',
      text: '{empCode} Resignation has been rejected by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 39,
      type: 'HRRejectedResignationToL2',
      text: '{empCode} Resignation has been rejected by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 40,
      type: 'HRRejectedResignationToEmp',
      text: 'Your Resignation has been rejected by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 41,
      type: 'ExitProcessingEmp',
      text: 'Resignation Clearance has been initiated by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 42,
      type: 'ExitProcessingRM',
      text: '{empCode} Resignation Clearance has been initiated by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 43,
      type: 'ExitProcessingL2',
      text: '{empCode} Resignation Clearance has been initiated by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 44,
      type: 'ClearanceCompletedEmp',
      text: 'Resignation Clearance has been completed by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 45,
      type: 'ClearanceCompletedRM',
      text: '{empCode} Resignation Clearance has been completed by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 46,
      type: 'ClearanceCompletedL2',
      text: '{empCode} Resignation Clearance has been completed by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 47,
      type: 'ResignationRevokedToEmp',
      text: 'Your Resignation has been revoked by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 48,
      type: 'ResignationRevokedToRM',
      text: '{empCode} Resignation has been revoked by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 49,
      type: 'ResignationRevokedToL2',
      text: '{empCode} Resignation has been revoked by {userName}',
      route: 'my-profile/exit',
      icon: 'fas fa-scroll'
    },
    {
      id: 50,
      type: 'EmpTrainingConfirmation',
      text: 'Your Training program has been scheduled',
      route: 'my-profile/trainings',
      icon: 'fas fa-scroll'
    },
    {
      id: 51,
      type: 'RMTrainingConfirmation',
      text: '{empCode} Training program has been scheduled',
      route: 'my-profile/trainings',
      icon: 'fas fa-scroll'
    },
    {
      id: 52,
      type: 'EmpTrainingCompleted',
      text: 'Your Training program has been completed',
      route: 'my-profile/trainings',
      icon: 'fas fa-scroll'
    },
  ];

  public static logos = {
    small: '**********' + 'logo/small.png',
    full: '**********' + 'logo/full.png',
    alternate: '**********' + 'logo/alternate.png',
  }

  public static onlyOneSelection = [
    'Father',
    'Mother',
    'Husband',
    'Wife'
  ];

  public static mediclaimAllowed = [
    'Father',
    'Mother',
    'Husband',
    'Wife',
    'Son',
    'Daughter'
  ];

  public static allModules: MenuItem[] = [
    {
      icon: 'fas fa-home',
      subMenuList: [],
      title: 'Dashboard',
      url: '/dashboard',
      showAdmin: true,
      showEmployee: true,
      showHr: true
    },
    {
      icon: 'fas fa-user',
      subMenuList: [],
      title: 'My Profile',
      url: '/my-profile',
      showAdmin: false,
      showEmployee: true,
      showHr: true
    },
    {
      icon: 'fas fa-tasks',
      subMenuList: [],
      title: 'My Tasks',
      url: '/tasks',
      showAdmin: false,
      showEmployee: true,
      showHr: true
    },
    {
      icon: 'fas fa-assistive-listening-systems',
      subMenuList: [],
      title: 'Projects',
      url: '/projects',
      showAdmin: true,
      showEmployee: true,
      showHr: true
    },
    {
      icon: 'fas fa-th-list',
      subMenuList: [],
      title: 'Reports',
      url: '/reports',
      showAdmin: false,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-flag',
      subMenuList: [],
      title: 'Tickets',
      url: '/tickets',
      showAdmin: true,
      showEmployee: true,
      showHr: true
    },
    {
      icon: 'fas fa-bullhorn',
      subMenuList: [],
      title: 'Announcement',
      url: '/announcement',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-scroll',
      subMenuList: [],
      title: 'Appraisal',
      url: '/appraisals',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-users',
      subMenuList: [],
      title: 'Employees',
      url: '/employees',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-hiking',
      subMenuList: [],
      title: 'Trainings',
      url: '/trainings',
      showAdmin: false,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-user-tie',
      subMenuList: [],
      title: 'Audit',
      url: '/audit',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-cog',
      subMenuList: [],
      title: 'Company Settings',
      url: '/settings/announcement-types',
      showAdmin: true,
      showEmployee: false,
      showHr: false
    },
    {
      icon: 'fas fa-users',
      subMenuList: [],
      title: 'Roles',
      url: '/roles',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-tachometer-alt',
      subMenuList: [],
      title: 'Mood Meter',
      url: '/mood-meter',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    },
    {
      icon: 'fas fa-door-open',
      subMenuList: [],
      title: 'Exit',
      url: '/exit',
      showAdmin: true,
      showEmployee: false,
      showHr: true
    }
  ];
}

export class RegEx {
  public static phoneNumber: RegExp | string = new RegExp(/^[0-9]{10}$/);
  public static panNumber: RegExp | string = new RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/g);
  public static gstnumber: RegExp | string = new RegExp(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/);
  public static pincode: RegExp | string = new RegExp(/^[1-9][0-9]{5}$/);
  public static uan: RegExp | string = new RegExp(/^[0-9]{12}$/g);
  public static aadhar: RegExp | string = new RegExp(/^[0-9]{12}$/g);
  public static password: RegExp | string = new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/);
  public static numbersWithDecimal: RegExp | string = new RegExp(/^\d{0,2}(\.\d{1,2})?$/);
  public static otpLength: RegExp | string = new RegExp(/^[a-zA-Z]{8}$/);
  public static textareaMaxLength: RegExp | string = new RegExp(/^.{0,400}$/);
}

export class AppApiEndpoints {
  public static baseUrl = '**********';
  public static newBaseUrl = 'NEWAPI';

  public static controllers = {
    auth: { route: AppApiEndpoints.baseUrl + 'auth/', isMock: false },
    nodeAuth: { route: AppApiEndpoints.newBaseUrl + 'nodeAuth/', isMock: false },
    user: { route: AppApiEndpoints.baseUrl + 'user/', isMock: false },
    company: { route: AppApiEndpoints.baseUrl + 'company/', isMock: false },
    employee: { route: AppApiEndpoints.baseUrl + 'employee/', isMock: false },
    tasks: { route: AppApiEndpoints.baseUrl + 'task/', isMock: false },
    tickets: { route: AppApiEndpoints.baseUrl + 'tickets/', isMock: false },
    appraisal: { route: AppApiEndpoints.baseUrl + 'appraisal/', isMock: false },
    announcement: { route: AppApiEndpoints.baseUrl + 'announcement/', isMock: false },
    notification: { route: AppApiEndpoints.baseUrl + 'notification/', isMock: false },
    dashboard: { route: AppApiEndpoints.baseUrl + 'dashboard/', isMock: false },
    training: { route: AppApiEndpoints.baseUrl + 'training/', isMock: false },
    audit: { route: AppApiEndpoints.baseUrl + 'audit/', isMock: false },
    projects: { route: AppApiEndpoints.newBaseUrl + 'projects/', isMock: false },
    comments: { route: AppApiEndpoints.newBaseUrl + 'projectComments/', isMock: false },
    projectsTasks: { route: AppApiEndpoints.newBaseUrl + 'tasks/', isMock: false },
    employeeReports: { route: AppApiEndpoints.baseUrl + 'employee/', isMock: false },
    roles: { route: AppApiEndpoints.newBaseUrl + 'roles/', isMock: false },
    moodMeter: { route: AppApiEndpoints.newBaseUrl + 'moodMeter/', isMock: false },
    employeeNewRoute: { route: AppApiEndpoints.newBaseUrl + 'employee/', isMock: false },
  };

  public static dashboardRoute = {
    getDashboardAnnouncements: AppApiEndpoints.controllers.dashboard.route + 'getDashboardAnnouncements',
    getEmployeeBirthdays: AppApiEndpoints.controllers.dashboard.route + 'getEmployeeBirthdays',
    getHolidays: AppApiEndpoints.controllers.dashboard.route + 'getHolidays',
    getManagerDashboardStats: AppApiEndpoints.controllers.dashboard.route + 'getManagerDashboardStats',
    getHrDashboardStats: AppApiEndpoints.controllers.dashboard.route + 'getHrDashboardStats',
  };

  public static notificationRoute = {
    getRecentNotifications: AppApiEndpoints.controllers.notification.route + 'getRecentNotifications',
    getAllNotifications: AppApiEndpoints.controllers.notification.route + 'getAllNotifications',
    markReadNotifications: AppApiEndpoints.controllers.notification.route + 'markReadNotifications',
  };

  public static authRoute = {
    login: AppApiEndpoints.controllers.auth.route + 'login',
    forgotPassword: AppApiEndpoints.controllers.auth.route + 'forgotPassword',
    logout: AppApiEndpoints.controllers.auth.route + 'logout',
    loginOtp: AppApiEndpoints.controllers.auth.route + 'loginotp',
    loginToNodeServer: AppApiEndpoints.controllers.nodeAuth.route + 'login',
  };

  public static companyRoute = {
    getTicketFaq: AppApiEndpoints.controllers.company.route + 'getTicketFaqs',
    getCompanySettings: AppApiEndpoints.controllers.company.route + 'getCompanySettings',
    getLocationsForDropdown: AppApiEndpoints.controllers.company.route + 'getLocationsForDropdown',
    getTicketCategoryForDropdown: AppApiEndpoints.controllers.company.route + 'getTicketCategoryForDropdown',
    updateCompanySettings: AppApiEndpoints.controllers.company.route + 'updateCompanySettings',
    updateCompanyDetails: AppApiEndpoints.controllers.company.route + 'updateCompanyDetails',
    getRolesForDropdown: AppApiEndpoints.controllers.company.route + 'getRolesForDropdown',
    getDocumentTypesForDropdown: AppApiEndpoints.controllers.company.route + 'getDocumentTypesForDropdown',
    getTeamsForDropdown: AppApiEndpoints.controllers.company.route + 'getTeamsForDropdown',
    getCategoriesForDropdown: AppApiEndpoints.controllers.company.route + 'getCategoriesForDropdown',
    getDepartmentsForDropdown: AppApiEndpoints.controllers.company.route + 'getDepartmentsForDropdown',
    getGradesForDropdown: AppApiEndpoints.controllers.company.route + 'getGradesForDropdown',
    getDesignationsForDropdown: AppApiEndpoints.controllers.company.route + 'getDesignationsForDropdown',
    getRegionsForDropdown: AppApiEndpoints.controllers.company.route + 'getRegionsForDropdown',
    getReportingToForDropdown: AppApiEndpoints.controllers.company.route + 'getReportingToForDropdown',
    getAppraisalQuestions: AppApiEndpoints.controllers.company.route + 'getAppraisalQuestions',
    updateAppraisalQuestions: AppApiEndpoints.controllers.company.route + 'updateAppraisalQuestions',
    getAppraisalRatings: AppApiEndpoints.controllers.company.route + 'getAppraisalRatings',
    getAnnouncementTypesForDropdown: AppApiEndpoints.controllers.company.route + 'getAnnouncementTypesForDropdown',
    getAssetTypesForDropdown: AppApiEndpoints.controllers.company.route + 'getAssetTypesForDropdown',
    getTrainingsForDropdown: AppApiEndpoints.controllers.company.route + 'getTrainingsForDropdown',
    getTrainingCodeForDropdown: AppApiEndpoints.controllers.company.route + 'getTrainingCodeForDropdown',
    uploadDataToSettings: AppApiEndpoints.controllers.company.route + 'uploadDataToSettings',
  };

  public static employeeRoute = {
    changePassword: AppApiEndpoints.controllers.employee.route + 'changePassword',
    getEmployeeAccount: AppApiEndpoints.controllers.employee.route + 'getEmployeeAccount',
    getEmployeePersonal: AppApiEndpoints.controllers.employee.route + 'getEmployeePersonal',
    getEmployeeCompany: AppApiEndpoints.controllers.employee.route + 'getEmployeeCompany',
    getEmployeeStatutory: AppApiEndpoints.controllers.employee.route + 'getEmployeeStatutory',
    getEmployeeDocuments: AppApiEndpoints.controllers.employee.route + 'getEmployeeDocuments',
    getEmployeeReportees: AppApiEndpoints.controllers.employee.route + 'getEmployeeReportees',
    getEmployeeCompensation: AppApiEndpoints.controllers.employee.route + 'getEmployeeCompensation',
    getEmployeeBanks: AppApiEndpoints.controllers.employee.route + 'getEmployeeBanks',
    getEmployeeContacts: AppApiEndpoints.controllers.employee.route + 'getEmployeeContacts',
    getEmployeeFamily: AppApiEndpoints.controllers.employee.route + 'getEmployeeFamily',
    getEmployeeEducation: AppApiEndpoints.controllers.employee.route + 'getEmployeeEducation',
    getEmployeeLanguage: AppApiEndpoints.controllers.employee.route + 'getEmployeeLanguage',
    getEmployeeReference: AppApiEndpoints.controllers.employee.route + 'getEmployeeReference',
    getEmployeePreviousCompany: AppApiEndpoints.controllers.employee.route + 'getEmployeePreviousCompany',
    getEmployeeAppraisalDetails: AppApiEndpoints.controllers.employee.route + 'getEmployeeAppraisalDetails',
    getEmployeeAppraisalReport: AppApiEndpoints.controllers.employee.route + 'getEmployeeAppraisalReport',
    getEmployeeSingleAppraisalDetails: AppApiEndpoints.controllers.employee.route + 'getEmployeeSingleAppraisalDetails',
    getEmployeesForReportingDropdown: AppApiEndpoints.controllers.employee.route + 'getEmployeesForReportingDropdown',
    getEmployeeAnnouncements: AppApiEndpoints.controllers.employee.route + 'getEmployeeAnnouncements',
    createNewEmployee: AppApiEndpoints.controllers.employee.route + 'createNewEmployee',
    copyNewEmployee: AppApiEndpoints.controllers.employee.route + 'copyNewEmployee',
    updateEmployeeAccount: AppApiEndpoints.controllers.employee.route + 'updateEmployeeAccount',
    updateEmployeePersonal: AppApiEndpoints.controllers.employee.route + 'updateEmployeePersonal',
    updateEmployeeCompany: AppApiEndpoints.controllers.employee.route + 'updateEmployeeCompany',
    updateEmployeeStatutory: AppApiEndpoints.controllers.employee.route + 'updateEmployeeStatutory',
    updateEmployeeDocument: AppApiEndpoints.controllers.employee.route + 'updateEmployeeDocument',
    deleteEmployeeDocument: AppApiEndpoints.controllers.employee.route + 'deleteEmployeeDocument',
    updateEmployeeContact: AppApiEndpoints.controllers.employee.route + 'updateEmployeeContact',
    updateEmployeeFamily: AppApiEndpoints.controllers.employee.route + 'updateEmployeeFamily',
    updateEmployeeEducation: AppApiEndpoints.controllers.employee.route + 'updateEmployeeEducation',
    updateEmployeePreviousCompany: AppApiEndpoints.controllers.employee.route + 'updateEmployeePreviousCompany',
    updateEmployeeAsset: AppApiEndpoints.controllers.employee.route + 'updateEmployeeAssets',
    updateEmployeeBank: AppApiEndpoints.controllers.employee.route + 'updateEmployeeBank',
    updateEmployeeLanguage: AppApiEndpoints.controllers.employee.route + 'updateEmployeeLanguage',
    updateEmployeeReference: AppApiEndpoints.controllers.employee.route + 'updateEmployeeReference',
    convertEmployeeToOnRoll: AppApiEndpoints.controllers.employee.route + 'convertEmployeeToOnRoll',
    checkIfEmployeeExist: AppApiEndpoints.controllers.employee.route + 'checkIfEmployeeExist',
    getAllEmployees: AppApiEndpoints.controllers.employee.route + 'getAllEmployees',
    deleteEmployee: AppApiEndpoints.controllers.employee.route + 'deleteEmployee',
    toggleEmployeeLogin: AppApiEndpoints.controllers.employee.route + 'toggleEmployeeLogin',
    saveAppraisalAnswers: AppApiEndpoints.controllers.employee.route + 'saveAppraisalAnswers',
    saveRecommendedFitmentOrPromotion: AppApiEndpoints.controllers.employee.route + 'saveRecommendedFitmentOrPromotion',
    saveAppraisalTrainings: AppApiEndpoints.controllers.employee.route + 'saveAppraisalTrainings',
    getAllAppraisalsPendingWithHr: AppApiEndpoints.controllers.employee.route + 'getAllAppraisalsPendingWithHr',
    saveAppraisalInternalAnswers: AppApiEndpoints.controllers.employee.route + 'saveAppraisalInternalAnswers',
    submitAppraisalAnswers: AppApiEndpoints.controllers.employee.route + 'submitAppraisalAnswers',
    updateFeedback: AppApiEndpoints.controllers.employee.route + 'updateFeedback',
    saveAppraisalRating: AppApiEndpoints.controllers.employee.route + 'saveAppraisalRating',
    getEmployeeReportingToAppraisal: AppApiEndpoints.controllers.employee.route + 'getEmployeeReportingToAppraisal',
    getEmployeesReportingTo: AppApiEndpoints.controllers.employee.route + 'getEmployeesReportingTo',
    getEmployeeDataVerification: AppApiEndpoints.controllers.employee.route + 'getEmployeeDataVerification',
    verifyEmployeeDataUpdate: AppApiEndpoints.controllers.employee.route + 'verifyEmployeeDataUpdate',
    getHrEmployeesForDropdown: AppApiEndpoints.controllers.employee.route + 'getHrEmployeesForDropdown',
    getAllEmployeesForDropdown: AppApiEndpoints.controllers.employee.route + 'getAllEmployeesForDropdown',
    getEmployeeOrgChart: AppApiEndpoints.controllers.employee.route + 'getEmployeeOrgChart',
    getEmployeeAssets: AppApiEndpoints.controllers.employee.route + 'getEmployeeAssets',
    getEmployeeAssetSignings: AppApiEndpoints.controllers.employee.route + 'getEmployeeAssetSignings',
    updateEmployeeAssetSignings: AppApiEndpoints.controllers.employee.route + 'updateEmployeeAssetSignings',
    updateEmployeeCompensation: AppApiEndpoints.controllers.employee.route + 'updateEmployeeCompensation',
    getEmployeeTrainings: AppApiEndpoints.controllers.employee.route + 'getEmployeeTrainings',
    resignEmployee: AppApiEndpoints.controllers.employee.route + 'resignEmployee',
    initiateEmployeeResignation: AppApiEndpoints.controllers.employee.route + 'initiateEmployeeResignation',
    updateEmployeeResignation: AppApiEndpoints.controllers.employee.route + 'updateEmployeeResignation',
    getEmployeeExits: AppApiEndpoints.controllers.employee.route + 'getEmployeeExits',
    getAllEmployeeExitRequest: AppApiEndpoints.controllers.employee.route + 'GetAllEmployeeExitRequest',
    getEmployeeRehire: AppApiEndpoints.controllers.employee.route + 'getEmployeeRehire',
    saveEmployeeExitForm: AppApiEndpoints.controllers.employee.route + 'createEmployeeExitForm',
    saveHRFeedBackForm: AppApiEndpoints.controllers.employee.route + 'createHRFeedBackForm',
    saveHODFeedBackForm: AppApiEndpoints.controllers.employee.route + 'createHODFeedBackForm',
    getEmployeeExitForm: AppApiEndpoints.controllers.employee.route + 'getEmployeeExitForm',
    getHODFeedBackForm: AppApiEndpoints.controllers.employee.route + 'getHODFeedBackForm',
    getHRFeedBackForm: AppApiEndpoints.controllers.employee.route + 'getHRFeedBackForm',
    getAllEmployeeExitWithAssets: AppApiEndpoints.controllers.employee.route + 'getAllEmployeeExitWithAssets',
    getExitEmployeeAssetDetails: AppApiEndpoints.controllers.employee.route + 'getEmployeeExitAssetDetails',
    updateExitEmployeeAssetDetails: AppApiEndpoints.controllers.employee.route + 'updateEmployeeExitAssetDetails',
    getEmployeeCareerDetails: AppApiEndpoints.controllers.employee.route + 'getEmployeeCareers',
    updateEmployeeCareerDetail: AppApiEndpoints.controllers.employee.route + 'updateEmployeeCareer',

    submitObjective: AppApiEndpoints.controllers.employee.route + 'submitObjective',
    getEmployeeRptBday: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptBday',
    getEmployeeRptHeadCount: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptHeadCount',
    getEmployeeRptWday: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptWday',
    getEmployeeRptProbation: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptProbation',
    getEmployeeRptAddandExit: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptAddandExit',
    getEmployeeBasicReport: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptBasic',
    getEmployeeResignedReport: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptResigned',
    getEmployeeObectiveReport: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptObjective',
    getEmployeeCTCReport: AppApiEndpoints.controllers.employeeReports.route + 'getEmployeeRptCTC',
  };

  public static taskRoute = {
    getAllTasks: AppApiEndpoints.controllers.employee.route + 'getEmployeeTasks',
    getTaskFilters: AppApiEndpoints.controllers.employee.route + 'getEmployeeTaskFilter',
    addUpdateTask: AppApiEndpoints.controllers.tasks.route + 'updateTask',
    deleteTask: AppApiEndpoints.controllers.tasks.route + 'deleteTask',
    toggleStartTask: AppApiEndpoints.controllers.tasks.route + 'toggleStartTask',
    toggleCompleteTask: AppApiEndpoints.controllers.tasks.route + 'toggleCompleteTask',
    toggleVerifyTask: AppApiEndpoints.controllers.tasks.route + 'toggleVerifyTask',
    toggleIrrelevant: AppApiEndpoints.controllers.tasks.route + 'toggleIrrelevant',
    deleteCommentOnTask: AppApiEndpoints.controllers.tasks.route + 'deleteCommentOnTask',
    addCommentToTask: AppApiEndpoints.controllers.tasks.route + 'addCommentToTask',
    getTaskComments: AppApiEndpoints.controllers.tasks.route + 'getTaskComments',
    getTaskDetails: AppApiEndpoints.controllers.tasks.route + 'getTaskDetails'
  };

  public static appraisalRoute = {
    getAllAppraisals: AppApiEndpoints.controllers.appraisal.route + 'getAllAppraisals',
    getAppraisalDetails: AppApiEndpoints.controllers.appraisal.route + 'getAppraisalDetails',
    updateAppraisal: AppApiEndpoints.controllers.appraisal.route + 'updateAppraisal',
    deleteAppraisal: AppApiEndpoints.controllers.appraisal.route + 'deleteAppraisal',
  };

  public static auditRoute = {
    getAllAuditModules: AppApiEndpoints.controllers.audit.route + 'getAllAuditModules',
    getAllAudit: AppApiEndpoints.controllers.audit.route + 'getAllAudit',
  };

  public static announcementRoute = {
    getAllAnnouncements: AppApiEndpoints.controllers.announcement.route + 'getAllAnnouncements',
    getGeneralAnnouncementsToShow: AppApiEndpoints.controllers.announcement.route + 'getGeneralAnnouncementsToShow',
    getAnnouncementDetails: AppApiEndpoints.controllers.announcement.route + 'getAnnouncementDetails',
    updateAnnouncement: AppApiEndpoints.controllers.announcement.route + 'updateAnnouncement',
    deleteAnnouncement: AppApiEndpoints.controllers.announcement.route + 'deleteAnnouncement',
  };

  public static ticketRoute = {
    getAllTickets: AppApiEndpoints.controllers.tickets.route + 'getAllTickets',
    getTicketDetails: AppApiEndpoints.controllers.tickets.route + 'getTicketDetails',
    updateTicket: AppApiEndpoints.controllers.tickets.route + 'updateTicket',
    startTicket: AppApiEndpoints.controllers.tickets.route + 'startTicket',
    closeTicket: AppApiEndpoints.controllers.tickets.route + 'closeTicket',
    reopenTicket: AppApiEndpoints.controllers.tickets.route + 'reopenTicket',
    undoStartTicket: AppApiEndpoints.controllers.tickets.route + 'undoStartTicket',
    undoCloseTicket: AppApiEndpoints.controllers.tickets.route + 'undoCloseTicket',
    undoReopenTicket: AppApiEndpoints.controllers.tickets.route + 'undoReopenTicket',
    addTicketComment: AppApiEndpoints.controllers.tickets.route + 'addTicketComment',
    deleteTicketComment: AppApiEndpoints.controllers.tickets.route + 'deleteTicketComment'
  }

  public static trainingRoute = {
    getAllTrainings: AppApiEndpoints.controllers.training.route + 'getAllTrainings',
    updateTraining: AppApiEndpoints.controllers.training.route + 'updateTraining',
    getTrainingDetails: AppApiEndpoints.controllers.training.route + 'getTrainingDetails',
    deleteTraining: AppApiEndpoints.controllers.training.route + 'deleteTraining',
    confirmTraining: AppApiEndpoints.controllers.training.route + 'confirmTraining',
    addMoreNominees: AppApiEndpoints.controllers.training.route + 'addMoreNominees',
    startTraining: AppApiEndpoints.controllers.training.route + 'startTraining',
    closeFeedbackForTraining: AppApiEndpoints.controllers.training.route + 'closeFeedbackForTraining',
    acceptTraining: AppApiEndpoints.controllers.training.route + 'acceptTraining',
    rejectTraining: AppApiEndpoints.controllers.training.route + 'rejectTraining',
    fillAttendance: AppApiEndpoints.controllers.training.route + 'fillAttendance',
    completeTraining: AppApiEndpoints.controllers.training.route + 'completeTraining',
    submitFeedback: AppApiEndpoints.controllers.training.route + 'submitFeedback',
    getTrainingCalendar: AppApiEndpoints.controllers.training.route + 'getTrainingCalendar',
  }

  public static projectsRoute = {
    getAllProjects: AppApiEndpoints.controllers.projects.route + 'allProjects',
    createProject: AppApiEndpoints.controllers.projects.route + 'createProject',
    createTask: AppApiEndpoints.newBaseUrl + 'tasks',
  }

  public static commentsRoute = {
    getAllCommentsByProject: AppApiEndpoints.controllers.comments.route + 'findByProjectName',
    getAllComments: AppApiEndpoints.controllers.comments.route + 'allProjectComments',
    createComment: AppApiEndpoints.controllers.comments.route + 'addProjectComments'
  }

  public static projectTasksRoute = {
    getAllTasks: AppApiEndpoints.controllers.projectsTasks.route + 'allTasks',
    getAllHistoryTasks: AppApiEndpoints.controllers.projectsTasks.route + 'allHistoryTasks',
    updateTask: AppApiEndpoints.controllers.projectsTasks.route + 'updateTask',
  }

  public static rolesRoute = {
    getRolesModule: AppApiEndpoints.controllers.roles.route + 'getRolesModule',
    updateSettingsModuleAccess: AppApiEndpoints.controllers.roles.route + 'updateSettingsModuleAccess',
    addSettingsModuleAccess: AppApiEndpoints.controllers.roles.route + 'addSettingsModuleAccess',
    getRolesModulesSettings: AppApiEndpoints.controllers.roles.route + 'getRolesModulesSettings'
  }

  public static employeeNewRoute = {
    getEmployeeId: AppApiEndpoints.controllers.employeeNewRoute.route + 'getEmployeeId'
  }

  public static moodMeterRoute = {
    getMoodSettings: AppApiEndpoints.controllers.moodMeter.route + 'getMoodSettings',
    getSettingsMoodTags: AppApiEndpoints.controllers.moodMeter.route + 'getSettingsMoodTags',
    saveSettingsMoodTags: AppApiEndpoints.controllers.moodMeter.route + 'saveSettingsMoodTags',
    updateSettingsMoodTags: AppApiEndpoints.controllers.moodMeter.route + 'updateSettingsMoodTags',
    saveEmployeeMood: AppApiEndpoints.controllers.moodMeter.route + 'saveEmployeeMood',
    saveEmployeeMoodTags: AppApiEndpoints.controllers.moodMeter.route + 'saveEmployeeMoodTags',
    getEmployeeMoodForToday:  AppApiEndpoints.controllers.moodMeter.route + 'getEmployeeMoodForToday',
    getEmployeeMood: AppApiEndpoints.controllers.moodMeter.route + 'getEmployeeMood',
    getEmployeeMoodReports: AppApiEndpoints.controllers.moodMeter.route + 'getEmployeeMoodReports',
    getEmployeeMoodTags: AppApiEndpoints.controllers.moodMeter.route + 'getEmployeeMoodTags'
  }
}

export class SelectionConstants {

  public static reportTypeOptions = [
    { label: 'Employee Basic Information', value: 'EmployeeBasicInformation' },
    { label: 'Headcount Report (Location & Category wise)', value: 'Headcount' },
    { label: 'Employee Birthday', value: 'EmployeeBirthday' },
    { label: 'Employee Anniversary', value: 'EmployeeAnniversary' },
    { label: 'Addition & Exit Information', value: 'AdditionExitInformation' },
    { label: 'Employee CTC', value: 'EmployeeCTC' },
    { label: 'Resignation Employee', value: 'ResignationEmployee' },
    { label: 'Employee Probation', value: 'EmployeeProbation' },
    // { label: 'Training Feedback', value: 'TrainingFeedback' },
    { label: 'Objective / Appraisal Status Report', value: 'ObjectiveAppraisalStatusReport' },
  ]

  public static monthOptions = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ]

  public static bloodGroupOptions = [
    { label: 'A+ve', value: 'A+' },
    { label: 'O+ve', value: 'O+' },
    { label: 'B+ve', value: 'Be' },
    { label: 'AB+ve', value: 'AB+' },
    { label: 'A-ve', value: 'A-' },
    { label: 'O-ve', value: 'O-' },
    { label: 'B-ve', value: 'B-' },
    { label: 'AB-ve', value: 'AB-' },
  ];

  public static holidayTypes = [
    { label: 'National Holiday', value: 'national' },
    { label: 'Festival Holiday', value: 'festival' },
    { label: 'Internal Holiday', value: 'internal' },
    { label: 'Working Saturday', value: 'saturday-working' },
  ];

  public static maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Separated', value: 'Separated' },
  ];

  public static taskPriorityOptions = [
    { label: 'Low', value: '0' },
    { label: 'Moderate', value: '1' },
    { label: 'High', value: '2' },
  ];

  public static projectTypeOptions = [
    { label: 'Public', value: EProjectTypes.PUBLIC },
    { label: 'Self', value: EProjectTypes.SELF },
  ];

  // public static taskPriorityOptions = [
  //   { label: 'Public', value: 1 },
  //   { label: 'Self', value: 2 },
  // ];

  public static dashboardProjectFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Daily', value: 'daily' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Proect wise', value: 'projectWise' },
  ];
  public static statusFilterOptions = [
    { label: 'Pending', value: EProjectsTaskStatus.PENDING },
    { label: 'OnGoing', value: EProjectsTaskStatus.ONGOING },
    { label: 'Hold', value: EProjectsTaskStatus.HOLD },
    { label: 'Completed', value: EProjectsTaskStatus.COMPLETED },
    { label: 'Cancelled', value: EProjectsTaskStatus.CANCELLED },
  ];

  public static taskTypeOptions = [
    { label: 'Public', value: EProjectTypes.PUBLIC },
    { label: 'Self', value: EProjectTypes.SELF },
  ];

  public static statusOptions = [
    { label: 'On Roll', value: 'on-roll' },
    { label: 'Off Roll', value: 'off-roll' },
    { label: 'Trainee', value: 'trainee' },
    { label: 'Casual / Temp', value: 'casual' },
    { label: 'Expatriate', value: 'expatriate' },
  ];

  public static divisionOptions = [
    { label: 'HR-GA-IT', value: 'HR-GA-IT' },
    { label: 'F&A', value: 'F&A' },
    { label: 'Othrs', value: 'Othrs' },
    { label: 'Mfg', value: 'Mfg' },
    { label: 'Engg', value: 'Engg' },
    { label: 'SMP', value: 'SMP' },
    { label: 'S&M', value: 'S&M' },
    { label: 'CS', value: 'CS' },
  ];

  public static accountTypeOptions = [
    { label: 'Salary', value: 'salary' },
    { label: 'Savings', value: 'savings' },
  ];

  public static attachmentTypeOptions = [
    { label: 'Image', value: 'Image' },
    { label: 'Document', value: 'Document' },
  ];

  public static nationalityOptions = [
    { label: 'Indian', value: 'Indian' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Others', value: 'Others' },
  ];

  public static courseTypeOptions = [
    { label: 'Regular', value: 'Regular' },
    { label: 'Part Time', value: 'Part Time' },
    { label: 'Correspondance', value: 'Correspondance' },
  ];

  public static relationshipOptions = [
    { label: 'Father', value: 'Father' },
    { label: 'Mother', value: 'Mother' },
    { label: 'Brother', value: 'Brother' },
    { label: 'Sister', value: 'Sister' },
    { label: 'Son', value: 'Son' },
    { label: 'Daughter', value: 'Daughter' },
    { label: 'Husband', value: 'Husband' },
    { label: 'Wife', value: 'Wife' },
  ];

  public static languageProficiencyOptions = [
    { label: 'Novice', value: 'Novice' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Superior', value: 'Superior' },
  ];

  public static uploadSettingsTypeOptions = [
    { label: 'Announcement', value: 'Announcement' },
    { label: 'Asset Type', value: 'AssetType' },
    { label: 'Category', value: 'Category' },
    { label: 'Department', value: 'Department' },
    { label: 'Designation', value: 'Designation' },
    { label: 'Document Type', value: 'DocumentType' },
    { label: 'Grades', value: 'Grades' },
    { label: 'Location', value: 'Location' },
    { label: 'Product Line', value: 'ProductLine' },
    { label: 'Region', value: 'Region' },
    { label: 'Team', value: 'Team' },
    { label: 'Tickets', value: 'Tickets' },
    { label: 'TicketFAQ', value: 'TicketFAQ' },
    { label: 'Holidays', value: 'Holidays' },
  ];

  public static employeeUploadOptions = [
    { label: 'Create', value: 'Create' },
    { label: 'Personal Details', value: 'PersonalDetails' },
    { label: 'Statutory Details', value: 'StatutoryDetails' },
    { label: 'Company Details', value: 'CompanyDetails' },
    { label: 'Contact Details', value: 'ContactDetails' },
    { label: 'Bank Details', value: 'BankDetails' },
    { label: 'Family Details', value: 'FamilyDetails' },
    { label: 'Previous Employment Details', value: 'PreviousEmploymentDetails' },
    { label: 'Compensation Details', value: 'CompensationDetails' },
    { label: 'Training Details', value: 'TrainingDetails' },
    { label: 'Education Details', value: 'EducationDetails' },
    { label: 'Language Details', value: 'LanguageDetails' },
    { label: 'Asset Details', value: 'AssetDetails' },
  ];

  public static trainingCategoryTypes = [
    { label: 'Leadership', value: 'Leadership' },
    { label: 'Managerial', value: 'Managerial' },
    { label: 'Product', value: 'Product' },
    { label: 'Productivity', value: 'Productivity' },
    { label: 'Sales Skills', value: 'Sales Skills' },
    { label: 'Soft Skills', value: 'Soft Skills' },
    { label: 'Technical', value: 'Technical' },
    { label: 'Functional', value: 'Functional' },
  ];

  public static tenureInKAI = [
    { label: '0-6 months', value: '0-6 months' },
    { label: '6 months to 1 year', value: '6 months to 1 year' },
    { label: '1-2 years', value: '1-2 years' },
    { label: '2-4 years', value: '2-4 years' },
    { label: '4-6 years', value: '4-6 years' },
    { label: '6 and above', value: '6 and above' }
  ];

  public static totalIndustryExperience = [
    { label: '0-1 year', value: '0-1 year' },
    { label: '1-2 years', value: '1-2 years' },
    { label: '2-4 years', value: '2-4 years' },
    { label: '4-6 years', value: '4-6 years' },
    { label: '6-10 years', value: '6-10 years' },
    { label: '10-15 years', value: '10-15 years' },
    { label: '15-20 years', value: '15-20 years' },
    { label: '20 & above', value: '20 & above' }
  ];

  public static transferTypes = [
    { label: 'Location', value: 'Location' },
    { label: 'Department', value: 'Department' },
    { label: 'Both', value: 'Both' },
  ];
}

export class Languages {
  public static languages = [
    'Assamese',
    'Bengali',
    'Bodo',
    'Dogri',
    'English',
    'French',
    'Gujarati',
    'Hindi',
    'Japanese',
    'Kannada',
    'Kashmiri',
    'Konkani',
    'Maithili',
    'Malayalam',
    'Manipuri',
    'Marathi',
    'Nepali',
    'Oriya',
    'Punjabi',
    'Sanskrit',
    'Santhali',
    'Sindhi',
    'Tamil',
    'Telugu',
    'Urdu'
  ];
}

export class QuillConfig {
  public static config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']

      ['link']
    ]
  };
}

export class MomentFormats {
  public static smallDateFormat = 'DD MMM YY';
  public static dateFormat = 'DD MMMM YY';
  public static dateTimeFormat = 'DD MMM YY h:mm A';
}

export class LocalStorageItems {
  public static userInformation = 'hrms_information';
  public static userTokenInfo = 'node_api_token';
}

export class DatePickerOptions {
  public static datePicker = {
    // useUtc: true,
    adaptivePosition: true,
    containerClass: 'primary',
    customTodayClass: 'today-class-secondary',
    isAnimated: true,
    dateInputFormat: 'DD MMMM YYYY',
    rangeInputFormat: 'DD MMMM YYYY',
    dateInputFormatWOYear: 'DD MMMM',
    dateTimeFormat: 'DD MMMM YYYY HH:mm:ss',
    showWeekNumbers: false,
    yearOnlyFormat: 'YYYY'
  };
}

export class FileFormats {
  public static allFormats = '.png, .jpg, .jpeg, .gif, .pdf, .doc';
  public static images = '.png, .jpg, .jpeg';
  public static logos = '.png';
  public static settingsUpload = '.tsv';
}

export class WeekDay {
  public static day = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
}

export class DropzoneParameters {
  public static imageUploader: DropzoneConfigInterface = {
    maxFilesize: 5,
    // acceptedFiles: '',
    uploadMultiple: false,
    autoProcessQueue: false,
    url: AppApiEndpoints.controllers.auth.route,
    paramName: 'file',
    addRemoveLinks: true,
    dictRemoveFile: 'Remove',
    maxFiles: 1
  };
}

export class DataTableParameters {
  public static dataTableOptions: DataTables.Settings = {
    lengthMenu: [[10, 25, 50], [10, 25, 50]],
    pagingType: 'simple_numbers',
    deferRender: true,
    paging: true,
    order: [1],
    search: false,
    responsive: true,
    searching: false,
  }
}

export class ColorPickerColors {
  public static colors: ColorPickerItem[] = [
    {
      color: '#575962',
      backgroundColor: '#efefef'
    },
    {
      color: '#ffffff',
      backgroundColor: '#8e0622'
    },
    {
      color: '#575962',
      backgroundColor: '#efabbd'
    },
    {
      color: '#ffffff',
      backgroundColor: '#cf0500'
    },
    {
      color: '#575962',
      backgroundColor: '#f46600'
    },
    {
      color: '#575962',
      backgroundColor: '#c6a670'
    },
    {
      color: '#ffffff',
      backgroundColor: '#d63d62'
    },
    {
      color: '#ffffff',
      backgroundColor: '#ee3e6d'
    },
    {
      color: '#ffffff',
      backgroundColor: '#a367b5'
    },
    {
      color: '#ffffff',
      backgroundColor: '#4e0a77'
    },
    {
      color: '#ffffff',
      backgroundColor: '#4b4fce'
    },
    {
      color: '#575962',
      backgroundColor: '#dad0d8'
    },
    {
      color: '#575962',
      backgroundColor: '#9d8594'
    },
    {
      color: '#575962',
      backgroundColor: '#7c90c1'
    },
    {
      color: '#575962',
      backgroundColor: '#bcd6e7'
    },
    {
      color: '#575962',
      backgroundColor: '#b7d5c4'
    },
    {
      color: '#575962',
      backgroundColor: '#96c582'
    },
    {
      color: '#ffffff',
      backgroundColor: '#3f7a89'
    },
    {
      color: '#ffffff',
      backgroundColor: '#3e6158'
    },
    {
      color: '#ffffff',
      backgroundColor: '#000105'
    },
    {
      color: '#575962',
      backgroundColor: '#c1800b'
    },
    {
      color: '#575962',
      backgroundColor: '#c97545'
    },
    {
      color: '#ffffff',
      backgroundColor: '#62382f'
    },
    {
      color: '#575962',
      backgroundColor: '#f0ca68'
    },
    {
      color: '#575962',
      backgroundColor: '#f0b89a'
    }
  ];
}

export class States {
  public static states = [
    {
      code: "AN",
      name: "Andaman and Nicobar Islands"
    },
    {
      code: "AP",
      name: "Andhra Pradesh"
    },
    {
      code: "AR",
      name: "Arunachal Pradesh"
    },
    {
      code: "AS",
      name: "Assam"
    },
    {
      code: "BR",
      name: "Bihar"
    },
    {
      code: "CG",
      name: "Chandigarh"
    },
    {
      code: "CH",
      name: "Chhattisgarh"
    },
    {
      code: "DH",
      name: "Dadra and Nagar Haveli"
    },
    {
      code: "DD",
      name: "Daman and Diu"
    },
    {
      code: "DL",
      name: "Delhi"
    },
    {
      code: "GA",
      name: "Goa"
    },
    {
      code: "GJ",
      name: "Gujarat"
    },
    {
      code: "HR",
      name: "Haryana"
    },
    {
      code: "HP",
      name: "Himachal Pradesh"
    },
    {
      code: "JK",
      name: "Jammu and Kashmir"
    },
    {
      code: "JH",
      name: "Jharkhand"
    },
    {
      code: "KA",
      name: "Karnataka"
    },
    {
      code: "KL",
      name: "Kerala"
    },
    {
      code: "LD",
      name: "Lakshadweep"
    },
    {
      code: "MP",
      name: "Madhya Pradesh"
    },
    {
      code: "MH",
      name: "Maharashtra"
    },
    {
      code: "MN",
      name: "Manipur"
    },
    {
      code: "ML",
      name: "Meghalaya"
    },
    {
      code: "MZ",
      name: "Mizoram"
    },
    {
      code: "NL",
      name: "Nagaland"
    },
    {
      code: "OR",
      name: "Odisha"
    },
    {
      code: "PY",
      name: "Puducherry"
    },
    {
      code: "PB",
      name: "Punjab"
    },
    {
      code: "RJ",
      name: "Rajasthan"
    },
    {
      code: "SK",
      name: "Sikkim"
    },
    {
      code: "TN",
      name: "Tamilnadu"
    },
    {
      code: "TS",
      name: "Telangana"
    },
    {
      code: "TR",
      name: "Tripura"
    },
    {
      code: "UK",
      name: "Uttar Pradesh"
    },
    {
      code: "UP",
      name: "Uttarakhand"
    },
    {
      code: "WB",
      name: "West Bengal"
    }
  ]
}

export class ClassDescription {
  public static appraisalClass = [
    { label: 'S', value: 5 },
    { label: 'A', value: 4 },
    { label: 'B', value: 3 },
    { label: 'C', value: 2 },
    { label: 'D', value: 1 }
  ];
}

export class ErrorMessages {
  public static invalidOTP = 'Invalid OTP';
  public static loginError = 'Login id and the password does not match.';
}

export class DateFormat {
  public static shortDate = 'YYYY-MM-DD';
}