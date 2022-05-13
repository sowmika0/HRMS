import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TasksComponent } from './tasks.component';
import { TasksService } from './tasks.service';


@NgModule({
  declarations: [TasksComponent, TaskListComponent, TaskDetailsComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [TasksService]
})
export class TaskModule { }
