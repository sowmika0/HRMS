import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from 'src/app/shared/services/http-service';
import { EmployeeListFilterRequest } from '../employee/employee-details/employee-details.model';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private httpService: HttpService
  ) { }



  getEmployeeBirthDayReport(payload: EmployeeListFilterRequest) {
    const payloadStatic = {
      ...payload,
      // FromDate: '01-01-1991',
      // ToDate: '01-01-2021'
    }
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeRptBday, payloadStatic, false);
  }

  getHeadCountReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeRptHeadCount, payload, false);
  }

  getEmployeeAnniversaryReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeRptWday, payload, false);
  }

  getEmployeeProbationReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeRptProbation, payload, false);
  }

  getEmployeeBasicReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeBasicReport, payload, false);
  }

  getEmployeeResignedReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeResignedReport, payload, false);
  }

  getEmployeeObectiveReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeObectiveReport, payload, false);
  }

  getEmployeeCTCReport(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeCTCReport, payload, false);
  }

  getAddAndExitReport(payload: EmployeeListFilterRequest) {
    // payload.ToDate = new Date('02-01-2021')
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeRptAddandExit, payload, false);
  }

}
