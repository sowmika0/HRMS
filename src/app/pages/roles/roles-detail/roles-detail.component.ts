import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { EmployeeBaseInfo, ReportingToResponse } from '../../employee/employee-details/employee-details.model';
import { EmployeeIdResponse, RolesModuleResponse, RolesModuleSettingsResponse, RolesModules, RolesSettings } from '../roles.model';
import { SelectOption, UserStorageInformation } from '../../../app.model';

import { DataTableParameters } from 'src/app/app.constants';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { RolesService } from '../roles.service';
import { SettingsService } from '../../settings/settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';

@Component({
  selector: 'app-roles-detail',
  templateUrl: './roles-detail.component.html',
  styleUrls: ['./roles-detail.component.scss']
})
export class RolesDetailComponent implements OnInit {

  dtOptionsForHr: DataTables.Settings = {};
  dtOptionsForRML2: DataTables.Settings = {};
  dtOptionsForEmployee: DataTables.Settings = {};
  rolesModulesServerData: RolesModules[] = [];
  rolesModulesUIData: RolesModules[] = [];
  hrEmployees: EmployeeBaseInfo[] = [];
  hrEmployeesOptions: SelectOption[] = [];
  hrRoleModuleSettings: RolesSettings[] = [];
  rmRoleModuleSettings: RolesSettings[] = [];
  employeeRoleModuleSettings: RolesSettings[] = [];
  loggedInEmployeeId: string;

  constructor(private settingsService: SettingsService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private rolesService: RolesService) {
    this.setDatatableSettings();
  }

