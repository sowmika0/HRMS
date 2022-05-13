import { CommonModule } from '@angular/common';
import { EmployeeAccountComponent } from './employee-details/employee-account/employee-account.component';
import { EmployeeAssetSigningComponent } from './employee-details/employee-asset-signing/employee-asset-signing.component';
import { EmployeeAssetsComponent } from './employee-details/employee-assets/employee-assets.component';
import { EmployeeBankComponent } from './employee-details/employee-bank/employee-bank.component';
import { EmployeeCareerGrowthComponent } from './employee-details/employee-career-growth/employee-career-growth.component';
import { EmployeeCareerPathComponent } from './employee-details/employee-career-path/employee-career-path.component';
import { EmployeeCompanyComponent } from './employee-details/employee-company/employee-company.component';
import { EmployeeCompensationComponent } from './employee-details/employee-compensation/employee-compensation.component';
import { EmployeeComponent } from './employee.component';
import { EmployeeContactComponent } from './employee-details/employee-contact/employee-contact.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeDocumentComponent } from './employee-details/employee-document/employee-document.component';
import { EmployeeEducationComponent } from './employee-details/employee-education/employee-education.component';
import { EmployeeExitComponent } from './employee-details/employee-exit/employee-exit.component';
import { EmployeeFamilyComponent } from './employee-details/employee-family/employee-family.component';
import { EmployeeFeedbackComponent } from './employee-details/employee-exit-forms/employee-feedback/employee-feedback.component';
import { EmployeeHierarchyComponent } from './employee-details/employee-hierarchy/employee-hierarchy.component';
import { EmployeeLanguageComponent } from './employee-details/employee-language/employee-language.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeePersonalComponent } from './employee-details/employee-personal/employee-personal.component';
import {
  EmployeePreviousCompanyComponent,
} from './employee-details/employee-previous-company/employee-previous-company.component';
import { EmployeeRecognitionComponent } from './employee-details/employee-recognition/employee-recognition.component';
import { EmployeeReferenceComponent } from './employee-details/employee-reference/employee-reference.component';
import { EmployeeReporteesComponent } from './employee-details/employee-reportees/employee-reportees.component';
import { EmployeeService } from './employee.service';
import { EmployeeStatutoryComponent } from './employee-details/employee-statutory/employee-statutory.component';
import { EmployeeTasksComponent } from './employee-details/employee-tasks/employee-tasks.component';
import { EmployeeTicketComponent } from './employee-details/employee-ticket/employee-ticket.component';
import { EmployeeTrainingComponent } from './employee-details/employee-training/employee-training.component';
import { HodFeedbackComponent } from './employee-details/employee-exit-forms/hod-feedback/hod-feedback.component';
import { HrFeedbackComponent } from './employee-details/employee-exit-forms/hr-feedback/hr-feedback.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

//import { EmployeeAppraisalComponent } from './employee-details/employee-appraisal/employee-appraisal.component';




















//import { EmployeeAppraisalInfoComponent } from './employee-details/employee-appraisal/employee-appraisal-info/employee-appraisal-info.component';











@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeDetailsComponent,
    EmployeePersonalComponent,
    EmployeeCompanyComponent,
    EmployeeBankComponent,
    EmployeeEducationComponent,
    EmployeeCareerPathComponent,
    EmployeeExitComponent,
    EmployeeTicketComponent,
    EmployeeDocumentComponent,
    EmployeePreviousCompanyComponent,
    //EmployeeAppraisalComponent,
    EmployeeAccountComponent,
    EmployeeStatutoryComponent,
    EmployeeFamilyComponent,
    EmployeeLanguageComponent,
    EmployeeReferenceComponent,
    EmployeeRecognitionComponent,
    EmployeeTasksComponent,
    EmployeeContactComponent,
    //EmployeeAppraisalInfoComponent,
    EmployeeHierarchyComponent,
    EmployeeAssetsComponent,
    EmployeeReporteesComponent,
    EmployeeAssetSigningComponent,
    EmployeeCompensationComponent,
    EmployeeTrainingComponent,
    // moved into shared module - below
    // EmployeeFeedbackComponent,
    // HrFeedbackComponent,
    // HodFeedbackComponent,
    EmployeeCareerGrowthComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    EmployeeService
  ]
})
export class EmployeeModule { }
