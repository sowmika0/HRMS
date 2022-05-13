import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStorageInformation } from '../app.model';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  isErrorDisplayed = false;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private localStorageService: LocalStorageService
  ) { }

  private handleForbiddenError = () => {
    // this.toastrService.error(
    //   'Oops. You are not allowed to navigate to that page5.'
    // );
    this.toastrService.info(
      'Your request is being processed by the server. Please wait until it is finished.'
    );
  }

  private handleNoServerError = () => {
    // this.toastrService.error(
    //   'Oops. We think there is a problem in connecting with the server. Please contact the administrator to reolve this issue.'
    // );
    this.toastrService.info(
      'Your request is being processed by the server. Please wait until it is finished.'
    );
  }

  private handleAuthError = () => {
    this.localStorageService.clearAllLocalStorageItems();
    this.router.navigate(['/login'], { queryParams: { redirectTo: this.router.url } })
    // this.toastrService.error(
    //   'Oops. You need to login again to access the application4.'
    // );
    this.toastrService.info(
      'Your request is being processed by the server. Please wait until it is finished.'
    );
  }

  private handleServerError = (errorCode: string) => {
    // this.toastrService.error(
    //   'Something fried our servers. Guess it should be sorted out in sometime. Please try refreshing the page. Use the code - ' + errorCode + ' to report the issue.'
    // );
    this.toastrService.info(
      'Your request is being processed by the server. Please wait until it is finished.'
    );
  }

  private handleCustomServerError = (errorCode: string) => {
    // this.toastrService.error(
    //   'Something fried our servers. Guess it should be sorted out in sometime. Please use this code when contacting the admin to resolve the issue faster - ' + errorCode + 'Please try refreshing the page.'
    // );
    this.toastrService.info(
      'Your request is being processed by the server. Please wait until it is finished.'
    );
  }

  private handleTimeoutError = () => {
    // this.toastrService.error(
    //   'Something fried our servers. Guess it should be sorted out in sometime. Please try refreshing the page3'
    // );
    this.toastrService.info(
      'Your request is being processed by the server. Please wait until it is finished.'
    );
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const userInfo: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    if (userInfo !== undefined) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userInfo.token}`,
          'Access-Control-Allow-Origin': '*',
          api_token: userInfo.nodeToken
        }
      });
    }

    return next
      .handle(request)
      .pipe(
        tap(
          response => {
            status = '';
            if (response instanceof HttpResponse) {
              if (!response.body.isSuccess) {
                this.errorHandler(this.handleCustomServerError(response.body.systemErrorMessage));
              }
            }
          },
          error => (status = 'failed')
        )
      )
      .pipe(
        // retry(1),
        catchError((error: any) => {
          switch (error.status) {
            case 401:
              this.errorHandler(this.handleAuthError);
              break;
            case 403:
              this.errorHandler(this.handleForbiddenError);
              break;
            case 404:
              this.errorHandler(this.handleNoServerError);
              break;
            case 500:
              this.errorHandler(this.handleServerError);
              break;
            case 504:
              this.errorHandler(this.handleTimeoutError);
              break;
            case 0:
              this.errorHandler(this.handleNoServerError);
              break;
            default:
              this.errorHandler(this.handleServerError);
              break;
          }

          throw '';
        })
      );
  }

  errorHandler(handlerCallback: any) {
    if (!this.isErrorDisplayed) {
      handlerCallback();
      this.isErrorDisplayed = true;
      setTimeout(() => {
        this.isErrorDisplayed = false;
      }, 5000);
    }
  }


}
