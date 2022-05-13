import { NgForm } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

import { CustomModalComponent } from "./../../../../../shared/components/custom-modal/custom-modal.component";
import { SubjectService } from "./../../../../../shared/services/subject.service";
import {
  SweetAlertValue,
  BaseResponse
} from "./../../../../../app.model";
import { EmployeeService } from "./../../../employee.service";
import {
  HODFeedbackForm,
  HODFeedbackFormDetails,
  HODFeedbackFormResponse,
  ExitFormRequest,
  EmployeeResignationDetail,
} from "./../../employee-details.model";
import { DatePickerOptions, RegEx } from 'src/app/app.constants';
import * as moment from "moment";

@Component({
  selector: "app-hod-feedback",
  templateUrl: "./hod-feedback.component.html",
  styleUrls: ["./hod-feedback.component.scss"],
})
export class HodFeedbackComponent implements OnInit {
  @Input("employeeExit") employeeExit: EmployeeResignationDetail = new EmployeeResignationDetail();
  @Input("feedbackModal") feedbackModal: CustomModalComponent;

  regex = RegEx;
  canEdit = true;
  isProcessing = false;
  alertData: SweetAlertValue = new SweetAlertValue();
  printedDate = moment(new Date()).format(DatePickerOptions.datePicker.dateTimeFormat);

  hodFeedbackFormDetail = {} as HODFeedbackFormDetails;

  constructor(
    private employeeService: EmployeeService,
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.hodFeedbackFormDetail = {
      ...this.hodFeedbackFormDetail,
      employeeName: this.employeeExit.employeeName,
      employeeCode: this.employeeExit.employeeCode,
      exitId: this.employeeExit.exitId,
      isDesiredAttrition: false
    }

    const payload: ExitFormRequest = {
      employeeExitId: this.employeeExit.exitId,
    };

    this.subjectService.toggleLoading(true);
    this.employeeService.getHODFeedBackForm(payload).then((response: HODFeedbackFormResponse) => {
      if (response.isSuccess && response.hodFeedBackForm) {
        this.canEdit = false;
        this.hodFeedbackFormDetail = response.hodFeedBackForm;
        this.hodFeedbackFormDetail.desiredUnDesiredDetails = this.hodFeedbackFormDetail.isDesiredAttrition === true ? 'Desired' : 'UnDesired'
      }
    }).finally(() => {
      this.subjectService.toggleLoading(false);
    });
  }

  saveHODFeedbackFormAlert = (hodFeedbackForm: NgForm) => {
    if (hodFeedbackForm.valid) {
      this.alertData = {
        emoji: "assets/emoji/smile.png",
        header: "Submit Feedback?",
        content: ["Are you sure you want to submit your feedback."],
        confirmText: null,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        onConfirm: this.saveHODFeedbackForm,
        data: null,
      };
      this.subjectService.showSweetAlert(this.alertData, "primary");
    }
  };

  printPage() {
    window.print();
  }

  saveHODFeedbackForm = () => {
    this.isProcessing = true;

    var hodFeedBackForm: HODFeedbackForm = {
      employeeExitId: this.hodFeedbackFormDetail.exitId,
      hodFeedBackForm: this.hodFeedbackFormDetail,
    };

    this.employeeService
      .saveHODFeedBackForm(hodFeedBackForm)
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
}
