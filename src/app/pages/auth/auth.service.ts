import { ForgotPasswordRequest, LoginRequest } from './auth.model';

import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from 'src/app/shared/services/http-service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService: HttpService
  ) { }

  login(payload: LoginRequest) {
    return this.httpService.postMethod(AppApiEndpoints.authRoute.login, payload, true);
  }

  forgotPassword(payload: ForgotPasswordRequest) {
    return this.httpService.postMethod(AppApiEndpoints.authRoute.forgotPassword, payload, true);
  }

  logout() {
    return this.httpService.postMethod(AppApiEndpoints.authRoute.logout, null);
  }

  loginOtp(payload: LoginRequest) {
    return this.httpService.postMethod(AppApiEndpoints.authRoute.loginOtp, payload, true);
  }

  loginToServer(payload: any) {
    let apiEndPoint = AppApiEndpoints.authRoute.loginToNodeServer;
    apiEndPoint = apiEndPoint.replace('NEWAPI', '/');
    apiEndPoint = environment.nodeApiBaseUrl + apiEndPoint;
    return postData(apiEndPoint, payload);
  }
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}
