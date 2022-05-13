import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsDropdownConfig } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, RegEx } from 'src/app/app.constants';
import {
  AppNotification,
  BaseResponse,
  MarkNotificationReadRequest,
  NotificationConstant,
  NotificationListResponse,
  UserStorageInformation,
} from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';

import { CustomModalComponent } from '../../components/custom-modal/custom-modal.component';
import { DatePickerOptions } from './../../../app.constants';
import { EmployeeService } from './../../../pages/employee/employee.service';
import { CustomOffcanvasComponent } from './../../components/custom-offcanvas/custom-offcanvas.component';
import { MenuItem, PasswordChangeRequest, PasswordChangeResponse } from './menu-bar.model';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class MenuBarComponent implements OnInit {

  @ViewChild('passwordChange', { static: false }) passwordChange: CustomModalComponent;
  @ViewChild('notificationOffcanvas', { static: false }) notificationOffcanvas: CustomOffcanvasComponent;

  logo: string;
  userInfo: UserStorageInformation;
  logoUrl = '';

  regex = RegEx;
  photoUrl = '';
  isProcessing = false;
  ifLoggedInUser = false;
  unReadNotifications = 0;
  activeRoute: string = '';
  menuItems: MenuItem[] = [];
  allModules = AppSettings.allModules;
  notifications: AppNotification[] = [];
  imageUrl = 'assets/avatar/default.svg';
  passwordInfo: PasswordChangeRequest = new PasswordChangeRequest();

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private employeeService: EmployeeService,
    private appService: AppService
  ) {
  }

  ngOnInit() {
    this.getUserDetails();
    this.logoUrl = this.appService.getLogoPath().small;
  }

  getUserDetails() {
    this.userInfo = this.localStorageService.getLoggedInUserInfo();
    if (!this.userInfo || !this.userInfo.token) {
      this.router.navigate(['/login'], { queryParams: { redirectTo: this.router.url } });
    }

    this.photoUrl = this.userInfo.photoUrl && this.userInfo.photoUrl !== ''
      ? this.appService.fileBaseUrl.replace('hrms/', '') + this.userInfo.photoUrl
      : null;

    if (!this.userInfo.allowedModules || this.userInfo.allowedModules.length === 0) {
      this.menuItems = this.allModules;
      this.menuItems = this.allModules.filter(m =>
        this.userInfo.role === 'Admin'
          ? m.showAdmin
          : this.userInfo.role === 'HR'
            ? m.showHr
            : this.userInfo.role === 'Employee'
              ? m.showEmployee
              : false);
    } else {
      this.menuItems = this.allModules.filter(m => this.userInfo.allowedModules.find(a => a === m.title));
    }

    if (this.menuItems.length === 0) {
      this.router.navigate(['/login']);
    }

    this.getRecentNotifications();
  }

  routeToFeature(feature: string) {
    this.activeRoute = feature;
    this.router.navigate(['./' + feature], {
    });
  }

  logout() {
    setTimeout(() => {
      this.localStorageService.clearAllLocalStorageItems();
      this.router.navigate(['/login']);
    }, 200);
    // this.authService.logout()
    //   .then((response: BaseResponse) => {
    //   })
    //   .finally(() => {
    //   })
  }

  private replaceNotificationContent(template: NotificationConstant, dataObject: any) {
    for (let [key, value] of Object.entries(dataObject)) {
      if (key.toLowerCase().indexOf('id') < 0) {
        value = value ? '<span class="highlight text-sm">' + value + '</span>' : '';
      }
      template.text = template.text.replace(`{${key}}`, value.toString());
      template.route = template.route.replace(`{${key}}`, value.toString());
    }

    return template;
  }

  getRecentNotifications() {
    this.employeeService.getRecentNotifications()
      .then((response: NotificationListResponse) => {
        if (response.isSuccess) {
          this.notifications = response.notifications;
          this.notifications.map(n => {
            const data = n.data ? JSON.parse(n.data) : {};
            n.receivedOnText = moment.utc(n.receivedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);

            let template = AppSettings.notificationType.find(temp => temp.id === n.actionId);
            if (template) {
              template = this.replaceNotificationContent(template, data);
              n.text = template.text;
              n.route = template.route;
              n.icon = template.icon;
            }
          });
          this.unReadNotifications = response.unReadNotifications;
        }
      })
  }

  showNotifications() {
    this.getRecentNotifications();
    const payload: MarkNotificationReadRequest = {
      notifications: this.notifications.filter(n => !n.isRead)
    };
    this.employeeService.markNotificationsAsRead(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.unReadNotifications = 0;
        }
      })
    this.notificationOffcanvas.showCanvas();
  }

  showUserAccount() {

  }

  showPasswordChange() {
    this.passwordChange.showModal();
  }

  updatePassword() {
    this.isProcessing = true;
    this.employeeService.changePassword(this.passwordInfo)
      .then((response: PasswordChangeResponse) => {
        if (response.isSuccess) {
          if (response.isPasswordChanged) {
            this.toastrService.success('New password updated successfully.');
            this.passwordChange.hideModal();
          } else {
            this.toastrService.error('The current password you entered does not match. Please check the password and change it again.');
          }
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  routeNotification(item: AppNotification) {
    this.notificationOffcanvas.hideCanvas();
    if (item.route) {
      this.router.navigate(['/' + item.route]);
    }
  }
}
