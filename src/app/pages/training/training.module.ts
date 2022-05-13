import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';



@NgModule({
  declarations: [TrainingComponent, TrainingListComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule
  ],
  providers: [
    TrainingService
  ]
})
export class TrainingModule { }