  private getAllHrEmployees() {
    this.settingsService.getHrEmployeesForDropdown()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.hrEmployees = response.employees;
          this.hrEmployees.forEach((hr) => {
            this.hrEmployeesOptions.push({
              label: hr.employeeName,
              value: hr.employeeId
            });
          });
        }
      });
  }

  private setDatatableSettings(): void {
    this.dtOptionsForHr = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 1
        }
      ],
      paging: false,
      info: false,
      search: false,
      searching: false,
      buttons: []
    });
    this.dtOptionsForRML2 = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 1
        }
      ],
      paging: false,
      info: false,
      search: false,
      searching: false,
      buttons: []
    });
    this.dtOptionsForEmployee = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 1
        }
      ],
      paging: false,
      info: false,
      search: false,
      searching: false,
      buttons: []
    });
  }

  private getRolesModulesData(): void {
    this.rolesService.getRolesModule().then((rolesData: RolesModuleResponse) => {
      this.rolesModulesServerData = rolesData.value;
      this.getRolesModulesSettings();
    });
  }

  private getRolesModulesSettings() {
    this.subjectService.toggleLoading(true);
    this.rolesService.getRolesModulesSettings({ role: 'hr' })
      .then((settings: RolesModuleSettingsResponse) => {
        this.hrRoleModuleSettings = settings.value;
        this.setHrRolesModulesSettings();
        this.rolesService.getRolesModulesSettings({ role: 'rm' })
          .then((settings: RolesModuleSettingsResponse) => {
            this.rmRoleModuleSettings = settings.value;
            this.setRmRolesModulesSettings();
            this.rolesService.getRolesModulesSettings({ role: 'employee' })
              .then((settings: RolesModuleSettingsResponse) => {
                this.employeeRoleModuleSettings = settings.value;
                this.setEmployeeModulesSettings();
              });
          });
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  private setRmRolesModulesSettings() {
    this.rolesModulesServerData.forEach((modules) => {
      const selectedModule = this.rmRoleModuleSettings.filter((roles) => roles.moduleid === Number(modules.id));
      if (selectedModule.length) {
        modules.rmL2selected = selectedModule[0].canAccess === 1 ? true : false;
      }
    });
  }

  private setEmployeeModulesSettings() {
    this.rolesModulesServerData.forEach((modules) => {
      const selectedModule = this.employeeRoleModuleSettings.filter((roles) => roles.moduleid === Number(modules.id));
      if (selectedModule.length) {
        modules.employeeSelected = selectedModule[0].canAccess === 1 ? true : false;
      }
    });
  }

  private setHrRolesModulesSettings() {
    this.rolesModulesServerData.forEach((modules) => {
      const filteredModuleData = this.hrRoleModuleSettings.filter((roles) => roles.moduleid === Number(modules.id));
      const hr_users = [];
      modules.selected_HrUsers = [];
      filteredModuleData.forEach((f) => {
        hr_users.push(f.employeeGuid);
        const selected_hr: SelectOption[] = this.hrEmployeesOptions.filter((hr) => hr.value === f.employeeGuid);
        if (selected_hr.length) {
          modules.selected_HrUsers.push(selected_hr[0]);
        }
      });
      modules.hr_Users = hr_users;
    });
  }

  private getLoggedInEmployeeId(empGuid: string) {
    this.subjectService.toggleLoading(true);
    this.rolesService.getEmployeeId({ guid: empGuid })
      .then((result: EmployeeIdResponse) => {
        this.loggedInEmployeeId = result.value[0].id;
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  ngOnInit() {
    const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    this.getLoggedInEmployeeId(userStorage.employeeId);
    this.getAllHrEmployees();
    this.getRolesModulesData();
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      // item = values.map(m => m.employeeId);
      item = values.map(m => m.value);
    }
    return item;
  }

  saveRmL2Roles(): void {
    const settingsData: RolesSettings[] = this.rmRoleModuleSettings;
    const addRmRoles = [];
    const updateRmRoles = [];
    // scenario 1
    // first time add
    if (!settingsData.length) {
      this.rolesModulesServerData.forEach((module) => {
        if (module && 'rmL2selected' in module) {
          if (module.rmL2selected) {
            let object = {
              moduleid: Number(module.id),
              roleid: 3, // 2 for hr, 3 for RM tab, 3 for employee tab
              ismanager: 1, // 0 for hr roles tab, 1 for RM tab, 0 for employee
              employeeid: 0, // null for RM tab and employee
              canAccess: !module.rmL2selected ? 0 : 1,
              companyId: 1, // (always 1 in this scenario),
              addedBy: Number(this.loggedInEmployeeId),
              updatedBy: Number(this.loggedInEmployeeId),
              addedOn: new Date()
            };
            addRmRoles.push(object);
          }
        }
      });
    } else if (settingsData.length) {
      // scenario 3
      // ui has values, no value in db
      this.rolesModulesServerData.forEach((roles) => {
        const selectedRmSetting = settingsData.filter((setting) => setting.moduleid === Number(roles.id));
        if (selectedRmSetting.length) {
          // scenario 2
          // both side has values
          if (roles && 'rmL2selected' in roles) {
            let object = {
              id: Number(selectedRmSetting[0].id),
              moduleid: Number(selectedRmSetting[0].moduleid),
              roleid: 3, // 2 for hr, 3 for RM tab, 3 for employee tab
              ismanager: 1, // 0 for hr roles tab, 1 for RM tab, 0 for employee
              employeeid: 0, // null for RM tab and employee
              canAccess: !roles.rmL2selected ? 0 : 1,
              companyId: 1, // (always 1 in this scenario),
              addedBy: Number(this.loggedInEmployeeId),
              updatedBy: Number(this.loggedInEmployeeId),
            };
            updateRmRoles.push(object);
          }
        } else if (!selectedRmSetting.length) {
          // scenario 3
          // ui has values, no value in db
          if (roles && 'rmL2selected' in roles) {
            let object = {
              moduleid: Number(roles.id),
              roleid: 3, // 2 for hr, 3 for RM tab, 3 for employee tab
              ismanager: 1, // 0 for hr roles tab, 1 for RM tab, 0 for employee
              employeeid: 0, // null for RM tab and employee
              canAccess: !roles.rmL2selected ? 0 : 1,
              companyId: 1, // (always 1 in this scenario),
              addedBy: Number(this.loggedInEmployeeId),
              updatedBy: Number(this.loggedInEmployeeId),
              addedOn: new Date()
            };
            addRmRoles.push(object);
          }
        }
      });
    }
    if (addRmRoles.length && !updateRmRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.addRolesSettings(addRmRoles)
        .then((result) => {
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
    if (updateRmRoles.length && !addRmRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.updateRolesSettings(updateRmRoles)
        .then((result) => {
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
    if (addRmRoles.length && updateRmRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.addRolesSettings(addRmRoles)
        .then((addResult) => {
          this.rolesService.updateRolesSettings(updateRmRoles)
            .then((updateResult) => {
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
  }

  saveHrRoles(): void {
    const settingsData: RolesSettings[] = this.hrRoleModuleSettings;
    const addHrRoles = [];
    const updateHrRoles = [];
    this.rolesModulesServerData.forEach((module) => {
      const filteredRolesSettings = settingsData.filter((setting) => {
        return Number(module.id) === setting.moduleid;
      });
      // scenario 1 - any one array is empty
      // module is empty - no values in db, but new hr users are added - canAccess is 1 now
      if (filteredRolesSettings.length === 0 && module.hr_Users.length > 0) {
        (module.hr_Users || []).forEach((hrUser) => {
          // const filteredEmployee = filteredRolesSettings.filter((setting) => setting.employeeid === Number(hrUser));
          let object = {
            // id: null,
            moduleid: Number(module.id),
            roleid: 2, // 2 for hr
            ismanager: 0, // 0 for hr roles tab
            employeeid: hrUser, // guid is given
            canAccess: 1,
            companyId: 1, // (always 1 in this scenario),
            addedBy: Number(this.loggedInEmployeeId),
            updatedBy: Number(this.loggedInEmployeeId),
            addedOn: new Date()
          };
          addHrRoles.push(object);
        });
      }
      // scenario 2 - any one array is empty
      // module already has hr users but now it is removed - canAccess is 0 now
      if (filteredRolesSettings.length > 0 && module.hr_Users.length === 0) {
        filteredRolesSettings.forEach((setting) => {
          let object = {
            id: setting.id,
            moduleid: Number(module.id),
            roleid: 2, // 2 for hr
            ismanager: 0, // 0 for hr roles tab
            employeeid: setting.employeeid, // update - employeeid is given
            canAccess: 0,
            companyId: 1, // (always 1 in this scenario),
            addedBy: Number(this.loggedInEmployeeId),
            updatedBy: Number(this.loggedInEmployeeId),
            addedOn: new Date()
          };
          updateHrRoles.push(object);
        });
      }
      // scenario 3 - both arrays are having values
      // module already has hr users but adding extra hr users - canAccess is 1 now
      // update and add together
      if (filteredRolesSettings.length > 0 && module.hr_Users.length > 0 &&
        module.hr_Users.length > filteredRolesSettings.length) {
        let newHrUsers = [];
        filteredRolesSettings.forEach((setting) => {
          let object = {
            id: setting.id,
            moduleid: Number(module.id),
            roleid: 2, // 2 for hr
            ismanager: 0, // 0 for hr roles tab
            employeeid: setting.employeeid, // employeeid as it is update
            canAccess: 1,
            companyId: 1, // (always 1 in this scenario),
            addedBy: Number(this.loggedInEmployeeId),
            updatedBy: Number(this.loggedInEmployeeId),
            addedOn: new Date()
          };
          updateHrRoles.push(object);
          const filterHrUsers = module.hr_Users.filter((hr) => hr !== setting.employeeGuid);
          newHrUsers = [...newHrUsers, ...filterHrUsers];
        });
        newHrUsers = _.uniq(newHrUsers);
        newHrUsers.forEach((newHr) => {
          let object = {
            // id: null,
            moduleid: Number(module.id),
            roleid: 2, // 2 for hr
            ismanager: 0, // 0 for hr roles tab
            employeeid: newHr, // guid as it is add
            canAccess: 1,
            companyId: 1, // (always 1 in this scenario),
            addedBy: Number(this.loggedInEmployeeId),
            updatedBy: Number(this.loggedInEmployeeId),
            addedOn: new Date()
          };
          addHrRoles.push(object);
        });
      }
      if (filteredRolesSettings.length > 0 && module.hr_Users.length > 0 &&
        module.hr_Users.length < filteredRolesSettings.length) {
        filteredRolesSettings.forEach((setting) => {
          const removedHr = module.hr_Users.filter((hr) => hr === setting.employeeGuid);
          let object = {
            id: setting.id,
            moduleid: Number(module.id),
            roleid: 2, // 2 for hr, 3 for RM tab, 3 for employee tab
            ismanager: 0, // 0 for hr roles tab, 1 for RM tab, 0 for employee
            employeeid: setting.employeeid, // null for RM tab and employee, update - so employeeid
            canAccess: !removedHr.length ? 0 : 1,
            companyId: 1, // (always 1 in this scenario),
            addedBy: Number(this.loggedInEmployeeId),
            updatedBy: Number(this.loggedInEmployeeId),
            // addedOn: new Date()
          };
          updateHrRoles.push(object);
        });
      }
    });
    if (addHrRoles.length && !updateHrRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.addRolesSettings(addHrRoles)
        .then((result) => {
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
    if (updateHrRoles.length && !addHrRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.updateRolesSettings(updateHrRoles)
        .then((result) => {
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
    if (addHrRoles.length && updateHrRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.addRolesSettings(addHrRoles)
        .then((addResult) => {
          this.rolesService.updateRolesSettings(updateHrRoles)
            .then((updateResult) => {
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
  }

  saveEmployeeRoles(): void {
    const settingsData: RolesSettings[] = this.employeeRoleModuleSettings;
    const addEmployeeRoles = [];
    const updateEmployeeRoles = [];
    // scenario 1
    // first time add
    if (!settingsData.length) {
      this.rolesModulesServerData.forEach((module) => {
        if (module && 'employeeSelected' in module) {
          if (module.employeeSelected) {
            let object = {
              moduleid: Number(module.id),
              roleid: 3, // 2 for hr, 3 for RM tab, 3 for employee tab
              ismanager: 0, // 0 for hr roles tab, 1 for RM tab, 0 for employee
              employeeid: 0, // null for RM tab and employee
              canAccess: !module.employeeSelected ? 0 : 1,
              companyId: 1, // (always 1 in this scenario),
              addedBy: Number(this.loggedInEmployeeId),
              updatedBy: Number(this.loggedInEmployeeId),
              addedOn: new Date()
            };
            addEmployeeRoles.push(object);
          }
        }
      });
    } else if (settingsData.length) {
      // scenario 3
      // ui has values, no value in db
      this.rolesModulesServerData.forEach((roles) => {
        const selectedRmSetting = settingsData.filter((setting) => setting.moduleid === Number(roles.id));
        if (selectedRmSetting.length) {
          // scenario 2
          // both side has values
          if (roles && 'employeeSelected' in roles) {
            let object = {
              id: Number(selectedRmSetting[0].id),
              moduleid: Number(selectedRmSetting[0].moduleid),
              roleid: 3, // 2 for hr, 3 for RM tab, 3 for employee tab
              ismanager: 0, // 0 for hr roles tab, 1 for RM tab, 0 for employee
              employeeid: 0, // null for RM tab and employee
              canAccess: !roles.employeeSelected ? 0 : 1,
              companyId: 1, // (always 1 in this scenario),
              addedBy: Number(this.loggedInEmployeeId),
              updatedBy: Number(this.loggedInEmployeeId),
            };
            updateEmployeeRoles.push(object);
          }
        } else if (!selectedRmSetting.length) {
          // scenario 3
          // ui has values, no value in db
          if (roles && 'employeeSelected' in roles) {
            let object = {
              moduleid: Number(roles.id),
              roleid: 3, // 2 for hr, 3 for RM tab, 3 for employee tab
              ismanager: 0, // 0 for hr roles tab, 1 for RM tab, 0 for employee
              employeeid: 0, // null for RM tab and employee
              canAccess: !roles.employeeSelected ? 0 : 1,
              companyId: 1, // (always 1 in this scenario),
              addedBy: Number(this.loggedInEmployeeId),
              updatedBy: Number(this.loggedInEmployeeId),
              addedOn: new Date()
            };
            addEmployeeRoles.push(object);
          }
        }
      });
    }
    if (addEmployeeRoles.length && !updateEmployeeRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.addRolesSettings(addEmployeeRoles)
        .then((result) => {
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
    if (updateEmployeeRoles.length && !addEmployeeRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.updateRolesSettings(updateEmployeeRoles)
        .then((result) => {
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
    if (addEmployeeRoles.length && updateEmployeeRoles.length) {
      this.subjectService.toggleLoading(true);
      this.rolesService.addRolesSettings(addEmployeeRoles)
        .then((addResult) => {
          this.rolesService.updateRolesSettings(updateEmployeeRoles)
            .then((updateResult) => {
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.subjectService.toggleLoading(false);
          }, 1000);
        });
    }
  }

}
