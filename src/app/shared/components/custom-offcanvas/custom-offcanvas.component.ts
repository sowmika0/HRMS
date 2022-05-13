import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-offcanvas',
  templateUrl: './custom-offcanvas.component.html',
  styleUrls: ['./custom-offcanvas.component.scss']
})
export class CustomOffcanvasComponent implements OnInit {

  @Input('show') show = false;
  @Input('static') static = false;
  @Input('topMargin') topMargin = 60;
  @Input('title') title = 'Offcanvas Title';
  @Input('subTitle') subTitle = 'Offcanvas Sub Title';
  @Input('offcanvasSize') offcanvasSize = 'md'; // xs, sm, md, lg, xl
  @Input('staticBackdrop') staticBackdrop = false;
  @Input('showBackdrop') showBackdrop = true;
  @Input('showShadow') showShadow = true;

  @Output('onClosed') onClosed = new EventEmitter();

  isShow = false;
  showClass = '';
  showContentClass = '';

  constructor(

  ) { }

  ngOnInit() {
    if (this.show) {
      this.isShow = true;
      this.showClass = 'show';
      this.showContentClass = 'show';
    }

    if (this.static) {
      this.staticBackdrop = false;
      this.showBackdrop = false;
    }
  }

  showCanvas() {
    this.isShow = true;
    setTimeout(() => {
      this.showClass = 'show';
      this.showContentClass = 'show';
    }, 100);
  }

  hideCanvas() {
    this.showContentClass = '';
    setTimeout(() => {
      this.isShow = false;
      this.showClass = '';
    }, 500);
  }

}
