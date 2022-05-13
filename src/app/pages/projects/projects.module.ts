import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { NgxTimerModule } from 'ngx-timer';
import { ColorGithubModule } from 'ngx-color/github';

import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './projects.service';


@NgModule({
  declarations: [ProjectsComponent, ProjectsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxTimerModule,
    ColorGithubModule
  ],
  providers: [ProjectsService]
})
export class ProjectsModule { }
