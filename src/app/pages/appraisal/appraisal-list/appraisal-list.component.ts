import * as _ from 'lodash';
import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import {
  Appraisal,
  AppraisalActionRequest,
  AppraisalFilterRequest,
  AppraisalQuestion,
  GetAppraisalQuestionResponse,
  GetAppraisalsResponse,
  UpdateAppraisaQuestion,
  UpdateAppraisalRequest,
} from './../appraisal.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableParameters, DatePickerOptions } from 'src/app/app.constants';
import { SelectOption, SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';

import { AppraisalService } from '../appraisal.service';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ObjectToUrlService } from 'src/app/shared/services/obj-to-url-service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appraisal-list',
  templateUrl: './appraisal-list.component.html',
  styleUrls: ['./appraisal-list.component.scss']
})
export class AppraisalListComponent implements OnInit {

  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;
  @ViewChild('appraisalModal', { static: false }) appraisalModal: CustomModalComponent;

  isLive = false;
  isUpdating = false;
  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;
  isPercentageError = false;
  appraisals: Appraisal[] = [];
  isAppraisalForGradeAdded = false;
  gradeOptions: SelectOption[] = [];
  dtOptions: DataTables.Settings = {};
  questions: AppraisalQuestion[] = [];
  questionsOptions: SelectOption[] = [];
  defaultFilter: AppraisalFilterRequest;
  appraisalFilter: AppraisalFilterRequest;
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  newAppraisal: UpdateAppraisalRequest = new UpdateAppraisalRequest();
  calculationMethod: SelectOption[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private appraisalService: AppraisalService,
    private objToUrlService: ObjectToUrlService
  ) { }

