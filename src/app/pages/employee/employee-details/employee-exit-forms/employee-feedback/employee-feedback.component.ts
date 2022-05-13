import { DataTableParameters, DatePickerOptions, RegEx } from 'src/app/app.constants';
import { NgForm } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

import { CustomModalComponent } from "./../../../../../shared/components/custom-modal/custom-modal.component";
import {
  SelectionConstants
} from "./../../../../../app.constants";
import { SubjectService } from "./../../../../../shared/services/subject.service";
import {
  SweetAlertValue,
  BaseResponse,
  UserStorageInformation,
} from "./../../../../../app.model";
import { LocalStorageService } from "./../../../../../shared/services/local-storage-service";
import { EmployeeService } from "./../../../employee.service";
import {
  EmployeeExitForm,
  EmployeeExitFormDetails,
  ExitFormRequest,
  EmployeeExitFormResponse,
  EmployeeResignationDetail,
  EmployeeActionRequest,
  EmployeeContactResponse,
} from "./../../employee-details.model";
import { getExportOptions } from 'src/app/shared/utils/getExportOptions';
import * as moment from 'moment';

@Component({
  selector: "app-employee-feedback",
  templateUrl: "./employee-feedback.component.html",
  styleUrls: ["./employee-feedback.component.scss"],
})
export class EmployeeFeedbackComponent implements OnInit {

  @Input('employeeExit') employeeExit: EmployeeResignationDetail = new EmployeeResignationDetail();
  @Input("feedbackModal") feedbackModal: CustomModalComponent;

  regex = RegEx;
  canEdit = true;
  employeeId = "";
  userInfo = {} as UserStorageInformation;
  isProcessing = false;
  alertData: SweetAlertValue = new SweetAlertValue();
  isHr = false;
  printedDate = moment(new Date()).format(DatePickerOptions.datePicker.dateTimeFormat);

  empExitForm: EmployeeExitFormDetails = new EmployeeExitFormDetails();
  totalIndustryExperienceOptions = SelectionConstants.totalIndustryExperience;

  constructor(
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.userInfo = this.localStorageService.getLoggedInUserInfo();
    this.employeeId = this.userInfo.employeeId;

    this.empExitForm = {
      ...this.empExitForm,
      employeeName: this.employeeExit.employeeName,
      employeeCode: this.employeeExit.employeeCode,
      department: this.employeeExit.department,
      dateOfJoining: this.employeeExit.dateOfJoining,
      exitId: this.employeeExit.exitId,
      accountNo: this.employeeExit.accountNo,
      bankName: this.employeeExit.bankName,
      ifscCode: this.employeeExit.ifscCode,
      address: this.employeeExit.address,
      tenureInKai: this.employeeExit.dateOfJoining ? this.monthDiff(new Date(this.employeeExit.dateOfJoining), new Date(this.employeeExit.relievingDate)) : ""
    }

    const payload: ExitFormRequest = {
      employeeExitId: this.employeeExit.exitId,
    };

    this.subjectService.toggleLoading(true);
    this.employeeService
      .getEmployeeExitForm(payload)
      .then((response: EmployeeExitFormResponse) => {
        if (response.isSuccess && response.employeeExitForm) {
          if (this.userInfo.role === "HR") {
            this.isHr = true;
          }
          this.canEdit = false;
          this.empExitForm = response.employeeExitForm;
          this.empExitForm.totalExperienceSelection = this.totalIndustryExperienceOptions.find(
            (x) => x.value === this.empExitForm.totalExperience
          );
        }
        else {
          const contact_payload: EmployeeActionRequest = {
            employeeId: this.employeeService.getEmployeeId()
          };

          this.employeeService.getEmployeeContacts(contact_payload)
            .then((response: EmployeeContactResponse) => {
              if (response.isSuccess) {
                this.empExitForm = {
                  ...this.empExitForm,
                  emailId: response.personalEmail,
                  mobileNumber: response.contactNumber
                }
              }
            });
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });


  }

  printPage() {
    window.print();
  }

  saveEmployeeExitFormAlert = (empExitForm: NgForm) => {
    if (empExitForm.valid) {
      this.alertData = {
        emoji: "assets/emoji/smile.png",
        header: "Submit Feedback?",
        content: ["Are you sure you want to submit your feedback."],
        confirmText: null,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        onConfirm: this.saveEmployeeExitForm,
        data: null,
      };
      this.subjectService.showSweetAlert(this.alertData, "primary");
    }
  };

  saveEmployeeExitForm = () => {
    this.isProcessing = true;

    var employeeExitForm: EmployeeExitForm = {
      employeeExitId: this.employeeExit.exitId,
      employeeExitForm: this.empExitForm,
    };

    this.employeeService
      .saveEmployeeExitForm(employeeExitForm)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.canEdit = false;
          this.feedbackModal.hideModal();
        }
      })
      .finally(() => {
        this.isProcessing = false;
      });
  };

  monthDiff(d1: Date, d2: Date) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
}
