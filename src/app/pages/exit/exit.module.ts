import { CommonModule } from '@angular/common';
import { ExitComponent } from './exit.component';
import { EmployeeService } from 'src/app/pages/employee/employee.service';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainExitComponent } from './main-exit.component';

@NgModule({
  declarations: [
    MainExitComponent,
    ExitComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    EmployeeService
  ]
})
export class ExitModule { }
