import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import {
  Appraisal,
  BusinessNeed,
  EmployeeActionRequest,
  EmployeeAppraisalResponse,
  EmployeeExistResponse,
  Feedback,
  GetCompanyTrainingsRequest,
  SaveAppraisalBusinessNeedsRequest,
  SaveAppraisalInternalRequest,
  SaveAppraisalRatingRequest,
  SaveAppraisalSelfRequest,
  SaveAppraisalTrainingRequest,
  SelfAnswer,
  SubmitAppraisalRequest,
  UpdateAppraisalFeedbackResponse,
  UpdateFeedbackRequest,
} from '../../employee-details.model';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, Input, OnInit } from '@angular/core';
import { SelectOption, SelectOptionResponse } from './../../../../../app.model';

import { AppraisalRating } from './../../../../appraisal/appraisal.model';
import { DatePickerOptions } from './../../../../../app.constants';
import { EmployeeService } from '../../../employee.service';
import { LocalStorageService } from './../../../../../shared/services/local-storage-service';
import { NgForm } from '@angular/forms';
import { SaveAppraisalOrganizationRequest } from './../../employee-details.model';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-appraisal-info',
  templateUrl: './employee-appraisal-info.component.html',
  styleUrls: ['./employee-appraisal-info.component.scss']
})
export class EmployeeAppraisalInfoComponent implements OnInit {

  @Input('isActive') isActive = false;
  @Input('appraisal') appraisal: Appraisal;
  @Input('ratings') ratings: AppraisalRating[] = [];
  @Input('reportingEmpId') reportingEmpId: string;

  newCount = 0;
  isHr = false;
  isSelf = true;
  daysLeft = '';
  employeeId = '';
  isManager = true;
  averageScore = 0;
  appraiseeType = '';
  appraiseeName = '';
  isL2Manager = false;
  canAddComment = false;
  isRmSubmitted = false;
  isHrSubmitted = false;
  isL2Submitted = false;
  isSelfSubmitted = false;
  isRmObjectiveSubmitted = false;
  isHrObjectiveSubmitted = false;
  isL2ObjectiveSubmitted = false;
  isSelfObjectiveSubmitted = false;
  isAppraiseeCommentAdded = false;
  suggestedRating: AppraisalRating;
  activeSelfObjs: SelfAnswer[] = [];
  trainingsList: SelectOption[] = [];
  activeBusinessNeeds: BusinessNeed[] = [];
  appraisalCopy: Appraisal = new Appraisal();
  alertData: SweetAlertValue = new SweetAlertValue();
  existResponse: EmployeeExistResponse;

  isSelfProcessing = false;
  isOrgProcessing = false;
  isTrainingProcessing = false;
  isCommentProcessing = false;
  isSubmitProcessing = false;
  isInternalProcessing = false;

  depRolePercentage = 0;
  capAttitudePercentage = 0;
  internalPercentage = 0;

  weightageTotal = 0;
  selfWeightageTotal = 0;
  selfBusinessTotal = 0;
  selfAnserTotal = 0;
  selfInternal = 0;
  selfAverageScore = 0;
  selfSuggestedRating: AppraisalRating;
  selfBussWeightageTotal = 0;
  selfAnswerWeightageTotal = 0;
  
  rmWeightageTotal = 0;
  rmBusinessTotal = 0;
  rmAnserTotal = 0;
  rmInternal = 0;
  rmAverageScore = 0;
  rmSuggestedRating: AppraisalRating;

  l2WeightageTotal = 0;
  l2BusinessTotal = 0;
  l2AnserTotal = 0;
  l2Internal = 0;
  l2AverageScore = 0;
  l2SuggestedRating: AppraisalRating;

  printedDate = moment(new Date()).format(DatePickerOptions.datePicker.dateTimeFormat);

