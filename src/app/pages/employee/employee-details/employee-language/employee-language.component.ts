import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EmployeeActionRequest,
  EmployeeDataVerificationRequest,
  EmployeeLanguage,
  EmployeeLanguageResponse,
  UpdateEmployeeLanguageRequest,
} from '../employee-details.model';
import { Languages, SelectionConstants } from './../../../../app.constants';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { NgForm } from '@angular/forms';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SelectOption } from './../../../../app.model';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-language',
  templateUrl: './employee-language.component.html',
  styleUrls: ['./employee-language.component.scss']
})
export class EmployeeLanguageComponent implements OnInit {

  @ViewChild('languageForm', { static: false }) languageForm: NgForm;
  @ViewChild('languageModal', { static: false }) languageModal: CustomModalComponent;

  role = '';
  icon = '';
  tempId = 0;
  isAdded = false;
  canEdit = false;
  employeeId = '';
  isUpdating = false;
  isProcessing = false;
  language: EmployeeLanguage;
  languages: EmployeeLanguage[] = [];
  languageOptions: SelectOption[] = [];
  availableLanguages = Languages.languages;
  activeLanguages: EmployeeLanguage[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();
  languageProficiencyOptions = SelectionConstants.languageProficiencyOptions;

  loggedInUserScreen = true;
  haveAccess: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = this.role === 'hr' || this.role === 'self';
    this.icon = this.employeeService.getSectionTypeIcon('language');
    this.employeeId = this.employeeService.getEmployeeId();
    this.getEmployeeLanguages();

    this.availableLanguages.map(l => {
      this.languageOptions.push({
        label: l,
        value: l
      })
    })
  }

  private delete = (item: EmployeeLanguage) => {
    item.isActive = false;
    this.setActiveLanguages();
    this.updateEmployeeLanguages();
  }

  setActiveLanguages() {
    this.languages = this.languages.filter(i => i.employeeLanguageId || (!i.employeeLanguageId && i.isActive));
    this.activeLanguages = this.languages.filter(i => i.isActive);
    this.activeLanguages.map(l => {
      l.levelSelection = this.languageProficiencyOptions.find(p => p.value === l.level);
    });
  }

  findAccess(data: EmployeeLanguageResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeLanguages() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeLanguage(payload)
      .then((response: EmployeeLanguageResponse) => {
        if (response.isSuccess) {
          this.languages = response.employeeLanguage;
          this.findAccess(response);
          this.setActiveLanguages();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  updateEmployeeLanguages() {
    this.isProcessing = true;
    const payload: UpdateEmployeeLanguageRequest = {
      employeeId: this.employeeId,
      employeeLanguage: this.languages
    };
    this.employeeService.updateEmployeeLanguage(payload)
      .then((response: EmployeeLanguageResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated employee language details successfully.');
          this.employeeService.getEmployeeVerificationSubject.next();
          this.languages = response.employeeLanguage;
          this.setActiveLanguages();
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isUpdating = false;
    this.language = new EmployeeLanguage();
    if (form) {
      form.reset();
    }
    this.languageModal.showModal();
  }

  edit(item: EmployeeLanguage) {
    this.isUpdating = true;
    this.language = Object.assign({}, item);
    this.languageModal.showModal();
  }

  addOrUpdate() {
    const language = Object.assign({}, this.language);

    const activeOthers = this.activeLanguages.filter(a =>
      language.employeeLanguageId
        ? a.employeeLanguageId !== language.employeeLanguageId
        : a.tempId
          ? a.tempId !== language.tempId
          : true);

    this.isAdded = activeOthers.find(a => a.language.trim().toLowerCase() === language.language.trim().toLowerCase())
      ? true
      : false;

    if (!this.isAdded) {
      if (!this.isUpdating) {
        language.isActive = true;
        language.tempId = ++this.tempId;
        this.languages.push(language);
        this.setActiveLanguages();
      } else {
        if (language.employeeLanguageId) {
          const addedLanguage = this.languages.find(l => l.employeeLanguageId === language.employeeLanguageId);
          if (addedLanguage) {
            addedLanguage.language = language.language;
            addedLanguage.canSpeak = language.canSpeak ? language.canSpeak : false;
            addedLanguage.canWrite = language.canWrite ? language.canWrite : false;
            addedLanguage.canRead = language.canRead ? language.canWrite : false;
            addedLanguage.level = language.level;
          }
        } else {
          const addedLanguage = this.languages.find(l => l.tempId === language.tempId);
          if (addedLanguage) {
            addedLanguage.language = language.language;
            addedLanguage.canSpeak = language.canSpeak ? language.canSpeak : false;
            addedLanguage.canWrite = language.canWrite ? language.canWrite : false;
            addedLanguage.canRead = language.canRead ? language.canWrite : false;
            addedLanguage.level = language.level;
          }
        }
      }

      this.updateEmployeeLanguages();
      this.languageModal.hideModal();
    }
  }

  deleteAlert(item: EmployeeLanguage) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Language?',
      content: [
        'Once you have deleted the added language information it cannot be undone. Please check before you proceed.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Language',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  verifyChanges() {
    this.isProcessing = true;
    const payload: EmployeeDataVerificationRequest = {
      employeeId: this.employeeService.getEmployeeId(),
      section: 'language'
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
