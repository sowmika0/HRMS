import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';

import { AuthService } from '../auth.service';
import { ForgotPasswordRequest, ForgotPasswordResponse } from './../auth.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isProcessing = false;
  isEmailSent = false;
  logoUrl = '';
  forgotPasswordRequest: ForgotPasswordRequest = new ForgotPasswordRequest();

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,

    private appService: AppService
  ) { }

  ngOnInit() {
    this.localStorageService.clearAllLocalStorageItems();
    this.logoUrl = this.appService.getLogoPath().alternate;
  }

  onForgotPasswordClick() {
    this.isProcessing = true;
    this.isEmailSent = false;
    this.authService.forgotPassword(this.forgotPasswordRequest)
      .then((response: ForgotPasswordResponse) => {
        if (response.isSuccess) {
          this.isEmailSent = true;
        }
      })
      .finally(() => this.isProcessing = false);
  }

}
