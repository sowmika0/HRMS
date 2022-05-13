import { Injectable } from '@angular/core';

import { AppApiEndpoints } from '../../app.constants';
import { HttpService } from './../../shared/services/http-service';
import { AuditFilterRequest } from './audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {


  constructor(
    private httpService: HttpService
  ) { }

  getEmployeesBaseInfo() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeesForDropdown, null, false);
  }

  getAllAuditModules() {
    return this.httpService.getMethod(AppApiEndpoints.auditRoute.getAllAuditModules, null, false);
  }

  getAllAudit(request: AuditFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.auditRoute.getAllAudit, request, false);
  }

}
