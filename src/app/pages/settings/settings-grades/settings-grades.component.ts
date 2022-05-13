import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanyGrade, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-grades',
  templateUrl: './settings-grades.component.html',
  styleUrls: ['./settings-grades.component.scss']
})
export class SettingsGradesComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('grades') grades: CompanyGrade[] = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('gradeModal', { static: false }) gradeModal: CustomModalComponent;

  tempId = 0;
  isAdded = false;
  isUpdating = false;
  isProcessing = false;
  dtTrigger = new Subject<any>();
  activeGrades: CompanyGrade[] = [];
  dtOptions: DataTables.Settings = {};
  grade: CompanyGrade = new CompanyGrade();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('grades');
    this.grades = this.settingsService.getCompanySettingsValue().grades;

    if (!this.grades) {
      this.grades = [];
    }
    this.setActiveGrades();
    
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 3
        },
      ]
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private delete = (item: CompanyGrade) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveGrades();
    this.updateCompanySettings('delete');
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Grades', this.grades)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company grade details successfully.');
          } else {
            this.toaster.success('Company grade deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.grades = response.grades;
          this.setActiveGrades();
         
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isAdded = false;
    form.reset();
    this.isUpdating = false;
    this.grade = new CompanyGrade();
    this.gradeModal.showModal();
  }

  addOrUpdate() {
    const grade = Object.assign({}, this.grade);

    const activeOthers = this.activeGrades.filter(a =>
      grade.gradeId
        ? a.gradeId !== grade.gradeId
        : a.tempId
          ? a.tempId !== grade.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.grade.trim().toLowerCase() === grade.grade.trim().toLowerCase())
      ? true
      : false;
    if (!this.isAdded) {
      if (!this.isUpdating) {
        grade.isActive = true;
        grade.employeesCount = 0;
        grade.tempId = ++this.tempId;
        this.grades.push(grade);
        this.setActiveGrades();
      } else {
        if (grade.gradeId) {
          const addedGrade = this.grades.find(l => l.gradeId === grade.gradeId);
          if (addedGrade) {
            addedGrade.grade = grade.grade;
            addedGrade.description = grade.description;
          }
        } else {
          const addedGrade = this.grades.find(l => l.tempId === grade.tempId);
          if (addedGrade) {
            addedGrade.grade = grade.grade;
            addedGrade.description = grade.description;
          }
        }
      }

      this.updateCompanySettings('edit');
      this.gradeModal.hideModal();
    }
  }

  edit(item: CompanyGrade) {
    this.isAdded = false;
    this.isUpdating = true;
    this.grade = Object.assign({}, item);
    this.gradeModal.showModal();
  }

  setActiveGrades() {
    this.grades = this.grades.filter(i => i.gradeId || (!i.gradeId && i.isActive));
    this.activeGrades = this.grades.filter(i => i.isActive);
  }

  deleteAlert(item: CompanyGrade) {
    if (item.employeesCount && item.employeesCount > 0) {
      this.toaster.error('There are employees assigned to this grade. You can delete a grade only when there are no employees in the grade.');
    } else {
      this.alertData = {
        emoji: 'assets/emoji/sad.png',
        header: 'Delete Grade?',
        content: [
          'When you delete a grade, it will be removed from the list of all the grades and this action cannot be undone.',
          'Please click the save grades button in the bottom to save the changes made.'
        ],
        confirmText: null,
        confirmButtonText: 'Delete Grade',
        cancelButtonText: 'Dont Delete',
        onConfirm: this.delete,
        data: item
      };
      this.subjectService.showSweetAlert(this.alertData, 'danger');
    }
  }

}
