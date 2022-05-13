import { AnnouncementModule } from './pages/announcement/announcement.module';
import { ApiInterceptor } from './guards/interceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from './app.service';
import { AppraisalModule } from './pages/appraisal/appraisal.module';
import { AuditModule } from './pages/audit/audit.module';
import { AuthModule } from './pages/auth/auth.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { DatePipe } from '@angular/common';
import { EmployeeModule } from './pages/employee/employee.module';
import { ExitModule } from './pages/exit/exit.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MoodMeterModule } from './pages/mood-meter/mood-meter.module';
import { NgModule } from '@angular/core';
import { ProjectsModule } from './pages/projects/projects.module';
import { ReportsModule } from './pages/reports/reports.module';
import { RolesModule } from './pages/roles/roles.module';
import { SettingsModule } from './pages/settings/settings.module';
import { SharedModule } from './shared/shared.module';
import { SystemModule } from './pages/system/system.module';
import { TaskModule } from './pages/tasks/task.module';
import { TicketModule } from './pages/ticket/ticket.module';
import { TrainingModule } from './pages/training/training.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,

    SharedModule,

    DashboardModule,
    SettingsModule,
    AnnouncementModule,
    AppraisalModule,
    AuthModule,
    EmployeeModule,
    SystemModule,
    TicketModule,
    TaskModule,
    TrainingModule,
    AuditModule,
    ProjectsModule,
    ReportsModule,
    ExitModule,
    RolesModule,
    MoodMeterModule
  ],
  providers: [
    DatePipe,
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
