import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { SystemErrorComponent } from './system-error/system-error.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [NotFoundComponent, SystemErrorComponent, UnauthorizedComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
  ]
})
export class SystemModule { }
