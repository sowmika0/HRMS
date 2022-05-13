import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { EmployeeCreateComponent } from '../pages/employee/employee-details/employee-create/employee-create.component';
import { EmployeeFeedbackComponent } from '../pages/employee/employee-details/employee-exit-forms/employee-feedback/employee-feedback.component';
import { EmployeeResignComponent } from '../pages/employee/employee-details/employee-exit-forms/employee-resign/employee-resign.component';
import { HodFeedbackComponent } from '../pages/employee/employee-details/employee-exit-forms/hod-feedback/hod-feedback.component';
import { HrFeedbackComponent } from '../pages/employee/employee-details/employee-exit-forms/hr-feedback/hr-feedback.component';
import { LayoutModule } from './layout/layout.module';
import { NgModule } from '@angular/core';
import { PipesModule } from './pipes/pipes.module';
import { PluginsModule } from './plugins/plugins.module';
import { ServicesModule } from './services/services.module';

@NgModule({
  declarations: [
    EmployeeFeedbackComponent,
    HrFeedbackComponent,
    HodFeedbackComponent,
    EmployeeCreateComponent,
    EmployeeResignComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    PluginsModule,
    ComponentsModule,
    ServicesModule,
    DirectivesModule,
    PipesModule
  ],
  exports: [
    LayoutModule,
    PluginsModule,
    ComponentsModule,
    ServicesModule,
    DirectivesModule,
    EmployeeFeedbackComponent,
    HrFeedbackComponent,
    HodFeedbackComponent,
    EmployeeResignComponent,
    EmployeeCreateComponent,
    PipesModule
  ]
})
export class SharedModule { }
