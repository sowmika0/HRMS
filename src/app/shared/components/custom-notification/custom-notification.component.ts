import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { GlobalConfig, Toast, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-notification',
  templateUrl: './custom-notification.component.html',
  styleUrls: ['./custom-notification.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate(
          '300ms ease-out',
          keyframes([
            style({
              opacity: 0,
              bottom: '-15px',
              'max-height': 0,
              'max-width': 0,
              'margin-top': 0,
            }),
            style({
              opacity: 0.8,
              bottom: '-3px',
            }),
            style({
              opacity: 1,
              bottom: '0',
              'max-height': '200px',
              'margin-top': '12px',
              'max-width': '400px',
            }),
          ]),
        ),
      ),
      state(
        'active',
        style({
          bottom: '0',
          'max-height': '200px',
          'margin-top': '12px',
          'max-width': '400px',
        }),
      ),
      transition(
        'active => removed',
        animate(
          '300ms ease-out',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateY(0)'
            }),
            style({
              opacity: 0,
              transform: 'translateY(25%)'
            }),
          ]),
        ),
      ),
    ]),
  ],
})
export class CustomNotificationComponent extends Toast {
  options: GlobalConfig;

  title: string;
  message: string;
  undoCallback: any;
  showUndoButton: boolean;
  callbackParameters: any;
  notificationTime: string;

  momentNotificationTime: any;
  humanReadableDate: string;
  timerInterval: any;

  constructor(
    public toastrService: ToastrService,
    public toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
    this.options = this.toastrService.toastrConfig;
  }

  ngOnInit() {
    this.momentNotificationTime = moment(this.notificationTime);
    this.humanReadableDate = moment.duration(moment().diff(this.momentNotificationTime, 'seconds')).humanize();

    this.timerInterval = setInterval(() => {
      this.humanReadableDate = moment.duration(moment().diff(this.momentNotificationTime, 'seconds')).humanize();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  onUndoClick() {
    this.undoCallback(this.callbackParameters);
  }

}
