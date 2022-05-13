import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RolesComponent } from './roles.component';
import { RolesDetailComponent } from './roles-detail/roles-detail.component';
import { RolesService } from './roles.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RolesComponent,
    RolesDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    RolesService
  ]
})
export class RolesModule { }
