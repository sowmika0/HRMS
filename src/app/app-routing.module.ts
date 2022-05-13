import { RouterModule, Routes } from '@angular/router';

import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { AnnouncementDetailsComponent } from './pages/announcement/announcement-details/announcement-details.component';
import { AnnouncementListComponent } from './pages/announcement/announcement-list/announcement-list.component';
import { AppraisalComponent } from './pages/appraisal/appraisal.component';
import { AppraisalDetailsComponent } from './pages/appraisal/appraisal-details/appraisal-details.component';
import { AppraisalListComponent } from './pages/appraisal/appraisal-list/appraisal-list.component';
import { AppraisalQuestionsComponent } from './pages/appraisal/appraisal-questions/appraisal-questions.component';
import { AuditComponent } from './pages/audit/audit.component';
import { AuditListComponent } from './pages/audit/audit-list/audit-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeAccountComponent } from './pages/employee/employee-details/employee-account/employee-account.component';
import {
  EmployeeAppraisalComponent,
} from './pages/employee/employee-details/employee-appraisal/employee-appraisal.component';
import {
  EmployeeAssetSigningComponent,
} from './pages/employee/employee-details/employee-asset-signing/employee-asset-signing.component';
import { EmployeeAssetsComponent } from './pages/employee/employee-details/employee-assets/employee-assets.component';
import { EmployeeBankComponent } from './pages/employee/employee-details/employee-bank/employee-bank.component';
import { EmployeeCareerGrowthComponent } from './pages/employee/employee-details/employee-career-growth/employee-career-growth.component';
import { EmployeeCompanyComponent } from './pages/employee/employee-details/employee-company/employee-company.component';
import {
  EmployeeCompensationComponent,
} from './pages/employee/employee-details/employee-compensation/employee-compensation.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeeContactComponent } from './pages/employee/employee-details/employee-contact/employee-contact.component';
import { EmployeeDetailsComponent } from './pages/employee/employee-details/employee-details.component';
import { EmployeeDocumentComponent } from './pages/employee/employee-details/employee-document/employee-document.component';
import {
  EmployeeEducationComponent,
} from './pages/employee/employee-details/employee-education/employee-education.component';
import { EmployeeExitComponent } from './pages/employee/employee-details/employee-exit/employee-exit.component';
import { EmployeeFamilyComponent } from './pages/employee/employee-details/employee-family/employee-family.component';
import {
  EmployeeHierarchyComponent,
} from './pages/employee/employee-details/employee-hierarchy/employee-hierarchy.component';
import { EmployeeLanguageComponent } from './pages/employee/employee-details/employee-language/employee-language.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeePersonalComponent } from './pages/employee/employee-details/employee-personal/employee-personal.component';
import {
  EmployeePreviousCompanyComponent,
} from './pages/employee/employee-details/employee-previous-company/employee-previous-company.component';
import {
  EmployeeRecognitionComponent,
} from './pages/employee/employee-details/employee-recognition/employee-recognition.component';
import {
  EmployeeReferenceComponent,
} from './pages/employee/employee-details/employee-reference/employee-reference.component';
import {
  EmployeeReporteesComponent,
} from './pages/employee/employee-details/employee-reportees/employee-reportees.component';
import {
  EmployeeStatutoryComponent,
} from './pages/employee/employee-details/employee-statutory/employee-statutory.component';
import { EmployeeTasksComponent } from './pages/employee/employee-details/employee-tasks/employee-tasks.component';
import { EmployeeTicketComponent } from './pages/employee/employee-details/employee-ticket/employee-ticket.component';
import { EmployeeTrainingComponent } from './pages/employee/employee-details/employee-training/employee-training.component';
import { ExitComponent } from './pages/exit/exit.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { IsLoggedInGuard } from './guards/role.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { MainExitComponent } from './pages/exit/main-exit.component';
import { MainMoodMeterComponent } from './pages/mood-meter/main-mood-meter.component';
import { MoodMeterDetailComponent } from './pages/mood-meter/mood-meter-detail/mood-meter-detail.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/system/not-found/not-found.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectsListComponent } from './pages/projects/projects-list/projects-list.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReportsListComponent } from './pages/reports/reports-list/reports-list.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RolesDetailComponent } from './pages/roles/roles-detail/roles-detail.component';
import {
  SettingsAnnouncementTypeComponent,
} from './pages/settings/settings-announcement-type/settings-announcement-type.component';
import { SettingsAssetsComponent } from './pages/settings/settings-assets/settings-assets.component';
import { SettingsCategoryComponent } from './pages/settings/settings-category/settings-category.component';
import { SettingsCompanyComponent } from './pages/settings/settings-company/settings-company.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SettingsDepartmentComponent } from './pages/settings/settings-department/settings-department.component';
import { SettingsDesignationComponent } from './pages/settings/settings-designation/settings-designation.component';
import { SettingsDocumentTypeComponent } from './pages/settings/settings-document-type/settings-document-type.component';
import { SettingsGradesComponent } from './pages/settings/settings-grades/settings-grades.component';
import { SettingsHolidayComponent } from './pages/settings/settings-holiday/settings-holiday.component';
import { SettingsLocationComponent } from './pages/settings/settings-location/settings-location.component';
import { SettingsProductLineComponent } from './pages/settings/settings-product-line/settings-product-line.component';
import { SettingsRegionComponent } from './pages/settings/settings-region/settings-region.component';
import { SettingsTeamComponent } from './pages/settings/settings-team/settings-team.component';
import { SettingsTicketComponent } from './pages/settings/settings-ticket/settings-ticket.component';
import { SettingsTicketFaqComponent } from './pages/settings/settings-ticket-faq/settings-ticket-faq.component';
import { SettingsUploadComponent } from './pages/settings/settings-upload/settings-upload.component';
import { SystemErrorComponent } from './pages/system/system-error/system-error.component';
import { TaskDetailsComponent } from './pages/tasks/task-details/task-details.component';
import { TaskListComponent } from './pages/tasks/task-list/task-list.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { TicketDetailsComponent } from './pages/ticket/ticket-details/ticket-details.component';
import { TicketListComponent } from './pages/ticket/ticket-list/ticket-list.component';
import { TrainingComponent } from './pages/training/training.component';
import { TrainingListComponent } from './pages/training/training-list/training-list.component';
import { UnauthorizedComponent } from './pages/system/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [IsLoggedInGuard] },
  {
    path: 'settings', component: SettingsComponent, canActivate: [IsLoggedInGuard], data: { roles: ['Admin'] },
    children: [
      { path: 'announcement-types', component: SettingsAnnouncementTypeComponent, canActivate: [IsLoggedInGuard] },
      { path: 'company', component: SettingsCompanyComponent, canActivate: [IsLoggedInGuard] },
      { path: 'departments', component: SettingsDepartmentComponent, canActivate: [IsLoggedInGuard] },
      { path: 'designations', component: SettingsDesignationComponent, canActivate: [IsLoggedInGuard] },
      { path: 'locations', component: SettingsLocationComponent, canActivate: [IsLoggedInGuard] },
      { path: 'tickets', component: SettingsTicketComponent, canActivate: [IsLoggedInGuard] },
      { path: 'grades', component: SettingsGradesComponent, canActivate: [IsLoggedInGuard] },
      { path: 'product-lines', component: SettingsProductLineComponent, canActivate: [IsLoggedInGuard] },
      { path: 'ticket-faq', component: SettingsTicketFaqComponent, canActivate: [IsLoggedInGuard] },
      { path: 'categories', component: SettingsCategoryComponent, canActivate: [IsLoggedInGuard] },
      { path: 'teams', component: SettingsTeamComponent, canActivate: [IsLoggedInGuard] },
      { path: 'document-types', component: SettingsDocumentTypeComponent, canActivate: [IsLoggedInGuard] },
      { path: 'regions', component: SettingsRegionComponent, canActivate: [IsLoggedInGuard] },
      { path: 'calendar', component: SettingsHolidayComponent, canActivate: [IsLoggedInGuard] },
      { path: 'asset', component: SettingsAssetsComponent, canActivate: [IsLoggedInGuard] },
      { path: 'data', component: SettingsUploadComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', redirectTo: 'announcement-types' },
    ]
  },
  {
    path: 'tasks', component: TasksComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Employee'] },
    children: [
      { path: 'list', component: TaskListComponent, canActivate: [IsLoggedInGuard] },
      { path: ':id', component: TaskDetailsComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: TaskListComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  {
    path: 'projects', component: ProjectsComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Employee'] },
    children: [
      { path: 'list', component: ProjectsListComponent, canActivate: [IsLoggedInGuard] },
      // { path: ':id', component: TaskDetailsComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: ProjectsListComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  {
    path: 'reports', component: ReportsComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Employee'] },
    children: [
      { path: 'list', component: ReportsListComponent, canActivate: [IsLoggedInGuard] },
      // { path: ':id', component: TaskDetailsComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: ReportsListComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  {
    path: 'tickets', component: TicketComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Employee'] },
    children: [
      {
        path: 'list', component: TicketListComponent, canActivate: [IsLoggedInGuard]
      },
      { path: ':id', component: TicketDetailsComponent, canActivate: [IsLoggedInGuard] },

      { path: '**', component: TicketListComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  {
    path: 'appraisals', component: AppraisalComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'questions', component: AppraisalQuestionsComponent, canActivate: [IsLoggedInGuard] },
      { path: 'list', component: AppraisalListComponent, canActivate: [IsLoggedInGuard] },
      { path: ':id', component: AppraisalDetailsComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: AppraisalListComponent, canActivate: [IsLoggedInGuard] },
    ]
  },
  {
    path: 'announcement', component: AnnouncementComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'list', component: AnnouncementListComponent, canActivate: [IsLoggedInGuard] },
      { path: ':id', component: AnnouncementDetailsComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: AnnouncementListComponent, canActivate: [IsLoggedInGuard] },
    ]
  },
  {
    path: 'trainings', component: TrainingComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR'] },
    children: [
      { path: 'list', component: TrainingListComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: TrainingListComponent, canActivate: [IsLoggedInGuard] },
    ]
  },
  {
    path: 'my-profile', component: EmployeeComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Employee'] },
    children: [
      {
        path: '', component: EmployeeDetailsComponent, canActivate: [IsLoggedInGuard], data: { profile: true },
        children: [
          { path: 'account', component: EmployeeAccountComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'personal', component: EmployeePersonalComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'company', component: EmployeeCompanyComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'statutory', component: EmployeeStatutoryComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'contact', component: EmployeeContactComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'bank', component: EmployeeBankComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'education', component: EmployeeEducationComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'family', component: EmployeeFamilyComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'language', component: EmployeeLanguageComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'previous', component: EmployeePreviousCompanyComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'reference', component: EmployeeReferenceComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'documents', component: EmployeeDocumentComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'appraisal', component: EmployeeAppraisalComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'recognition', component: EmployeeRecognitionComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'exit', component: EmployeeExitComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'tasks', component: EmployeeTasksComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'tickets', component: EmployeeTicketComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'hierarchy', component: EmployeeHierarchyComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'asset', component: EmployeeAssetsComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'reportees', component: EmployeeReporteesComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'signing', component: EmployeeAssetSigningComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'compensation', component: EmployeeCompensationComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'trainings', component: EmployeeTrainingComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: 'career', component: EmployeeCareerGrowthComponent, canActivate: [IsLoggedInGuard], data: { reportees: false } },
          { path: '**', redirectTo: 'account' },
        ]
      }],
  },
  {
    path: 'employees', component: EmployeeComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'list', component: EmployeeListComponent, canActivate: [IsLoggedInGuard] },
      {
        path: ':id', component: EmployeeDetailsComponent, canActivate: [IsLoggedInGuard],
        children: [
          { path: 'account', component: EmployeeAccountComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'personal', component: EmployeePersonalComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'company', component: EmployeeCompanyComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'statutory', component: EmployeeStatutoryComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'contact', component: EmployeeContactComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'bank', component: EmployeeBankComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'education', component: EmployeeEducationComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'family', component: EmployeeFamilyComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'language', component: EmployeeLanguageComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'previous', component: EmployeePreviousCompanyComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'reference', component: EmployeeReferenceComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'documents', component: EmployeeDocumentComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'appraisal', component: EmployeeAppraisalComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'recognition', component: EmployeeRecognitionComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'exit', component: EmployeeExitComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'tasks', component: EmployeeTasksComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'tickets', component: EmployeeTicketComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'hierarchy', component: EmployeeHierarchyComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'asset', component: EmployeeAssetsComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'reportees', component: EmployeeReporteesComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'signing', component: EmployeeAssetSigningComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'compensation', component: EmployeeCompensationComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'trainings', component: EmployeeTrainingComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: 'career', component: EmployeeCareerGrowthComponent, canActivate: [IsLoggedInGuard], data: { reportees: true } },
          { path: '**', redirectTo: 'account' },
        ]
      },
      { path: '**', component: EmployeeListComponent, canActivate: [IsLoggedInGuard] },
    ]
  },
  {
    path: 'audit', component: AuditComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'list', component: AuditListComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: AuditListComponent, canActivate: [IsLoggedInGuard] },
    ]
  },
  {
    path: 'exit', component: MainExitComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'list', component: ExitComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: ExitComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  {
    path: 'roles', component: RolesComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'list', component: RolesDetailComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: RolesDetailComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  {
    path: 'mood-meter', component: MainMoodMeterComponent, canActivate: [IsLoggedInGuard], data: { roles: ['HR', 'Admin'] },
    children: [
      { path: 'detail', component: MoodMeterDetailComponent, canActivate: [IsLoggedInGuard] },
      { path: '**', component: MoodMeterDetailComponent, canActivate: [IsLoggedInGuard] }
    ]
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'error', component: SystemErrorComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
