import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppraisalDetailsComponent } from './appraisal-details/appraisal-details.component';
import { AppraisalListComponent } from './appraisal-list/appraisal-list.component';
import { AppraisalComponent } from './appraisal.component';
import { AppraisalService } from './appraisal.service';
import { AppraisalQuestionsComponent } from './appraisal-questions/appraisal-questions.component';

import { EmployeeAppraisalComponent } from '../../pages/employee/employee-details/employee-appraisal/employee-appraisal.component';
import { EmployeeAppraisalInfoComponent } from '../../pages/employee/employee-details/employee-appraisal/employee-appraisal-info/employee-appraisal-info.component';

@NgModule({
  declarations: [AppraisalComponent, 
    AppraisalListComponent, 
    AppraisalDetailsComponent, 
    AppraisalQuestionsComponent,
    EmployeeAppraisalComponent, 
    EmployeeAppraisalInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    AppraisalService
  ]
})
export class AppraisalModule { }
