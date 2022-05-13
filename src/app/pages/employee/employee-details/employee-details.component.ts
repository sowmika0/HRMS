import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TabsetComponent } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DatePickerOptions } from 'src/app/app.constants';
import { UserStorageInformation } from 'src/app/app.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { EmployeeService } from '../employee.service';
import { EmployeeSection, EmployeeSections } from './employee-details.constant';
import {
  EmployeeActionRequest,
  EmployeeExistResponse,
  EmployeeVerification,
  EmployeeVerificationResponse,
} from './employee-details.model';


@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  @ViewChild('employeeTabs', { static: false }) employeeTabs: TabsetComponent;

  isHr = false;
  employeeId = '';
  activeRoute = '';
  isMyProfile = false;
  isEmployeeExist = false;
  showHeaderContent = false;
  activeSection: EmployeeSection;
  existResponse: EmployeeExistResponse;
  verifications: EmployeeVerification[] = [];
  employeeSections = EmployeeSections.sections;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService
  ) {
    this.activeSection = this.employeeSections.find(i => i.route === 'account');
  }

  ngOnInit() {
    const employeeInfo = this.localStorageService.getLoggedInUserInfo();
    this.isHr = employeeInfo.role === 'HR';

    this.checkIfMyProfile();
    this.employeeService.getEmployeeVerificationSubject.subscribe(() => {
      this.getEmployeeVerifications();
    });
  }

  checkIfMyProfile() {
    this.activatedRoute.data.subscribe((data) => {
      if (data && data.profile) {
        this.isMyProfile = true;
        const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
        this.employeeId = userStorage.employeeId;
        this.checkIfEmployeeExist();
      } else {
        this.setEmployeeId();
      }
    });
  }

  setEmployeeId() {
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id) {
        this.employeeId = params.id;
        this.activeRoute = this.router.routerState.root.snapshot.firstChild.firstChild.firstChild
          ? this.router.routerState.root.snapshot.firstChild.firstChild.firstChild.url[0].path
          : '';
        this.checkIfEmployeeExist();
      }
    });
  }

  getEmployeeVerifications() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeDataVerification(payload)
      .then((response: EmployeeVerificationResponse) => {
        if (response.isSuccess) {
          this.verifications = response.verifications;
          this.verifications.map(v => {
            v.updatedOnText = moment.utc(v.updatedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
            v.verifiedOnText = v.verifiedOn
              ? moment.utc(v.verifiedOn).local().format(DatePickerOptions.datePicker.dateTimeFormat)
              : '';
          });
          this.employeeSections.map(s => {
            const verification = this.verifications.find(v => v.section === s.type);
            s.verification = verification;
          });
        }
      })
  }

  checkIfEmployeeExist() {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.checkIfEmployeeExist(payload)
      .then((response: EmployeeExistResponse) => {
        if (response.isSuccess) {
          if (response.isExist) {
            if (response.role) {
              this.existResponse = response;
              this.employeeService.setEmployeeId(this.employeeId);
              this.employeeService.setCurrentUserRole(response.role);
              this.isEmployeeExist = true;
              if (!response.hasReportees) {
                this.employeeSections = this.employeeSections.filter(t => t.type !== 'reportees');
              }
              if (!response.hasAssetSignings) {
                this.employeeSections = this.employeeSections.filter(t => t.type !== 'signing');
              }
              this.setActiveSection();
              this.getEmployeeVerifications();
            } else {
              this.toaster.error('Ooops... You cannot access the profile for the employee.');
              this.router.navigate(['/unauthorized']);
            }
          } else {
            this.toaster.error('Could not find the details for the employee.');
            this.router.navigate(['/not-found']);
          }
        }
      });
  }

  setActiveSection() {
    this.activeSection = this.employeeSections[0];
    setTimeout(() => {
      const section = this.employeeSections.find(r => r.route === this.activeRoute);
      if (section && !section.shouldCheck) {
        this.activeSection = section;
      } else if (section && section.shouldCheck) {
        if (section.type === 'reportees' && this.existResponse.hasReportees) {
          this.activeSection = section;
          this.activeSection.checkValidation = true;
        } else if (section.type === 'signing' && this.existResponse.hasAssetSignings) {
          this.activeSection = section;
          this.activeSection.checkValidation = true;
        } else {
          this.activeSection = this.employeeSections[0];
        }
      } else {
        this.activeSection = this.employeeSections[0];
        if (this.isMyProfile) {
          this.router.navigate(['/my-profile/' + this.activeSection.route]);
        } else {
          this.router.navigate(['/employees/' + this.employeeId + '/' + this.activeSection.route]);
        }
      }
      this.employeeTabs.tabs[this.employeeSections.indexOf(this.activeSection)].active = true;
    }, 100);
  }

  onTabChanged(section: EmployeeSection) {
    if (this.isMyProfile) {
      this.router.navigate(['/my-profile/' + section.route]);
    } else {
      this.router.navigate(['/employees/' + this.employeeId + '/' + section.route]);
    }
    this.subjectService.scrollToTop();
    this.activeSection = section;
  }

  toggleHeaderContent() {
    this.showHeaderContent = !this.showHeaderContent;
  }

}
