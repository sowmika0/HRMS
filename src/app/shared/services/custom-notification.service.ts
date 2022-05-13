import { Injectable } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';

import { CustomNotificationComponent } from './../components/custom-notification/custom-notification.component';

@Injectable()
export class CustomNotificationService {
    options: GlobalConfig;

    constructor(
        public toastr: ToastrService
    ) {
        this.options = this.toastr.toastrConfig;
    }

    showNotification(
        type: string,
        title: string,
        message: string,
        notificationTime: Date,
        showUndoButton: boolean,
        undoCallback: any,
        callbackParameters: any
    ) {
        const notification = this.toastr.show('', '', {
            toastComponent: CustomNotificationComponent,
            positionClass: 'toast-top-right',
            toastClass: 'notification-' + type
        });

        if (notification && notification.toastRef && notification.toastRef.componentInstance) {
            notification.toastRef.componentInstance.title = title;
            notification.toastRef.componentInstance.message = message;
            notification.toastRef.componentInstance.notificationTime = notificationTime;
            notification.toastRef.componentInstance.showUndoButton = showUndoButton;
            notification.toastRef.componentInstance.undoCallback = undoCallback;
            notification.toastRef.componentInstance.callbackParameters = callbackParameters;
        }
    }
}
