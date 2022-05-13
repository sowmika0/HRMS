import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorMessages, RegEx } from 'src/app/app.constants';
import { LoginRequest, LoginResponse } from '../auth.model';
import { NodeLoginRequest, NodeLoginResponse, TokenResponse, UserStorageInformation } from 'src/app/app.model';

import { AppService } from 'src/app/app.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from './../../../shared/services/local-storage-service';
import { tr } from 'date-fns/locale';

//import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isTest = true;
  isProcessing = false;
  isLoginError = false;
  logoUrl = '';
  loginRequest: LoginRequest = new LoginRequest();
  invalidLoginAttempt = 0;
  accountLocked = false;
  isCaptchaError = false;
  isLoginSuccess: boolean = false;
  loginErrorMessage: string = '';

  regex = RegEx;
  errorMessages = ErrorMessages;

 // @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private appService: AppService
  ) { }

  ngOnInit() {
    if (this.localStorageService.getLoggedInUserInfo()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.localStorageService.clearAllLocalStorageItems();
    }
    this.logoUrl = this.appService.getLogoPath().alternate;

    const apiUrl = this.appService.getApiBaseUrl();
    this.isTest = apiUrl.indexOf('test') >= 0;
  }

  // // getCurrentResponse(): void {
  // //   const currentResponse = this.captchaElem.getCurrentResponse();
  // //   if (!currentResponse) {
  // //     this.isCaptchaError = true;
  // //   } else {
  // //     this.isCaptchaError = false;
  // //     this.loginRequest.captchaKey = currentResponse;
  // //   }
  // // }

  // handleError(): void {
  //   this.isCaptchaError = true;
  //   this.loginRequest.captchaKey = '';
  // }

  // handleReset(): void {
  //   this.isCaptchaError = false;
  //   this.loginRequest.captchaKey = '';
  // }

  // handleSuccess(captchaResponse: string): void {
  //   this.isCaptchaError = false;
  //   this.loginRequest.captchaKey = captchaResponse;
  // }

  // handleExpire(): void {
  //   this.isCaptchaError = true;
  //   this.loginRequest.captchaKey = '';
  // }

  onLoginClick() {
  //  // this.getCurrentResponse();
  //   if(this.isCaptchaError) {
  //     return;
  //   }

    this.isProcessing = true;
    this.isLoginError = false;
    this.isLoginSuccess = false;
    if(this.invalidLoginAttempt >= 3) {
      this.loginRequest = {...this.loginRequest, maxInvalidAttempted: true}
      this.accountLocked = true;
    }
    this.authService.loginOtp(this.loginRequest)
    .then((response: LoginResponse) => {
      console.log(response);
      if (response.isSuccess && response.isLoginSuccess) {
        this.isLoginSuccess = true;
      } else {
        this.isLoginError = true;
        this.loginErrorMessage = this.errorMessages.loginError;
      }
    })
    .finally(() => { this.isProcessing = false; });
  }

  verifyLoginOtp(): void{
    this.isProcessing = true;
    this.isLoginError = false;
    this.authService.login(this.loginRequest)
      .then((response: LoginResponse) => {
        if (response.isSuccess) {
          if (response.isLoginSuccess) {
            this.isLoginSuccess = true;
            this.saveLoginInfoOnLocalStorage(response);
            this.activatedRoute.queryParams.subscribe((params) => {
              if (params && params.redirectTo) {
                this.router.navigate([params.redirectTo]);
              } else {
                this.router.navigate(['/dashboard']);
              }
            });
          } else {
            if(response.isAccountLocked) {
              this.accountLocked = true;
            }
            else if(!this.accountLocked) {
              this.isLoginError = true;
              this.isLoginSuccess = false;
              this.invalidLoginAttempt++;
              this.loginErrorMessage = this.errorMessages.invalidOTP;
            }
          }
        }
      })
      .finally(() => { this.isProcessing = false; })
  }

  saveLoginInfoOnLocalStorage(loginResponse: LoginResponse) {
    const userStorage: UserStorageInformation = {
      department: loginResponse.department,
      designation: loginResponse.designation,
      grade: loginResponse.grade,
      emailId: loginResponse.emailId,
      location: loginResponse.location,
      name: loginResponse.name,
      role: loginResponse.role,
      token: loginResponse.token,
      photoUrl: loginResponse.photoUrl,
      allowedModules: loginResponse.allowedModules,
      code: loginResponse.code,
      employeeId: loginResponse.employeeId,
      locationId: loginResponse.locationId,
      isManager: loginResponse.isManager,
      nodeToken: loginResponse.nodeToken
    };

    this.localStorageService.clearAllLocalStorageItems();
    this.localStorageService.setLoggedInUserInfo(userStorage);
  }

}
