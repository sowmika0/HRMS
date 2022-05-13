import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AuditListComponent } from './audit-list/audit-list.component';
import { AuditComponent } from './audit.component';



@NgModule({
  declarations: [AuditListComponent, AuditComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuditModule { }
