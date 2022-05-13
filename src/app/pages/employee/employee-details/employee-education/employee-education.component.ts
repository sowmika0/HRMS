import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeeEducation,
  EmployeeEducationResponse,
  UpdateEmployeeEducationRequest,
} from '../employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SelectionConstants } from 'src/app/app.constants';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-education',
  templateUrl: './employee-education.component.html',
  styleUrls: ['./employee-education.component.scss']
})
export class EmployeeEducationComponent implements OnInit {

  @ViewChild('educationForm', { static: false }) educationForm: NgForm;
  @ViewChild('educationModal', { static: false }) educationModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  canEdit = false;
  employeeId = '';
  isUpdating = false;
  isProcessing = false;
  isYearAllowed = true;
  educations: EmployeeEducation[] = [];
  currentYear = new Date().getFullYear();
  activeEducations: EmployeeEducation[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();
  education: EmployeeEducation = new EmployeeEducation();
  courseTypeOptions = SelectionConstants.courseTypeOptions;

  loggedInUserScreen = true;
  haveAccess: boolean = false;

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
    this.icon = this.employeeService.getSectionTypeIcon('education');
    this.employeeId = this.employeeService.getEmployeeId();
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
    this.getEmployeeEducations();
  }

  private delete = (item: EmployeeEducation) => {
    item.isActive = false;
    this.setActiveEducations();
    this.updateEmployeeEducations();
  }

  setActiveEducations() {
    this.educations = this.educations.filter(i => i.employeeEducationId || (!i.employeeEducationId && i.isActive));
    this.activeEducations = this.educations.filter(i => i.isActive);
  }

  findAccess(data: EmployeeEducationResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeEducations() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeEducation(payload)
      .then((response: EmployeeEducationResponse) => {
        if (response.isSuccess) {
          this.educations = response.employeeEducation;
          this.findAccess(response);
          this.setActiveEducations();
          this.educations.map(e => {
            e.courseTypeSelection = this.courseTypeOptions.find(c => c.value === e.courseType);
          });
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeEducations() {
    this.isProcessing = true;
    const payload: UpdateEmployeeEducationRequest = {
      employeeId: this.employeeId,
      employeeEducation: this.educations
    };
    this.employeeService.updateEmployeeEducation(payload)
      .then((response: EmployeeEducationResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee education details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.educations = response.employeeEducation;
          this.educations.map(e => {
            e.courseTypeSelection = this.courseTypeOptions.find(c => c.value === e.courseType);
          });
          this.setActiveEducations();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.education = new EmployeeEducation();
    if (form) {
      form.reset();
    }
    this.educationModal.showModal();
  }

  edit(item: EmployeeEducation) {
    this.isUpdating = true;
    this.education = Object.assign({}, item);
    this.educationModal.showModal();
  }

  addOrUpdate() {
    const education = Object.assign({}, this.education);
    if (this.isYearAllowed) {

      if (!this.isUpdating) {
        education.isActive = true;
        education.tempId = ++this.tempId;
        this.educations.push(education);
        this.setActiveEducations();
      } else {
        if (education.employeeEducationId) {
          const addedEducation = this.educations.find(l => l.employeeEducationId === education.employeeEducationId);
          if (addedEducation) {
            addedEducation.institute = education.institute;
            addedEducation.city = education.city;
            addedEducation.state = education.state;
            addedEducation.courseName = education.courseName;
            addedEducation.startedYear = education.startedYear;
            addedEducation.completedYear = education.completedYear;
            addedEducation.courseDuration = education.courseDuration;
            addedEducation.majorSubject = education.majorSubject;
            addedEducation.grade = education.grade;
            addedEducation.courseType = education.courseType;
            addedEducation.percentage = education.percentage;
            addedEducation.courseTypeSelection = education.courseTypeSelection;
          }
        } else {
          const addedEducation = this.educations.find(l => l.tempId === education.tempId);
          if (addedEducation) {
            addedEducation.institute = education.institute;
            addedEducation.city = education.city;
            addedEducation.state = education.state;
            addedEducation.courseName = education.courseName;
            addedEducation.startedYear = education.startedYear;
            addedEducation.completedYear = education.completedYear;
            addedEducation.courseDuration = education.courseDuration;
            addedEducation.majorSubject = education.majorSubject;
            addedEducation.grade = education.grade;
            addedEducation.courseType = education.courseType;
            addedEducation.percentage = education.percentage;
            addedEducation.courseTypeSelection = education.courseTypeSelection;
          }
        }
      }

      this.updateEmployeeEducations();
      this.educationModal.hideModal();
    }
  }

  deleteAlert(item: EmployeeEducation) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Education?',
      content: [
        'Once you have deleted the added education information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Education',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  checkYear() {
    this.isYearAllowed = this.education.startedYear <= this.education.completedYear;
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'education'
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
