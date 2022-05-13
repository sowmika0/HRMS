import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SettingsAnnouncementTypeComponent } from './settings-announcement-type/settings-announcement-type.component';
import { SettingsCategoryComponent } from './settings-category/settings-category.component';
import { SettingsCompanyComponent } from './settings-company/settings-company.component';
import { SettingsDepartmentComponent } from './settings-department/settings-department.component';
import { SettingsDocumentTypeComponent } from './settings-document-type/settings-document-type.component';
import { SettingsGradesComponent } from './settings-grades/settings-grades.component';
import { SettingsHolidayComponent } from './settings-holiday/settings-holiday.component';
import { SettingsLocationComponent } from './settings-location/settings-location.component';
import { SettingsProductLineComponent } from './settings-product-line/settings-product-line.component';
import { SettingsRegionComponent } from './settings-region/settings-region.component';
import { SettingsTeamComponent } from './settings-team/settings-team.component';
import { SettingsTicketFaqComponent } from './settings-ticket-faq/settings-ticket-faq.component';
import { SettingsTicketComponent } from './settings-ticket/settings-ticket.component';
import { SettingsComponent } from './settings.component';
import { SettingsService } from './settings.service';
import { SettingsDesignationComponent } from './settings-designation/settings-designation.component';
import { SettingsAssetsComponent } from './settings-assets/settings-assets.component';
import { SettingsUploadComponent } from './settings-upload/settings-upload.component';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsCompanyComponent,
    SettingsDepartmentComponent,
    SettingsLocationComponent,
    SettingsTicketComponent,
    SettingsGradesComponent,
    SettingsProductLineComponent,
    SettingsTicketFaqComponent,
    SettingsCategoryComponent,
    SettingsTeamComponent,
    SettingsDocumentTypeComponent,
    SettingsAnnouncementTypeComponent,
    SettingsRegionComponent,
    SettingsHolidayComponent,
    SettingsDesignationComponent,
    SettingsAssetsComponent,
    SettingsUploadComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    SettingsService
  ]
})
export class SettingsModule { }
