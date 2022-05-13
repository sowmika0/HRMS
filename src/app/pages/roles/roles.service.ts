import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from "src/app/shared/services/http-service";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpSrevice: HttpService) { }

  getRolesModule() {
    const url = AppApiEndpoints.rolesRoute.getRolesModule;
    return this.httpSrevice.getMethod(url);
  }

  updateRolesSettings(payload) {
    const url = AppApiEndpoints.rolesRoute.updateSettingsModuleAccess;
    return this.httpSrevice.postMethod(url, payload, false);
  }

  addRolesSettings(payload) {
    const url = AppApiEndpoints.rolesRoute.addSettingsModuleAccess;
    return this.httpSrevice.postMethod(url, payload, false);
  }

  getRolesModulesSettings(payload) {
    const url = AppApiEndpoints.rolesRoute.getRolesModulesSettings;
    return this.httpSrevice.postMethod(url, payload, false);
  }

  getEmployeeId(payload) {
    const url = AppApiEndpoints.employeeNewRoute.getEmployeeId;
    return this.httpSrevice.postMethod(url, payload, false);
  }
}
