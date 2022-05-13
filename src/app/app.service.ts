import { ActivatedRoute, Router } from '@angular/router';

import { AppSettings } from 'src/app/app.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from './../environments/environment.prod';

@Injectable()
export class AppService {

    apiBaseUrl = '';
    newApiBaseUrl = '';
    fileBaseUrl = '';
    isTest = false;

    constructor(
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private httpClient: HttpClient,
    ) {
    }

    setUrl() {

        const primaryUrl = environment.primaryUrl;
        const testUrl = environment.testUrl;

        if (window.location.href.indexOf('http://' + primaryUrl) === 0
            || window.location.href.indexOf('https://' + primaryUrl) === 0) {
            this.apiBaseUrl = environment.primaryApiUrl;
            this.fileBaseUrl = environment.primaryFileUrl;
            this.newApiBaseUrl = environment.nodeApiBaseUrl;
        } else if (window.location.href.indexOf('http://' + testUrl) === 0
            || window.location.href.indexOf('https://' + testUrl) === 0) {
            this.apiBaseUrl = environment.testApiUrl;
            this.newApiBaseUrl = environment.nodeApiBaseUrl;
            this.fileBaseUrl = environment.testFileUrl;
            this.isTest = true;
        } else {
            this.apiBaseUrl = environment.testApiUrl;
            this.newApiBaseUrl = environment.nodeApiBaseUrl;
            this.fileBaseUrl = environment.localFileUrl;
            console.log(this.newApiBaseUrl);
        }
    }

    getApiBaseUrl() {
        return this.apiBaseUrl;
    }

    getFilePathUrl() {
        return this.fileBaseUrl;
    }

    getLogoPath() {
        return {
            small: AppSettings.logos.small.replace('**********', this.fileBaseUrl),
            full: AppSettings.logos.full.replace('**********', this.fileBaseUrl),
            alternate: AppSettings.logos.alternate.replace('**********', this.fileBaseUrl),
        }
    }
}
