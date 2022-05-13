import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from 'src/app/shared/services/http-service';

import {
  AppraisalActionRequest,
  AppraisalFilterRequest,
  UpdateAppraisalQuestionRequest,
  UpdateAppraisalRequest,
} from './appraisal.model';

@Injectable({
  providedIn: 'root'
})
export class AppraisalService {

  constructor(
    private httpService: HttpService
  ) { }

  getAppraisalQuestions() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getAppraisalQuestions, null, false);
  }

  updateAppraisalQuestions(payload: UpdateAppraisalQuestionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.companyRoute.updateAppraisalQuestions, payload, false);
  }

  getAppraisalRatings() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getAppraisalRatings, null, false);
  }



  getGradesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getGradesForDropdown, null, false);
  }


  getAllAppraisals(payload: AppraisalFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.appraisalRoute.getAllAppraisals, payload, false);
  }

  getAppraisalDetails(payload: AppraisalActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.appraisalRoute.getAppraisalDetails, payload, false);
  }

  updateAppraisal(payload: UpdateAppraisalRequest) {
    return this.httpService.postMethod(AppApiEndpoints.appraisalRoute.updateAppraisal, payload, false);
  }

  deleteAppraisal(payload: AppraisalActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.appraisalRoute.deleteAppraisal, payload, false);
  }

}
