import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
import { AppService } from 'src/app/app.service';

import { ScrollTopService } from './shared/services/scroll-top.servics';
import { SubjectService } from './shared/services/subject.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  logo = '';

  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private scrollToTopService: ScrollTopService,

    private appService: AppService
  ) {
    setTheme('bs4');

    this.appService.setUrl();
  }

  ngOnInit() {
    this.subjectService.scrollToTopSubject.subscribe(() => {
      this.scrollToTopService.scrollToTop();
    })

    this.logo = this.appService.getLogoPath().full;
  }
}
