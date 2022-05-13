import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SelectOption, SelectOptionResponse, UserStorageInformation } from 'src/app/app.model';
import { Component, OnInit } from '@angular/core';
import {
  EmployeeAccountResponse,
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  UpdateEmployeeAccountRequest,
} from './../employee-details.model';

import { EmployeeService } from '../../employee.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SelectionConstants } from 'src/app/app.constants';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-account',
  templateUrl: './employee-account.component.html',
  styleUrls: ['./employee-account.component.scss']
})
export class EmployeeAccountComponent implements OnInit {

  role = '';
  canEdit = false;
  isProcessing = false;
  isLoggedInUser = false;
  isEmployeeCodeInvalid = false;
  employeeRoles: SelectOption[] = [];
  employeeAccount: EmployeeAccountResponse;
  statusOptions = SelectionConstants.statusOptions;
  updateAccountRequest: UpdateEmployeeAccountRequest = new UpdateEmployeeAccountRequest();
  icon = '';
  loggedInUserScreen = true;
  haveAccess: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private localStorageService: LocalStorageService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    const loggedInUser: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    if (loggedInUser && loggedInUser.employeeId) {
      this.isLoggedInUser = this.employeeService.getEmployeeId() === loggedInUser.employeeId;
    }
    this.role = this.employeeService.getCurrentUserRole();
    this.icon = this.employeeService.getSectionTypeIcon('account');
    this.canEdit = this.role === 'hr';
    this.getEmployeeAccount();
    this.getRolesForCompany();
  }

  findAccess(data: EmployeeAccountResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeAccount() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeService.getEmployeeId()
    };

    this.employeeService.getEmployeeAccount(payload)
      .then((response: EmployeeAccountResponse) => {
        if (response.isSuccess) {
          this.employeeAccount = response;
          this.findAccess(response);
          this.employeeAccount.statusSelection = this.statusOptions.find(r => r.value === this.employeeAccount.status);
          if (this.employeeRoles.length > 0) {
            this.employeeAccount.roleSelection = this.employeeRoles.find(r => r.value === this.employeeAccount.roleId);
          }
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  getRolesForCompany() {
    this.employeeService.getRolesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.employeeRoles = response.options;
          if (this.employeeAccount) {
            this.employeeAccount.roleSelection = this.employeeRoles.find(r => r.value === this.employeeAccount.roleId);
          }
        }
      });
  }

  saveEmployeeAccountInfo() {
    this.isProcessing = true;
    this.isEmployeeCodeInvalid = false;
    const payload: UpdateEmployeeAccountRequest = {
      canLogin: this.employeeAccount.canLogin,
      employeeId: this.employeeAccount.employeeId,
      roleId: this.employeeAccount.roleId,
      addressingName: this.employeeAccount.addressingName,
      employeeCode: this.employeeAccount.employeeCode,
      offRoleCode: this.employeeAccount.offRoleCode,
      status: this.employeeAccount.status,
    };

    this.employeeService.updateEmployeeAccount(payload)
      .then((response: EmployeeAccountResponse) => {
        if (response.isSuccess) {
          if (response.employeeId) {
            this.toaster.success('Employee account information saved successfully.');
            this.employeeAccount = response;
            this.employeeService.getEmployeeVerificationSubject.next();
            this.employeeAccount.roleSelection = this.employeeRoles.find(r => r.value === this.employeeAccount.roleId);
            this.employeeAccount.statusSelection = this.statusOptions.find(r => r.value === this.employeeAccount.status);
          } else {
            this.isEmployeeCodeInvalid = true;
            this.toaster.error('The employee code given is already used for some other employee. Please change the employee code before saving.');
          }
        }
      })
      .finally(() => {
        this.isProcessing = false;
      })
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'account'
    };
    this.employeeService.verifyEmployeeDataUpdate(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.employeeService.getEmployeeVerificationSubject.next();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }

}
