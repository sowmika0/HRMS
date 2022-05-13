import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from 'src/app/shared/services/http-service';
import { CompanyCalendarRequest } from '../dashboard/dashboard.model';

import { EmployeeListFilterRequest } from '../employee/employee-details/employee-details.model';
import {
  AddMoreNomineesRequest,
  FillAttendanceRequest,
  TrainingActionRequest,
  TrainingFilterRequest,
  UpdateTrainingNomineeRequest,
  UpdateTrainingRequest,
} from './training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(
    private httpService: HttpService
  ) { }

  getAllTrainings(payload: TrainingFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.trainingRoute.getAllTrainings, payload, false);
  }

  getEmployeesBaseInfo() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeesForDropdown, null, false);
  }

  getHrEmployeesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getHrEmployeesForDropdown, null, false);
  }

  getAllTrainingTypes() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTrainingsForDropdown, null, false);
  }
  getAllTrainingCode() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTrainingCodeForDropdown, null, false);
  }
  getDesignationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getDesignationsForDropdown, null, false);
  }

  getGradesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getGradesForDropdown, null, false);
  }

  getDepartmentsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getDepartmentsForDropdown, null, false);
  }

  getLocationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getLocationsForDropdown, null, false);
  }

  getAllEmployees(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployees, payload, false);
  }

  getTrainingDetails(payload: TrainingActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.trainingRoute.getTrainingDetails, payload, false);
  }


  updateTraining(payload: UpdateTrainingRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.updateTraining, payload, false);
  }

  deleteTraining(payload: TrainingActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.deleteTraining, payload, false);
  }

  confirmTraining(payload: TrainingActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.confirmTraining, payload, false);
  }

  closeFeedbackFortraining(payload: TrainingActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.closeFeedbackForTraining, payload, false);
  }

  addNewNominees(payload: AddMoreNomineesRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.addMoreNominees, payload, false);
  }

  acceptTraining(payload: UpdateTrainingNomineeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.acceptTraining, payload, false);
  }

  rejectTraining(payload: UpdateTrainingNomineeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.rejectTraining, payload, false);
  }

  fillAttendance(payload: FillAttendanceRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.fillAttendance, payload, false);
  }

  getTrainingCalendar(payload: CompanyCalendarRequest) {
    return this.httpService.getMethod(AppApiEndpoints.trainingRoute.getTrainingCalendar, payload, false);
  }

}
