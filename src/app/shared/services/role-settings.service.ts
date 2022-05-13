import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleSettingsService {

  constructor() { }

  findAccess(role, hrAccess, empAccess, mgAccess, isLoggedInUserScreen): boolean {
    let haveAccess = false;
    if (role === 'hr') {
      // find logged in employee screen or employee tab screen
      if (!hrAccess && !empAccess) {
        haveAccess = false;
      } else if (!hrAccess && empAccess) {
        if (isLoggedInUserScreen) {
          haveAccess = true;
        }
      } else if (hrAccess && !empAccess) {
        haveAccess = true;
      } else if (hrAccess && empAccess) {
        haveAccess = true;
      }
    } else if (role === 'manager') {
      // find logged in employee screen or reportees tab screen
      if (!mgAccess && !empAccess) {
        haveAccess = false;
      } else if (!mgAccess && empAccess) {
        if (isLoggedInUserScreen) {
          haveAccess = true;
        }
      } else if (mgAccess && !empAccess) {
        if (!isLoggedInUserScreen) { // it means reportees
          haveAccess = true;
        }
      } else if (mgAccess && empAccess) {
        haveAccess = true;
      }
    } else if (role === 'self') {
      if (empAccess) {
        haveAccess = true;
      }
    }
    return haveAccess;
  }
}
