import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { AppraisalQuestion } from '../appraisal.model';
import { AppraisalService } from '../appraisal.service';
import { GetAppraisalQuestionResponse, UpdateAppraisalQuestionRequest } from './../appraisal.model';



@Component({
  selector: 'app-appraisal-questions',
  templateUrl: './appraisal-questions.component.html',
  styleUrls: ['./appraisal-questions.component.scss']
})
export class AppraisalQuestionsComponent implements OnInit {
  @Input('questions') questions: AppraisalQuestion[] = [];

  @ViewChild('questionModal', { static: false }) questionModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  activeQuestions: AppraisalQuestion[] = [];
  question: AppraisalQuestion = new AppraisalQuestion();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private appraisalService: AppraisalService
  ) { }

  ngOnInit() {
    if (!this.questions) {
      this.questions = [];
    }
    this.getAppraisalQuestions();
  }

  private delete = (item: AppraisalQuestion) => {
    item.isActive = false;
    item.appraisalsCount = 0;
    this.setActiveQuestions();
  }

  getAppraisalQuestions() {
    this.subjectService.toggleLoading(true);
    this.appraisalService.getAppraisalQuestions()
      .then((response: GetAppraisalQuestionResponse) => {
        if (response.isSuccess) {
          this.questions = response.appraisalQuestions;
          this.setActiveQuestions();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateAppraisalQuestions() {
    this.isProcessing = true;
    const payload: UpdateAppraisalQuestionRequest = {
      appraisalQuestions: this.questions
    };
    this.appraisalService.updateAppraisalQuestions(payload)
      .then((response: GetAppraisalQuestionResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated appraisal questions successfully.');
          this.questions = response.appraisalQuestions;
          this.setActiveQuestions();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isAdded = false;
    form.reset();
    this.isUpdating = false;
    this.question = new AppraisalQuestion();
    this.questionModal.showModal();
  }

  addOrUpdate() {
    const question = Object.assign({}, this.question);

    const activeOthers = this.activeQuestions.filter(a =>
      question.questionId
        ? a.questionId !== question.questionId
        : a.tempId
          ? a.tempId !== question.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.question.trim().toLowerCase() === question.question.trim().toLowerCase())
      ? true
      : false;

    if (!this.isAdded) {
      if (!this.isUpdating) {
        question.isActive = true;
        question.appraisalsCount = 0;
        question.tempId = ++this.tempId;
        this.questions.push(question);
        this.setActiveQuestions();
      } else {
        if (question.questionId) {
          const addedQuestion = this.questions.find(l => l.questionId === question.questionId);
          if (addedQuestion) {
            addedQuestion.question = question.question;
            addedQuestion.description = question.description;
          }
        } else {
          const addedQuestion = this.questions.find(l => l.tempId === question.tempId);
          if (addedQuestion) {
            addedQuestion.question = question.question;
            addedQuestion.description = question.description;
          }
        }
      }

      this.questionModal.hideModal();
    }
  }

  edit(item: AppraisalQuestion) {
    this.isAdded = false;
    this.isUpdating = true;
    this.question = Object.assign({}, item);
    this.questionModal.showModal();
  }

  setActiveQuestions() {
    this.questions = this.questions.filter(i => i.questionId || (!i.questionId && i.isActive));
    this.activeQuestions = this.questions.filter(i => i.isActive);
  }

  deleteAlert(item: AppraisalQuestion) {
    if (item.appraisalsCount && item.appraisalsCount > 0) {
      this.toaster.error('There are active appraisals that use this question. You can delete the question only when there are no active appraisals using this question.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Question?',
        content: [
          'When you delete a question, it will be removed from the list of all the questions and this action cannot be undone.',
          'Please click the save questions button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Question',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
