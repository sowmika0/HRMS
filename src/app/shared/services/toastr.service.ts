import { Injectable } from '@angular/core';
import { ToastrConfig, ToastrService } from 'ngx-toastr';

@Injectable()
export class CustomToastrService {
    config: ToastrConfig;
    constructor(
        private toastrService: ToastrService
    ) {
    }

    showDefaultToastr(
        type: string,
        title: string,
        message: string
    ) {
        this.config = Object.assign(this.toastrService.toastrConfig,
            {
                timeOut: 4000,
                closeButton: true,
                extendedTimeOut: 1000,
                positionClass: 'toast-top-center',
                toastClass: 'ngx-toastr',
                titleClass: 'toast-title',
                messageClass: 'toast-message',
                iconClasses: {
                    error: 'toast-error',
                    info: 'toast-info',
                    success: 'toast-success',
                    warning: 'toast-warning'
                }
            });
        return this.showToastr(type, message, title);
    }

    showKsToastr(
        type: string,
        title: string,
        message: string
    ) {
        this.config = Object.assign(this.toastrService.toastrConfig,
            {
                timeOut: 4000,
                closeButton: true,
                extendedTimeOut: 1000,
                positionClass: 'toast-top-center',
                toastClass: 'ks-toast',
                titleClass: 'ks-toast-title',
                messageClass: 'ks-toast-message',
                iconClasses: {
                    error: 'ks-toast-error',
                    info: 'ks-toast-info',
                    success: 'ks-toast-success',
                    warning: 'ks-toast-warning'
                }
            });
        return this.showToastr(type, message, title);
    }

    showCustomKsToastr(
        type: string,
        title: string,
        message: string
    ) {
        this.config = Object.assign(this.toastrService.toastrConfig,
            {
                timeOut: 4000,
                closeButton: true,
                extendedTimeOut: 1000,
                positionClass: 'toast-top-center',
                toastClass: 'ks-toast-with-icon',
                titleClass: 'ks-toast-title',
                messageClass: 'ks-toast-message',
                iconClasses: {
                    error: 'ks-toast-error',
                    info: 'ks-toast-info',
                    success: 'ks-toast-success',
                    warning: 'ks-toast-warning'
                }
            });
        return this.showToastr(type, message, title);
    }

    private showToastr(type: string, message: string, title: string) {
        switch (type) {
            case 'success':
                return this.toastrService.success(
                    message,
                    title,
                    this.config);
            case 'error':
                return this.toastrService.error(
                    message,
                    title,
                    this.config);
            case 'info':
                return this.toastrService.info(
                    message,
                    title,
                    this.config);
            case 'warning':
                return this.toastrService.warning(
                    message,
                    title,
                    this.config);
        }
    }
}
