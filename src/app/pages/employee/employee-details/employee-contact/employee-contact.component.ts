import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SelectOption } from 'src/app/app.model';
import { Component, OnInit } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeAddress,
  EmployeeContactResponse,
  EmployeeDataVerificationRequest,
  EmployeeFamily,
  EmployeeFamilyResponse,
  UpdateEmployeeContactRequest,
} from './../employee-details.model';
import { RegEx, SelectionConstants, States } from 'src/app/app.constants';

import { EmployeeService } from '../../employee.service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-contact',
  templateUrl: './employee-contact.component.html',
  styleUrls: ['./employee-contact.component.scss']
})
export class EmployeeContactComponent implements OnInit {

  role = '';
  regex = RegEx;
  canEdit = false;
  employeeId = '';
  isProcessing = false;
  families: EmployeeFamily[] = [];
  statesList: SelectOption[] = [];
  employeeContact: EmployeeContactResponse;
  relationshipOptions = SelectionConstants.relationshipOptions;
  loggedInUserScreen = true;
  haveAccess: boolean = false;
  icon = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private roleSettingsService: RoleSettingsService
  ) { }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = this.role === 'hr' || this.role === 'self';
    this.employeeId = this.employeeService.getEmployeeId();
    this.icon = this.employeeService.getSectionTypeIcon('contact');
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
    this.getEmployeeContactInfo();
    this.getEmployeeFamilies();
    var stateList = States.states;
    stateList.map(s => {
      this.statesList.push({
        label: s.name,
        value: s.name
      });
    })
  }

  findAccess(data: EmployeeContactResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeContactInfo() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeService.getEmployeeId()
    };

    this.employeeService.getEmployeeContacts(payload)
      .then((response: EmployeeContactResponse) => {
        if (response.isSuccess) {
          this.employeeContact = response;
          this.findAccess(response);
          if (!this.employeeContact.presentAddress) {
            this.employeeContact.presentAddress = new EmployeeAddress();
            this.employeeContact.presentAddress.country = 'India';
          }
          if (!this.employeeContact.permanentAddress) {
            this.employeeContact.permanentAddress = new EmployeeAddress();
            this.employeeContact.permanentAddress.country = 'India';
          }
          this.employeeContact.presentAddress.stateSelection = this.statesList.find(a => a.value === this.employeeContact.presentAddress.state);
          this.employeeContact.permanentAddress.stateSelection = this.statesList.find(a => a.value === this.employeeContact.permanentAddress.state);
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }
  
  getEmployeeFamilies() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeFamily(payload)
      .then((response: EmployeeFamilyResponse) => {
        if (response.isSuccess) {
          this.families = response.employeeFamily;
          this.families = this.families.filter(f => f.isEmergencyContact);
          this.families.map(f => {
            f.relationSelection = this.relationshipOptions.find(r => r.value === f.relation);
          });
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  saveEmployeeContactInfo() {
    this.isProcessing = true;
    this.employeeContact.permanentAddress = this.employeeContact.permanentAddressSame
      ? this.employeeContact.presentAddress
      : this.employeeContact.permanentAddress;
    const payload: UpdateEmployeeContactRequest = Object.assign({}, this.employeeContact);
    payload.employeeId = this.employeeId;
    this.employeeService.updateEmployeeContact(payload)
      .then((response: EmployeeContactResponse) => {
        if (response.isSuccess) {
          this.employeeService.getEmployeeVerificationSubject.next();
          this.toaster.success('Employee contact details updated successfully.');
          this.employeeContact = response;
          this.employeeContact.presentAddress.stateSelection = this.statesList.find(a => a.value === this.employeeContact.presentAddress.state);
          this.employeeContact.permanentAddress.stateSelection = this.statesList.find(a => a.value === this.employeeContact.permanentAddress.state);
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }


  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'contact'
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
