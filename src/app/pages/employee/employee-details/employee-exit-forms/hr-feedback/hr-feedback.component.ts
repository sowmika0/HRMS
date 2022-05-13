import * as moment from 'moment';

import { BaseResponse, SweetAlertValue } from './../../../../../app.model';
import { Component, Input, OnInit } from '@angular/core';
import { DatePickerOptions, RegEx } from './../../../../../app.constants';
import { EmployeeResignationDetail, ExitFormRequest, HRFeedbackFormResponse, HrFeedbackForm, HrFeedbackFormDetails } from './../../employee-details.model';

import { CustomModalComponent } from './../../../../../shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from './../../../employee.service';
import { NgForm } from '@angular/forms';
import { SubjectService } from './../../../../../shared/services/subject.service';

@Component({
  selector: 'app-hr-feedback',
  templateUrl: './hr-feedback.component.html',
  styleUrls: ['./hr-feedback.component.scss']
})
export class HrFeedbackComponent implements OnInit {

  @Input('employeeExit') employeeExit: EmployeeResignationDetail = new EmployeeResignationDetail();
  @Input('feedbackModal') feedbackModal: CustomModalComponent;
  @Input("getMyReporteesResignationDetails") getMyReporteesResignationDetails: () => void;

  regex = RegEx;
  canEdit = true;
  isProcessing = false;
  alertData: SweetAlertValue = new SweetAlertValue();
  printedDate = moment(new Date()).format(DatePickerOptions.datePicker.dateTimeFormat);

  hrFeedbackForm: HrFeedbackFormDetails = new HrFeedbackFormDetails();

  constructor(private employeeService: EmployeeService,
    private subjectService: SubjectService) { }

  ngOnInit() {
    console.log('resignationDate ',this.employeeExit.resignationDate);
    console.log('relievingDate ',this.employeeExit.relievingDate);
    this.hrFeedbackForm = {
      ...this.hrFeedbackForm,
      employeeName: this.employeeExit.employeeName,
      employeeCode: this.employeeExit.employeeCode,
      department: this.employeeExit.department,
      dateOfJoining: this.employeeExit.dateOfJoining,
      dateOfResignation: moment(this.employeeExit.resignationDate).format(DatePickerOptions.datePicker.dateTimeFormat),
      dateOfRelieving: moment(this.employeeExit.relievingDate).format(DatePickerOptions.datePicker.dateTimeFormat),
      exitId: this.employeeExit.exitId,
    }
    console.log(this.hrFeedbackForm);

    const payload: ExitFormRequest = {
      employeeExitId: this.employeeExit.exitId,
    };

    this.subjectService.toggleLoading(true);
    this.employeeService.getHRFeedBackForm(payload).then((response: HRFeedbackFormResponse) => {
      if (response.isSuccess && response.hrFeedBackForm) {
        this.canEdit = false;
        this.hrFeedbackForm = response.hrFeedBackForm;
      }
    }).finally(() => {
      this.subjectService.toggleLoading(false);
    });
  }

  printPage() {
    window.print();
  }

  saveHRFeedbackFormAlert = (hrFeedbackForm: NgForm) => {
    if (hrFeedbackForm.valid) {
      this.alertData = {
        emoji: "assets/emoji/smile.png",
        header: "Submit Feedback?",
        content: ["Are you sure you want to submit your feedback."],
        confirmText: null,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        onConfirm: this.saveHRFeedbackForm,
        data: null,
      };
      this.subjectService.showSweetAlert(this.alertData, "primary");
    }
  }

  saveHRFeedbackForm = () => {
    this.isProcessing = true;

    var hrFeedbackForm: HrFeedbackForm = {
      employeeExitId: this.hrFeedbackForm.exitId,
      hrFeedBackForm: this.hrFeedbackForm
    }

    this.employeeService.saveHRFeedBackForm(hrFeedbackForm).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.canEdit = false;
        this.feedbackModal.hideModal();
        this.getMyReporteesResignationDetails();
      }
    }).finally(() => {
      this.isProcessing = false;
    })
  }
}