  selfAssessmentComment = '';
  MCAComment = '';
  internalControlComment = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService
  ) {
  }

  ngOnInit() {
    this.getAllTrainings();
    this.appraisalInit();
    this.getEmployeeDetails();
  }

  private getEmployeeDetails(): void {
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.checkIfEmployeeExist(payload)
      .then((response: EmployeeExistResponse) => {
        if (response.isSuccess) {
          if (response.isExist) {
            if (response.role) {
              this.existResponse = response;
            }
          }
        }
      });
  }

  private deleteObjective = (item: SelfAnswer) => {
    if (item.selfAppraisalAnswerId) {
      item.isActive = false;
    } else {
      this.appraisal.selfAnswers = this.appraisal.selfAnswers.filter(a => a !== item);
    }

    this.activeSelfObjs = this.appraisal.selfAnswers.filter(v => v.isActive);
  }

  private deleteBusinessNeed = (item: BusinessNeed) => {
    if (item.businessNeedAnswerId) {
      item.isActive = false;
    } else {
      this.appraisal.businessNeeds = this.appraisal.businessNeeds.filter(a => a !== item);
    }

    this.activeBusinessNeeds = this.appraisal.businessNeeds.filter(v => v.isActive);
  }

  private submitRating = () => {
    this.isSubmitProcessing = true;
    const payload: SaveAppraisalRatingRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      employeeId: this.employeeId,
      ratingId: this.appraisal.rating
    };

    this.employeeService.saveAppraisalRating(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Rating for the employee is set successfully.');
          this.getAppraisalDetails();
        }
      })
      .finally(() => {
        this.isSubmitProcessing = false;
      })
  }

  private submitObjectiveSelf = () => {
    this.isSubmitProcessing = true;
    const payload: SubmitAppraisalRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      employeeId: this.employeeId,
      isSelf: this.isSelf,
      ratingId: this.appraisal.rating
    };

    this.employeeService.submitObjective(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Your self objective details are filled successfully and moved to the queue of RM.');
          this.getAppraisalDetails();
        }
      })
      .finally(() => {
        this.isSubmitProcessing = false;
      })
  }

  private submitAppraisalSelf = () => {
    this.isSubmitProcessing = true;
    const payload: SubmitAppraisalRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      employeeId: this.employeeId,
      isSelf: this.isSelf,
      ratingId: this.appraisal.rating
    };

    this.employeeService.submitAppraisal(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Your self appraisal details are filled successfully and moved to the queue of RM.');
          this.getAppraisalDetails();
        }
      })
      .finally(() => {
        this.isSubmitProcessing = false;
      })
  }

  addCommentFeedback(type: string, comment: string, addComma: boolean): void {
    const feedback = this.appraisal.feedbacks.find(f => f.appraiseeType === this.appraiseeType);
    const list = feedback.feedback.split('\n');
    const checkType = list.filter((l) => {
      if (l.includes(type)) {
        return l;
      }
    });
    checkType.forEach((f) => {
      const lineBreakEnd = f + '\n';
      const lineBreakStart = '\n' + f;
      const noBreak = f;
      const withLineBreakEnd = feedback.feedback.includes(lineBreakEnd);
      const withLineBreakStart = feedback.feedback.includes(lineBreakStart);
      const withoutLineBreak = feedback.feedback.includes(noBreak);
      let replaceSearch;
      withLineBreakEnd ? replaceSearch = lineBreakEnd :
      (withLineBreakStart ? replaceSearch = lineBreakStart : replaceSearch = noBreak);
      feedback.feedback = feedback.feedback.replace(replaceSearch, '');
    });
    feedback.feedback = feedback.feedback + '\n' + type + comment;
    // feedback.feedback = type + comment;
    this.saveAppraisalFeedback();
  }

  appraisalInit() {
    this.employeeId = this.reportingEmpId; //this.employeeService.getEmployeeId();
    const employeeInfo = this.localStorageService.getLoggedInUserInfo();
    this.appraiseeName = employeeInfo.name;

    const KHGrade = ['H','I','J','K', 'T', 'S']; 
    const GCGrade = ['B','C','D','E','F','G'];
    const HGrade = ['H'];

    if(this.appraisal.mode === 'appraisal') {
      if(KHGrade.includes(this.appraisal.grade.substring(0,1))) {
        this.depRolePercentage = 0.7;
        this.capAttitudePercentage = 0.2;
        this.internalPercentage = 0.1;
      }
      else if(GCGrade.includes(this.appraisal.grade.substring(0,1))){
        this.depRolePercentage = 0.4;
        this.capAttitudePercentage = 0.5;
        this.internalPercentage = 0.1;
      }
    }
    else if(this.appraisal.mode === 'variablebonus') {
      if(this.appraisal.category.toLowerCase() !== 'field') {
        this.appraisal.mode = 'objective';
      }
      else if(HGrade.includes(this.appraisal.grade.substring(0,1))) {
        this.depRolePercentage = 0.7;
        this.capAttitudePercentage = 0.2;
        this.internalPercentage = 0.1;
      }
      else if(GCGrade.includes(this.appraisal.grade.substring(0,1))){
        this.depRolePercentage = 0.5;
        this.capAttitudePercentage = 0.4;
        this.internalPercentage = 0.1;
      }
      else {
        this.appraisal.mode = 'objective';
      }
    }

    this.appraisal.startDateText = moment(this.appraisal.startDate)
      .add(10, 'hours')
      .format(DatePickerOptions.datePicker.dateInputFormat);

    this.appraisal.endDateText = moment(this.appraisal.endDate)
      .add(10, 'hours')
      .format(DatePickerOptions.datePicker.dateInputFormat);

    this.isSelf = this.appraisal.isSelf;
    this.isManager = this.appraisal.isManager;
    this.isL2Manager = this.appraisal.isL2Manager;
    this.isHr = employeeInfo.role === 'HR';
    this.isSelfSubmitted = this.appraisal.selfAppraisalDoneOn ? true : false;
    this.isRmSubmitted = this.appraisal.rmSubmittedOn ? true : false;
    this.isL2Submitted = this.appraisal.l2SubmittedOn ? true : false;
    this.isHrSubmitted = this.appraisal.appraisalClosedOn ? true : false;

    this.isSelfObjectiveSubmitted = this.appraisal.selfObjectiveSubmittedOn ? true : false;
    this.isRmObjectiveSubmitted = this.appraisal.rmObjectiveSubmittedOn ? true : false;
    this.isL2ObjectiveSubmitted = this.appraisal.l2ObjectiveSubmittedOn ? true : false;
    this.isHrObjectiveSubmitted = this.appraisal.hrObjectiveSubmittedOn ? true : false;

   
    var _mode = this.appraisal.mode === 'objective' ? 1 : this.appraisal.mode === 'appraisal' ? 3 : 2;
    var selfAnswerCopy = this.appraisal.selfAnswers;
    var businessNeedsCopy = this.appraisal.businessNeeds.filter(b => b.appraisalMode === _mode);

    if(this.appraisal.mode === 'appraisal'){
      selfAnswerCopy = this.appraisal.selfAnswers.filter(s => s.appraisalMode !== 2);
    }

    this.weightageTotal = selfAnswerCopy.length > 0 ? selfAnswerCopy.map(m => m.weightage).reduce((a, b) => a + b) : 0;
    this.selfWeightageTotal = selfAnswerCopy.length > 0 ? selfAnswerCopy.map(m => m.selfWeightage).reduce((a, b) => a + b) : 0;
    this.selfBusinessTotal = businessNeedsCopy.length > 0 ? businessNeedsCopy.map(m => m.selfWeightage).reduce((a, b) => a + b) : 0;
    this.selfAnserTotal = this.appraisal.questions.length > 0 ? this.appraisal.questions.map(m => m.selfWeightage).reduce((a, b) => a + b) : 0;
    this.selfInternal = this.appraisal.internalSelf
    this.selfBussWeightageTotal = businessNeedsCopy.length > 0 ? businessNeedsCopy.map(m => m.weightage).reduce((a, b) => a + b) : 0;
    this.selfAnswerWeightageTotal = this.appraisal.questions.length > 0 ? this.appraisal.questions.map(m => m.weightage).reduce((a, b) => a + b) : 0;

    this.selfAverageScore =
    ((this.selfWeightageTotal + this.selfBusinessTotal) * this.depRolePercentage)
    + (this.selfAnserTotal * this.capAttitudePercentage)
    + (this.selfInternal * this.internalPercentage);

    var rating1 = this.ratings.filter(a => a.score <= this.selfAverageScore)
    this.selfSuggestedRating = rating1.length > 1
    ? this.selfAverageScore >= 110 ? rating1[1] : rating1[0]
    : rating1[0];

    if (this.isSelf && this.selfAverageScore && !this.isHrSubmitted) {
      this.appraisal.rating = this.selfSuggestedRating.ratingId
    }

    // selfAnswerCopy = this.appraisal.selfAnswers.filter(b => b.appraisalMode === _mode);

    this.rmWeightageTotal = selfAnswerCopy.length > 0 ? selfAnswerCopy.map(m => m.managementWeightage).reduce((a, b) => a + b) : 0;
    this.rmBusinessTotal = businessNeedsCopy.length > 0 ? businessNeedsCopy.map(m => m.managementWeightage).reduce((a, b) => a + b) : 0;
    this.rmAnserTotal = this.appraisal.questions.length > 0 ? this.appraisal.questions.map(m => m.managementWeightage).reduce((a, b) => a + b) : 0;
    this.rmInternal = this.appraisal.internalMgmt

    this.rmAverageScore =
    ((this.rmWeightageTotal + this.rmBusinessTotal) * this.depRolePercentage)
    + (this.rmAnserTotal * this.capAttitudePercentage)
    + (this.rmInternal * this.internalPercentage);

    var rating2 = this.ratings.filter(a => a.score <= this.rmAverageScore)
    this.rmSuggestedRating = rating2.length > 1
    ? this.rmAverageScore >= 110 ? rating2[1] : rating2[0]
    : rating2[0];

    if (!this.isSelf && this.isManager && !this.isHrSubmitted) {
      this.appraisal.rating = this.rmSuggestedRating.ratingId
    }

    this.l2WeightageTotal = selfAnswerCopy.length > 0 ? selfAnswerCopy.map(m => m.l2Weightage).reduce((a, b) => a + b) : 0;
    this.l2BusinessTotal = businessNeedsCopy.length > 0 ? businessNeedsCopy.map(m => m.l2Weightage).reduce((a, b) => a + b) : 0;
    this.l2AnserTotal = this.appraisal.questions.length > 0 ? this.appraisal.questions.map(m => m.l2Weightage).reduce((a, b) => a + b) : 0;
    this.l2Internal = this.appraisal.internalL2

    this.l2AverageScore =
    ((this.l2WeightageTotal + this.l2BusinessTotal) * this.depRolePercentage)
    + (this.l2AnserTotal * this.capAttitudePercentage)
    + (this.l2Internal * this.internalPercentage);

    var rating3 = this.ratings.filter(a => a.score <= this.l2AverageScore);
    this.l2SuggestedRating = rating3.length > 1
    ? this.l2AverageScore >= 110 ? rating3[1] : rating3[0]
    : rating3[0];

    if (!this.isSelf && this.isL2Manager && !this.isHrSubmitted) {
      this.appraisal.rating = this.l2SuggestedRating.ratingId
    }



    this.appraiseeType = this.isSelf ? 'Self' : this.isHr ? 'HR' : this.isManager ? 'Manager' : this.isL2Manager ? 'L2' : null;
    if (this.isManager && this.isHr) {
      if(this.appraisal.mode !== 'objective') {
        if (this.isRmSubmitted) {
          this.appraiseeType = 'HR';
        } else {
          this.appraiseeType = 'Manager';
        }
      }
      else {
        if (this.isRmObjectiveSubmitted) {
          this.appraiseeType = 'HR';
        } else {
          this.appraiseeType = 'Manager';
        }
      }
    }

    if (this.isL2Manager && this.isHr) {
      if(this.appraisal.mode !== 'objective') {
        if (this.isL2Submitted) {
          this.appraiseeType = 'HR';
        } else {
          this.appraiseeType = 'L2';
        }
      }
      else {
        if (this.isL2ObjectiveSubmitted) {
          this.appraiseeType = 'HR';
        } else {
          this.appraiseeType = 'L2';
        }
      }
    }
    
    this.isActive = this.appraiseeType ? this.isActive : false;

    this.daysLeft = moment.duration(moment(this.appraisal.endDateText).diff(moment(), 'days'), 'days').humanize() + ' left';
    this.isAppraiseeCommentAdded = this.appraisal.feedbacks.find(a => a.appraiseeType === this.appraiseeType 
        && a.appraisalMode === (this.appraisal.mode === 'objective' ? 1 : this.appraisal.mode === 'appraisal' ? 3 : 2)) ? false : true;
    if (this.isAppraiseeCommentAdded
      && (this.isSelf
        || (this.isManager && this.isSelfSubmitted)
        || (this.isL2Manager && this.isSelfSubmitted && this.isRmSubmitted)
        || (this.isHr && this.isSelfSubmitted && this.isRmSubmitted && this.isL2Submitted)
        || (this.isManager && this.isSelfObjectiveSubmitted)
        || (this.isL2Manager && this.isSelfObjectiveSubmitted && this.isRmObjectiveSubmitted)
        || (this.isHr && this.isSelfObjectiveSubmitted && this.isRmObjectiveSubmitted && this.isL2ObjectiveSubmitted))) {
      this.addFeedback();
    }

    if (this.isL2Manager || this.isManager || this.isHr) {
      this.appraisal.selfAnswers.map(s => {
        if (s.l2Weightage === 0) {
          s.l2Weightage = s.managementWeightage;
        }
      });
      this.appraisal.questions.map(s => {
        if (s.l2Weightage === 0) {
          s.l2Weightage = s.managementWeightage;
        }
      });
      this.appraisal.businessNeeds.map(s => {
        if (s.l2Weightage === 0) {
          s.l2Weightage = s.managementWeightage;
        }
      });
      this.appraisal.internalL2 = this.appraisal.internalL2 === 0 ? this.appraisal.internalMgmt : this.appraisal.internalL2;
    }

    if(this.appraisal.mode === 'appraisal'){
      this.appraisal.selfAnswers = this.appraisal.selfAnswers.filter(s => s.appraisalMode !== 2);
      this.appraisal.businessNeeds = this.appraisal.businessNeeds.filter(b => b.appraisalMode !== 2);
    }

    

 
    if ((this.isSelfSubmitted || this.isSelfObjectiveSubmitted)) {
      const selfTotal = this.appraisal.selfAnswers.map(m => m.l2Weightage).reduce((a, b) => a + b);
      const businessNeedTotal = this.appraisal.businessNeeds.length > 0 ? this.appraisal.businessNeeds.map(m => m.l2Weightage).reduce((a, b) => a + b) : 0;
      const quesTotal = this.appraisal.questions.map(m => m.l2Weightage).reduce((a, b) => a + b);

      this.appraisal.appraisalCalculation = {
        businessNeedTotal: businessNeedTotal,
        selfTotal: selfTotal,
        definedTotal: quesTotal,
        internalTotal: this.appraisal.internalL2 ? this.appraisal.internalL2 : 0,
        ratingTotal: 0
      };

      this.averageScore =
        ((selfTotal + businessNeedTotal) * this.depRolePercentage)
        + (quesTotal * this.capAttitudePercentage)
        + ((this.appraisal.internalL2 ? this.appraisal.internalL2 : 0) * this.internalPercentage);

      this.appraisal.appraisalCalculation.ratingTotal = this.averageScore;

      var _rating = this.ratings.filter(a => a.score <= this.averageScore);
      this.suggestedRating = _rating.length > 1
          ? this.averageScore >= 110 ? _rating[1] : _rating[0]
          : _rating[0];

      // if(!this.isSelf) {
      //   if (this.suggestedRating && !this.isHrSubmitted) {
      //     this.appraisal.rating = this.suggestedRating.ratingId
      //   }
      // }
    }

      if(this.appraisal.mode !== 'objective'){
        if (this.appraiseeType === 'Self' && !this.isSelfSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'Manager' && !this.isRmSubmitted && this.isSelfSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'L2' && !this.isL2Submitted && this.isRmSubmitted && this.isSelfSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'HR' && !this.isHrSubmitted && this.isL2Submitted && this.isRmSubmitted && this.isSelfSubmitted) {
          this.canAddComment = true;
        }
      }
      else {
        if(this.appraiseeType === 'Self' && this.isSelfObjectiveSubmitted && !this.isHrObjectiveSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'Self' && !this.isSelfObjectiveSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'Manager' && !this.isRmObjectiveSubmitted && this.isSelfObjectiveSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'L2' && !this.isL2ObjectiveSubmitted && this.isRmObjectiveSubmitted && this.isSelfObjectiveSubmitted) {
          this.canAddComment = true;
        } else if (this.appraiseeType === 'HR' && !this.isHrObjectiveSubmitted && this.isL2ObjectiveSubmitted && this.isRmObjectiveSubmitted && this.isSelfObjectiveSubmitted) {
          this.canAddComment = true;
        }
      }

    this.appraisal.feedbacks = this.appraisal.feedbacks.filter(feedback => 
      feedback.appraisalMode === (this.appraisal.mode === 'objective' ? 1 : this.appraisal.mode === 'appraisal' ? 3 : 2));
    this.appraisal.feedbacks.map(f => {
      f.givenOn = moment.utc(f.givenOn).local().format(DatePickerOptions.datePicker.dateTimeFormat);
    });

    this.appraisal.selfTrainings = this.appraisal.trainings.filter(t => t.isSelf).map(t => t.trainingId);
    this.appraisal.rmTrainings = this.appraisal.trainings.filter(t => !t.isSelf).map(t => t.trainingId);
    this.appraisal.selfTrainingSelections =
      this.trainingsList.filter(t => this.appraisal.selfTrainings.find(s => s === t.value));
    this.appraisal.rmTrainingSelections =
      this.trainingsList.filter(t => this.appraisal.rmTrainings.find(s => s === t.value));


    this.appraisal.selfAnswers.map(a => {
      a.count = ++this.newCount
    });
    this.appraisal.businessNeeds.map(a => {
      a.count = ++this.newCount
    });

    this.appraisalCopy = JSON.parse(JSON.stringify(this.appraisal));
    this.activeSelfObjs = this.appraisal.selfAnswers.filter(v => v.isActive);
    this.activeBusinessNeeds = this.appraisal.businessNeeds.filter(v => v.isActive);
  }

  getAppraisalDetails() {
    this.subjectService.toggleLoading(true);
    const payload: SubmitAppraisalRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      employeeId: this.employeeId,
      isSelf: this.isSelf
    };
    this.employeeService.getEmployeeSingleAppraisalDetails(payload)
      .then((response: EmployeeAppraisalResponse) => {
        if (response.isSuccess) {
          this.appraisal = response.appraisals[0];
          this.appraisalInit();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  addObjective() {
    const newObj: SelfAnswer = {
      description: '',
      isActive: true,
      managementWeightage: 0,
      selfAppraisalAnswerId: null,
      selfWeightage: 0,
      title: 'Dept./Role Based Objective',
      weightage: 0,
      l2Weightage: 0,
      count: ++this.newCount,
      appraisalMode: this.appraisal.mode === "objective" ? 1 :this.appraisal.mode === "appraisal" ? 3 : 2,
      newRecord: true
    };
    this.appraisal.selfAnswers.push(newObj);
    this.selfWeightageTotal = this.appraisal.selfAnswers.map(m => m.weightage).reduce((a, b) => a + b);
    this.activeSelfObjs = this.appraisal.selfAnswers.filter(v => v.isActive);
  }

  addBusinessNeed() {
    const newNeed: BusinessNeed = {
      description: '',
      isActive: true,
      managementWeightage: 0,
      businessNeedAnswerId: null,
      selfWeightage: 0,
      title: 'Circumstances or Business Need Obj.',
      weightage: 0,
      l2Weightage: 0,
      count: ++this.newCount,
      appraisalMode: this.appraisal.mode === "objective" ? 1 :this.appraisal.mode === "appraisal" ? 3 : 2
    };
    this.appraisal.businessNeeds.push(newNeed);
    this.activeBusinessNeeds = this.appraisal.businessNeeds.filter(v => v.isActive);
  }

  getAllTrainings() {
    const payload: GetCompanyTrainingsRequest = {
      gradeIds: []
    };
    this.employeeService.getTrainingsForDropdown(payload)
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.trainingsList = response.options;
          this.appraisal.selfTrainingSelections =
            this.trainingsList.filter(t => this.appraisal.selfTrainings.find(s => s === t.value));
          this.appraisal.rmTrainingSelections =
            this.trainingsList.filter(t => this.appraisal.rmTrainings.find(s => s === t.value));
        }
      })
  }

  deleteBusinessNeedAlert(item: BusinessNeed) {
    if (item.businessNeedAnswerId) {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Business Need?',
        content: [
          'Once you have deleted the business need and saved the appraisal, it cannot be undone. Please check before you proceed.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete It',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.deleteBusinessNeed,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    } else {
      this.appraisal.businessNeeds = this.appraisal.businessNeeds.filter(a => a !== item);
      this.activeBusinessNeeds = this.appraisal.businessNeeds.filter(v => v.isActive);
    }
  }

  deleteObjectiveAlert(item: SelfAnswer) {
    if (item.selfAppraisalAnswerId) {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Objective?',
        content: [
          'Once you have deleted the objective and saved the appraisal, it cannot be undone. Please check before you proceed.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Objective',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.deleteObjective,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    } else {
      this.appraisal.selfAnswers = this.appraisal.selfAnswers.filter(a => a !== item);
      this.activeSelfObjs = this.appraisal.selfAnswers.filter(v => v.isActive);
    }
  }

  addFeedback() {
    const newFeedback: Feedback = {
      appraiseeType: this.appraiseeType,
      employeeFeedbackId: null,
      feedback: '',
      givenOn: moment().format(DatePickerOptions.datePicker.dateInputFormat),
      givenBy: '',
      givenByName: this.appraiseeName,
      appraisalMode: this.appraisal.mode === "objective" ? 1 : this.appraisal.mode === 'appraisal' ? 3 : 2
    };

    this.appraisal.feedbacks.push(newFeedback);
  }

  saveSelfObjectives() {
    this.isSelfProcessing = true;
    const payload: SaveAppraisalSelfRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      isSelf: this.isSelf,
      selfAnswers: this.appraisal.selfAnswers,
      employeeId: this.employeeId
    };

    this.employeeService.saveAppraisalSelfAnswers(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAppraisalDetails();
          this.toaster.success('Appraisal self objectives saved successfully. ');
        }
      })
      .finally(() => {
        this.isSelfProcessing = false;
      })
  }

  saveRecommendedFitmentOrPromotion() {
    this.isSelfProcessing = true;
    const payload: SaveAppraisalSelfRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      isSelf: this.isSelf,
      selfAnswers: this.appraisal.selfAnswers,
      employeeId: this.employeeId,
      isPromotionRecommended: this.appraisal.isPromotionRecommended,
      isFitmentRecommended: this.appraisal.isFitmentRecommended
    };

    this.employeeService.saveRecommendedFitmentOrPromotion(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAppraisalDetails();
          this.toaster.success('Appraisal Recommended for Fitment/Promotion saved successfully. ');
        }
      })
      .finally(() => {
        this.isSelfProcessing = false;
      })
  }

  saveBusinessNeeds() {
    this.isSelfProcessing = true;
    const payload: SaveAppraisalBusinessNeedsRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      isSelf: this.isSelf,
      businessNeeds: this.appraisal.businessNeeds,
      employeeId: this.employeeId
    };
    this.employeeService.saveAppraisalBusinessNeeds(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAppraisalDetails();
          this.toaster.success('Appraisal business needs saved successfully. ');
        }
      })
      .finally(() => {
        this.isSelfProcessing = false;
      })
  }

  copyEmployeeTrainings() {
    this.appraisal.rmTrainings = this.appraisal.selfTrainings;
    this.appraisal.rmTrainingSelections = this.appraisal.selfTrainingSelections;
  }

  saveTrainings() {
    this.isTrainingProcessing = true;
    const trainings = this.isSelf
      ? this.appraisal.selfTrainings
      : this.appraisal.rmTrainings;

    const payload: SaveAppraisalTrainingRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      isSelf: this.isSelf,
      employeeId: this.employeeId,
      trainings: trainings,
      comments: this.appraisal.trainingComments
    };
    this.employeeService.saveAppraisalTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAppraisalDetails();
          this.toaster.success('Appraisal trainings saved successfully. ');
        }
      })
      .finally(() => {
        this.isTrainingProcessing = false;
      })
  }

  saveOrgObjectives() {
    this.isOrgProcessing = true;
    const payload: SaveAppraisalOrganizationRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      isSelf: this.isSelf,
      employeeId: this.employeeId,
      questions: this.appraisal.questions
    };
    this.employeeService.saveAppraisalOrgAnswers(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAppraisalDetails();
          this.toaster.success('Appraisal organizational objectives saved successfully. ');
        }
      })
      .finally(() => {
        this.isOrgProcessing = false;
      })
  }

  saveAppraisalFeedback() {
    const feedback = this.appraisal.feedbacks.find(f => f.appraiseeType === this.appraiseeType);
    if (feedback) {
      this.isCommentProcessing = true;
      const paylod: UpdateFeedbackRequest = {
        appraiseeType: this.appraiseeType,
        employeeAppraisalId: this.appraisal.employeeAppraisalId,
        employeeFeedbackId: feedback.employeeFeedbackId,
        employeeId: this.employeeId,
        feedback: feedback.feedback,
        appraisalMode: this.appraisal.mode === "objective" ? 1 :this.appraisal.mode === "appraisal" ? 3 : 2
      };
      this.employeeService.updateFeedback(paylod)
        .then((response: UpdateAppraisalFeedbackResponse) => {
          if (response.isSuccess) {
            this.appraisal.feedbacks = response.feedbacks;
            this.getAppraisalDetails();
            this.toaster.success('The appraisal comment has been saved successfully.');
          }
        })
        .finally(() => {
          this.isCommentProcessing = false;
        })
    }
  }

  submitAppraisalSelfAlert(selfForm: NgForm, orgForm: NgForm, feedbackForm: NgForm, businessNeedForm: NgForm, mode: string) {
    let isValid = false

    this.appraisalCopy = JSON.parse(JSON.stringify(this.appraisal));
    const isSelfWeightageDone = this.appraisalCopy.selfAnswers.length > 0
      ? this.appraisalCopy.selfAnswers.map(v => v.weightage).reduce((a, b) => a + b) === 100
      : false;

    if(mode === 'objective'){
      if(this.isSelf && selfForm.valid && feedbackForm.valid && isSelfWeightageDone){
        isValid = true;
      }
      if(!this.isSelf && feedbackForm.valid){
        isValid = true;
      }

      if(isValid) {
        this.alertData = {
          emoji: 'assets/emoji/smile.png',
          header: 'Submit Objective for Processing?',
          content: [
              'Please check the information entered in the forms before submitting.'
          ],
          confirmText: null,
          confirmButtonText: 'Submit Form',
          cancelButtonText: 'Dont Submit',
          onConfirm: this.submitObjectiveSelf,
        };
        this.subjectService.showSweetAlert(this.alertData, 'primary');
      }
      else {
        this.alertData = {
          emoji: 'assets/emoji/sad.png',
          header: 'Unfilled Objective Information?',
          content: [
            'Please check the information entered in the forms.',
            isSelfWeightageDone
              ? feedbackForm.valid
                ? ''
                : 'Enter a feedback for the appraisal process.'
              : 'Please make sure the total weightage for the Self Objectives is 100.',
            ,
            'Please verify the percentages of the weightage given for self objectives and if you have changed it, please save the details before you submit the objecitve for processing.',
          ],
          confirmText: null,
          confirmButtonText: 'Okay',
          showCancelButton: false,
          onConfirm: null
        };
        this.subjectService.showSweetAlert(this.alertData, 'danger');
      }
      return;
    }

    const internalDone = this.isSelf ? this.appraisal.internalSelf : this.appraisal.internalMgmt;

    const businessNeedDone = this.appraisalCopy.businessNeeds.length > 0
      ? this.appraisalCopy.businessNeeds.map(v => v.weightage).reduce((a, b) => a + b) <= 10
      && this.appraisalCopy.businessNeeds.map(v => v.selfWeightage).reduce((a, b) => a + b) <= 10
      && this.appraisalCopy.businessNeeds.map(v => v.managementWeightage).reduce((a, b) => a + b) <= 10
      && this.appraisalCopy.businessNeeds.map(v => v.l2Weightage).reduce((a, b) => a + b) <= 10
      : false;

    if(mode === 'objective' && selfForm.valid && feedbackForm.valid){
      isValid = true;
    }
    else if (selfForm.valid && orgForm.valid && feedbackForm.valid && businessNeedForm.valid) {

      if (isSelfWeightageDone && internalDone) {
        isValid = true;
      } else {
        isValid = false;
      }

    } else {
      isValid = false;
    }

    if (isValid) {
      this.alertData = {
        emoji: 'assets/emoji/smile.png',
        header: mode === 'objective' ? 'Submit Objective for Processing?'  : 'Submit Appraisal for Processing?',
        content: [
          this.isSelf
            ? 'Please check the information entered in the forms before submitting. Once submitted, the changes cannot be undone and it will be sent over to the Apprasing Manager for verfification and adding management comments and weightages.'
            : 'Please check the information entered in the forms before submitting. Once submitted, the changes cannot be undone and it will be sent over to the HR Manager for verfification and setting the Rating for the employee.'
        ],
        confirmText: null,
        confirmButtonText: 'Submit Form',
        cancelButtonText: 'Dont Submit',
        onConfirm: this.submitAppraisalSelf,
      };
      this.subjectService.showSweetAlert(this.alertData, 'primary');
    } else {

      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Unfilled Appraisal Information?',
        content: [
          'Please check the information entered in the forms.',
          isSelfWeightageDone
            ? internalDone
               ? feedbackForm.valid
                 ? ''
                 : 'Enter a feedback for the appraisal process.'
               : 'Please make sure the entered a value for the Internal.'
            : 'Please make sure the total weightage for the Self Objectives is 100.',
          ,
          'Please verify the percentages of the weightage given for self objectives and if you have changed it, please save the details before you submit the appraisal for processing.',
        ],
        confirmText: null,
        confirmButtonText: 'Okay',
        showCancelButton: false,
        onConfirm: null
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

  submitAppraisalRating() {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Submit Appraisal Rating?',
      content: [
        'Please check the rating chosen for the employee. Once the rating is finalized and processed, it cannot be changed.',
        'Please make sure you check the rating and the comments before proceeding.'
      ],
      confirmText: null,
      confirmButtonText: 'Choose Rating',
      cancelButtonText: 'Dont Choose',
      onConfirm: this.submitRating,
    };
    this.subjectService.showSweetAlert(this.alertData, 'primary');
  }

  chooseRating(item: AppraisalRating) {
    if(this.isHr && !this.isSelf && !this.isHrSubmitted) {
      this.appraisal.rating = item.ratingId;
      return;
    }
    
    if (!this.isSelf && !this.isHrSubmitted && this.averageScore >= 110 && item.score >= 110) {
      this.appraisal.rating = item.ratingId;
    }
  }

  saveInternalObjective() {
    this.isInternalProcessing = true;
    const payload: SaveAppraisalInternalRequest = {
      employeeAppraisalId: this.appraisal.employeeAppraisalId,
      isSelf: this.isSelf,
      employeeId: this.employeeId,
      weightage: this.isSelf ? this.appraisal.internalSelf : this.isL2Manager ? this.appraisal.internalL2 : this.appraisal.internalMgmt
    };
    this.employeeService.saveAppraisalInternalAnswers(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAppraisalDetails();
          this.toaster.success('Appraisal internal objectives saved successfully. ');
        }
      })
      .finally(() => {
        this.isInternalProcessing = false;
      })
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }

    return item;
  }
  printPage() {
    window.print();
  }
}
