import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { AnnouncementComponent } from './announcement.component';
import { AnnouncementService } from './announcement.service';
import { AnnouncementViewComponent } from './announcement-view/announcement-view.component';

@NgModule({
  declarations: [AnnouncementComponent, AnnouncementListComponent, AnnouncementDetailsComponent, AnnouncementViewComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    AnnouncementService
  ]
})
export class AnnouncementModule { }