  ngOnInit() {
    this.defaultFilter = {
      title: '',
      startDate: '',
      endDate: '',
      grades: []
    };

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 5
        },
      ]
    });

    this.newAppraisal.questions = [];
    this.calculationMethod = [
      {
        label: "Method 1",
        value: "Method1"
      },
      {
        label: "Method 2",
        value: "Method2"
      },
      {
        label: "Method 3",
        value: "Method3"
      }
    ];
    
    this.setFilterParametersFromUrl();
    this.getGradeOptions();
    this.getAppraisalQuestions();
    
  }

  private deleteAppraisal = (item: Appraisal) => {
    this.subjectService.toggleLoading(true);
    const payload: AppraisalActionRequest = {
      appraisalId: item.appraisalId
    };
    this.appraisalService.deleteAppraisal(payload)
      .then((response: GetAppraisalsResponse) => {
        if (response.isSuccess) {
          this.getAppraisalList();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private addNewAppraisal = (form: NgForm) => {
    const activeOthers = this.appraisals.filter(a => a.appraisalId !== this.newAppraisal.appraisalId);
    this.isAppraisalForGradeAdded = activeOthers.find(a => a.title.trim().toLowerCase() === this.newAppraisal.title.trim().toLowerCase())
      ? true
      : false;

    if (!this.isAppraisalForGradeAdded) {

      const totalPercentage = this.newAppraisal.questions.map(q => q.percentage).reduce((a, b) => a + b);
      if (totalPercentage === 100) {
        var startDate = moment(this.newAppraisal.startDate).format(this.datePickerOptions.dateInputFormat);
        var endDate = moment(this.newAppraisal.endDate).format(this.datePickerOptions.dateInputFormat);
        var eligibleFrom = moment(this.newAppraisal.eligibleFrom).format(this.datePickerOptions.dateInputFormat);
        var eligibleTo = moment(this.newAppraisal.eligibleTo).format(this.datePickerOptions.dateInputFormat);

        this.newAppraisal.startDate = moment(startDate).add(10, 'hours').format(this.datePickerOptions.dateTimeFormat);
        this.newAppraisal.endDate = moment(endDate).add(10, 'hours').format(this.datePickerOptions.dateTimeFormat);
        this.newAppraisal.eligibleFrom = moment(eligibleFrom).add(10, 'hours').format(this.datePickerOptions.dateTimeFormat);
        this.newAppraisal.eligibleTo = moment(eligibleTo).add(10, 'hours').format(this.datePickerOptions.dateTimeFormat);

        this.isProcessing = true;
        this.appraisalService.updateAppraisal(this.newAppraisal)
          .then((response: GetAppraisalsResponse) => {
            if (response.isSuccess) {
              if (!response.isGradeMismatch) {
                this.getAppraisalList();
                this.appraisalModal.hideModal();
              } else {
                this.toaster.error("The grades selected already have an active and open appraisal window. Please check and create new appraisal.");
              }
            }
          }).finally(() => {
            this.isProcessing = false;
          })
      } else {
        this.isPercentageError = true;
      }

    }
  }

  getAppraisalList() {
    this.subjectService.toggleLoading(true);
    this.appraisalService.getAllAppraisals(this.appraisalFilter)
      .then((response: GetAppraisalsResponse) => {
        if (response.isSuccess) {
          this.appraisals = response.appraisals;
          this.parseAppraisals();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getGradeOptions() {
    this.appraisalService.getGradesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.gradeOptions = response.options;
          this.parseAppraisals();
          this.setFilterSelections();
        }
      });
  }

  getAppraisalQuestions() {
    this.appraisalService.getAppraisalQuestions()
      .then((response: GetAppraisalQuestionResponse) => {
        if (response.isSuccess) {
          this.questions = response.appraisalQuestions;
          this.parseAppraisals();
        }
      });
  }

  resetQuestionOptions() {
    const selectQuestions: SelectOption[] = [];
    this.questions.map(q => {
      selectQuestions.push({
        label: q.question,
        value: q.questionId
      });
    });
    this.questionsOptions = selectQuestions;
  }

  parseAppraisals() {
    this.resetQuestionOptions();
    this.appraisals.map(a => {
      a.gradesSelected = this.gradeOptions.filter(g => a.grades.indexOf(g.value) >= 0);

      a.calculationMethodSelection = this.calculationMethod.find(c => c.value === a.calculationMethod);

      a.startDateText = moment(a.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat);
      a.startDate = a.startDate ?
        new Date(a.startDateText) : '';
      a.endDateText = moment(a.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat);
      a.endDate = a.endDate ?
        new Date(a.endDateText) : '';

      var FromDate = moment(a.eligibleFrom)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat);
      a.eligibleFrom = a.eligibleFrom ?
        new Date(FromDate) : '';

      var ToDate = moment(a.eligibleTo)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat);
      a.eligibleTo = a.eligibleTo ?
        new Date(ToDate) : '';

      a.eligbilityPeriod = [
        a.eligibleFrom,
        a.eligibleTo
      ]

      a.dateRangeSelection = [
        a.startDate,
        a.endDate
      ];

      a.questions.map(q => {
        const selectedQuestion = this.questions.find(a => a.questionId === q.questionId);
        q.questionSelection = this.questionsOptions.find(a => a.value === q.questionId);
        q.question = selectedQuestion.question;
        q.description = selectedQuestion.description;
      });

    });
  }

  addAppraisalModal(form: NgForm) {
    this.isUpdating = false;
    if (form) {
      form.reset();
    }
    this.newAppraisal = new UpdateAppraisalRequest();
    this.newAppraisal.questions = [];
    this.newAppraisal.gradesSelected = [{
      label: 'All Grades',
      value: ''
    }];
    this.newAppraisal.category = 'office';
    this.newAppraisal.mode = 'objective';
    this.newAppraisal.calculationMethodSelection = {
      label: "Method 1",
      value: "Method1"
    }
    this.newAppraisal.calculationMethod = 'Method1';
    this.appraisalModal.showModal();
  }

  showFilters() {
    this.filterModal.showModal();
  }

  onGradeSelect(grades: SelectOption[]) {
    if (grades && grades.length > 0) {
      this.newAppraisal.gradesSelected = this.newAppraisal.gradesSelected.filter(v => v.value !== '');
      this.newAppraisal.gradeIds = grades.map(m => m.value);
    } else {
      this.newAppraisal.gradesSelected = [{
        label: 'All Grades',
        value: ''
      }];
      this.newAppraisal.gradeIds = [];
    }
  }

  viewAppraisalDetails(item: Appraisal) {
    this.router.navigate(['/appraisals/' + item.appraisalId]);
  }

  deleteAppraisalAlert(item: Appraisal) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Appraisal?',
      content: [
        'Are you sure you want to delete the created appraisal window. Once deleted this action cannot be undone.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Appraisal',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.deleteAppraisal,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  edit(appraisal: Appraisal) {
    this.isUpdating = true;
    var grades = appraisal.grades && appraisal.grades.length > 0
      ? this.gradeOptions.filter(g => appraisal.grades.indexOf(g.value) >= 0)
      : [{
        label: 'All Grades',
        value: ''
      }];

    this.isLive = appraisal.isLive;

    this.newAppraisal = {
      appraisalId: appraisal.appraisalId,
      description: appraisal.description,
      endDate: appraisal.endDate,
      gradeIds: appraisal.grades,
      title: appraisal.title,
      gradesSelected: grades,
      startDate: appraisal.startDate,
      dateRangeSelection: appraisal.dateRangeSelection,
      questions: appraisal.questions,
      isLive: appraisal.isLive,
      showCalculation: appraisal.showCalculation,
      category: appraisal.category,
      mode: appraisal.mode,
      calculationMethod: appraisal.calculationMethod,
      calculationMethodSelection: appraisal.calculationMethodSelection,
      eligbilityPeriod: appraisal.eligbilityPeriod,
      year: appraisal.year,
      eligibleFrom: appraisal.eligibleFrom,
      eligibleTo: appraisal.eligibleTo
    };
    this.updateSelectableQuestions();
    this.appraisalModal.showModal();
  }

  onDateChosen($event) {
    if ($event) {
      this.newAppraisal.startDate = $event[0];
      this.newAppraisal.endDate = $event[1];
    }
  }

  onEligibilityDateChosen($event) {
    if($event){
      this.newAppraisal.eligibleFrom = $event[0];
      this.newAppraisal.eligibleTo = $event[1];
    }
  }

  addQuestion() {
    const totalPercentage = this.newAppraisal.questions.length > 0
      ? this.newAppraisal.questions.map(q => q.percentage).reduce((a, b) => a + b)
      : 0;
    const question: UpdateAppraisaQuestion = {
      percentage: totalPercentage >= 100 ? 0 : 10,
      description: '',
      question: '',
      questionId: ''
    };
    this.newAppraisal.questions.push(question);
  }

  onQuestionSelected(question: UpdateAppraisaQuestion, item: SelectOption) {
    const selectedQuestion = this.questions.find(q => q.questionId === item.value);
    question.questionId = item.value;
    question.question = selectedQuestion.question;
    question.description = selectedQuestion.description;

    this.updateSelectableQuestions();
  }

  updateSelectableQuestions() {
    const selectedQuestions = this.newAppraisal.questions.map(q => q.questionId);
    const selectableQuestions: SelectOption[] = [];
    this.questions.filter(q => selectedQuestions.indexOf(q.questionId) === -1)
      .map(s => {
        selectableQuestions.push({
          label: s.question,
          value: s.questionId
        });
      });
    this.questionsOptions = selectableQuestions;
  }

  deleteQuestion(question: UpdateAppraisaQuestion) {
    this.newAppraisal.questions = this.newAppraisal.questions.filter(q => q !== question);

    this.updateSelectableQuestions();
  }

  addNewAppraisalAlert(form: NgForm) {
    if (this.isUpdating) {
      this.alertData = {
        emoji: 'assets/emoji/neutral.png',
        header: 'Update Appraisal Details?',
        content: [
          'Are you sure you want to update the details of the appraisal?',
          'If you update the appraisal information, the already filled employee details will be deleted and recreated, so they have to start filling again.',
          'Please makre sure you want to update the Appraisal'
        ],
        confirmText: null,
        confirmButtonText: 'Update Appraisal',
        cancelButtonText: 'Dont Update',
        onConfirm: this.addNewAppraisal,
        data: form
      };
      this.subjectService.showSweetAlert(this.alertData, 'primary');
    } else {
      this.addNewAppraisal(form);
    }
  }

  selectMultiple(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }

    return item;
  }

  onFilterDateChosen($event) {
    if ($event) {
      this.appraisalFilter.startDate = $event[0];
      this.appraisalFilter.endDate = $event[1];
    }
  }

  applyFilter() {
    const filter = Object.assign({}, this.appraisalFilter);
    filter.startDate = moment(filter.startDate)
      .add(10, 'hours')
      .format(this.datePickerOptions.dateInputFormat);
    filter.endDate = moment(filter.endDate)
      .add(10, 'hours')
      .format(this.datePickerOptions.dateInputFormat);

    filter.gradesSelection = [];
    filter.dateRangeSelection = [];
    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.appraisalFilter);
    this.getAppraisalList();
    this.filterModal.hideModal();
  }

  clearFilter(form: NgForm) {
    this.appraisalFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.appraisalFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAppraisalList();
    this.filterModal.hideModal();
  }

  setFilterParametersFromUrl() {
    this.appraisalFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.appraisalFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.appraisalFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections() {
    this.appraisalFilter.dateRangeSelection = this.appraisalFilter.startDate ? [
      new Date(moment(this.appraisalFilter.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)),
      new Date(moment(this.appraisalFilter.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateTimeFormat)),
    ] : [];
    if (this.gradeOptions.length > 0) {
      this.appraisalFilter.gradesSelection =
        this.gradeOptions.filter(f => this.appraisalFilter.grades.find(d => d === f.value));

      this.getAppraisalList();
    }
  }
}