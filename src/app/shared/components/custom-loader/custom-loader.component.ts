import { Component, OnInit } from '@angular/core';

import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.scss']
})
export class CustomLoaderComponent implements OnInit {

  isLoading = [];

  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.showLoading();
  }

  showLoading() {
    this.subjectService.toggleLoadingSubject.subscribe((isLoading: boolean) => {
      if (isLoading) {
        this.isLoading.push(isLoading);
      } else {
        this.isLoading.pop();
      }
    });
  }

}
