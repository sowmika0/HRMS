import { EmployeeMood, EmployeeMoodRequest, TagsForMoodRequest, TodayEmployeeMoodRequest } from '../mood-meter/mood-meter.model';

import { AppApiEndpoints } from 'src/app/app.constants';
import { CompanyCalendarRequest } from './dashboard.model';
import { EmployeeActionRequest } from './../employee/employee-details/employee-details.model';
import { HttpService } from 'src/app/shared/services/http-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpService: HttpService
  ) { }

  getAnnouncements(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.dashboardRoute.getDashboardAnnouncements, payload, false);
  }

  getEmployeeBirthdays() {
    return this.httpService.getMethod(AppApiEndpoints.dashboardRoute.getEmployeeBirthdays, null, false);
  }

  getCompanyCalendar(payload: CompanyCalendarRequest) {
    return this.httpService.getMethod(AppApiEndpoints.dashboardRoute.getHolidays, payload, false);
  }

  getTrainingCalendar(payload: CompanyCalendarRequest) {
    return this.httpService.getMethod(AppApiEndpoints.trainingRoute.getTrainingCalendar, payload, false);
  }

  getLocationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getLocationsForDropdown, null, false);
  }

  getManagerDashboardStats() {
    return this.httpService.getMethod(AppApiEndpoints.dashboardRoute.getManagerDashboardStats, null, false);
  }

  getHrDashboardStats() {
    return this.httpService.getMethod(AppApiEndpoints.dashboardRoute.getHrDashboardStats, null, false);
  }

  getEmployeesBaseInfo() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeesForDropdown, null, false);
  }

  getEmployeeOrgChart(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeOrgChart, payload, false);
  }

  saveEmployeeMood(payload: EmployeeMood) {
    const url = AppApiEndpoints.moodMeterRoute.saveEmployeeMood;
    return this.httpService.postMethod(url, payload, false);
  }

  saveEmployeeMoodTags(payload: TagsForMoodRequest) {
    const url = AppApiEndpoints.moodMeterRoute.saveEmployeeMoodTags;
    return this.httpService.postMethod(url, payload, false);
  }

  getEmployeeMoodForToday(payload: TodayEmployeeMoodRequest) {
    const url = AppApiEndpoints.moodMeterRoute.getEmployeeMoodForToday;
    return this.httpService.postMethod(url, payload, false);
  }

}
