import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-coming-soon',
  templateUrl: './custom-coming-soon.component.html',
  styleUrls: ['./custom-coming-soon.component.scss']
})
export class CustomComingSoonComponent implements OnInit {

  @Input('moduleName') moduleName = '';

  constructor() { }

  ngOnInit() {
  }

}
