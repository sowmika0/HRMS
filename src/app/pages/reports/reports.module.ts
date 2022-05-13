import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportsComponent } from './reports.component';
import { ReportsService } from './reports.service';
import { ReportsListComponent } from './reports-list/reports-list.component';

@NgModule({
  declarations: [
    ReportsComponent,
    ReportsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    ReportsService
  ]
})
export class ReportsModule { }
