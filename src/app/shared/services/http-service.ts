import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { UploadFile, UserStorageInformation } from '../../app.model';
import { LocalStorageService } from './local-storage-service';
import { MiscService } from './misc.service';
import { ObjectToUrlService } from './obj-to-url-service';

@Injectable()
export class HttpService {

    baseUrl = '';
    newBaseUrl = '';

    constructor(
        private httpClient: HttpClient,
        // private http: Http
        private router: Router,
        private toastrService: ToastrService,
        private localStorageService: LocalStorageService,
        private objectToUrl: ObjectToUrlService,
        private miscService: MiscService,
        private appService: AppService,
        private subjectService: SubjectService,
    ) {
        this.baseUrl = this.appService.apiBaseUrl;
        this.newBaseUrl = this.appService.newApiBaseUrl;
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }

    getMethod(apiEndpoint: string, paramsObject?: any, anonymous?: boolean, isParamsString?: boolean) {
        let endPoint = '';
        let parameters = '';
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Cache-Control', 'no-cache');
        if (apiEndpoint.includes('NEWAPI')) {
            apiEndpoint = apiEndpoint.replace('NEWAPI', this.newBaseUrl);
            // apiEndpoint = 'http://localhost:4200' + apiEndpoint;
            // return fetch(apiEndpoint)
            //     .then(response => response.json())
            //     .then(data => data)
            //     .catch(() => {
            //         return {
            //             isSuccess: false
            //         };
            //     });
        } else {
            apiEndpoint = apiEndpoint.replace('**********', this.baseUrl);
        }
        console.log('apiEndpoint', apiEndpoint)
        if (paramsObject !== null) {
            if (!isParamsString) {
                parameters = this.objectToUrl.buildParametersFromSearch(paramsObject);
            } else {
                parameters = paramsObject;
            }
            endPoint = apiEndpoint + '?';
        } else {
            endPoint = apiEndpoint;
        }
        endPoint = endPoint + parameters;

        return this.httpClient
            .get(endPoint, {
                headers: headers
            })
            .pipe(
                map(res => {
                    return res;
                })
            )
            .toPromise()
            .catch(() => {
                return {
                    isSuccess: false
                };
            });
    }

    postMethod(apiEndPoint: string, payload: any, anonymous?: boolean) {
        console.log('in post method', apiEndPoint)
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if (apiEndPoint.includes('NEWAPI')) {
            apiEndPoint = apiEndPoint.replace('NEWAPI', this.newBaseUrl);
            // apiEndPoint = '' + apiEndPoint;
            // console.log('returning here..', apiEndPoint, headers);
            // return fetch(apiEndPoint)
            //     .then(response => response.json())
            //     .then(data => data)
            //     .catch(() => {
            //         return {
            //             isSuccess: false
            //         };
            //     });
        } else {
            apiEndPoint = apiEndPoint.replace('**********', this.baseUrl);
        }
        payload = this.miscService.removeSpaces(payload);

        return this.httpClient
            .post(apiEndPoint, payload, {
                headers: headers
            })
            .pipe(
                map(res => {
                    return res;
                })
            )
            .toPromise()
            .catch(() => {
                return {
                    isSuccess: false
                };
            });
    }

    postMethodWithFile(apiEndPoint: string, payload: any, files?: UploadFile[]) {
        let headers: HttpHeaders = new HttpHeaders();
        const userInfo: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
        apiEndPoint = apiEndPoint.replace('**********', this.baseUrl);

        // headers = headers.append('Accept', 'multipart/form-data');
        // headers = headers.append('Content-Type', 'multipart/form-data');

        const formData = new FormData();

        if (files !== undefined && files !== null && files.length > 0) {
            let i = 0;
            files.map(file => {
                formData.append(file.name, file.file, file.file.name);
                if (file.type) {
                    formData.append('attachmentType[' + i + ']', file.type);
                    i++;
                }
            });
        }
        this.objectToUrl.objectToFormData(payload, formData);
        return this.httpClient
            .post(apiEndPoint, formData, {
                headers: headers,
                reportProgress: true,
                observe: 'events'
            })
            .pipe(map((event) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round(100 * event.loaded / event.total);
                        this.subjectService.sendUploadingStatus(progress);
                        return { status: 'progress', message: progress };

                    case HttpEventType.Response:
                        return event.body;
                    default:
                        return `Unhandled event: ${event.type}`;
                }
            }))
            .pipe(
                map(res => {
                    return res;
                })
            )
            .toPromise();
    }

}
