import {
  CreateEmployeeRequest,
  EmployeeActionRequest,
  EmployeeCompensationRequest,
  EmployeeDataVerificationRequest,
  EmployeeDocumentActionRequest,
  EmployeeExitAssetRequest,
  EmployeeExitForm,
  EmployeeListFilterRequest,
  EmployeeResignationRequest,
  ExitFormRequest,
  GetCompanyTrainingsRequest,
  HODFeedbackForm,
  HrFeedbackForm,
  RehireEmployeeRequest,
  SaveAppraisalBusinessNeedsRequest,
  SaveAppraisalInternalRequest,
  SaveAppraisalOrganizationRequest,
  SaveAppraisalRatingRequest,
  SaveAppraisalSelfRequest,
  SaveAppraisalTrainingRequest,
  SubmitAppraisalRequest,
  UpdateEmployeeAccountRequest,
  UpdateEmployeeAssetRequest,
  UpdateEmployeeAssetSigningRequest,
  UpdateEmployeeBankRequest,
  UpdateEmployeeCareerRequest,
  UpdateEmployeeCompanyRequest,
  UpdateEmployeeContactRequest,
  UpdateEmployeeEducationRequest,
  UpdateEmployeeExit,
  UpdateEmployeeExitAsset,
  UpdateEmployeeFamilyRequest,
  UpdateEmployeeLanguageRequest,
  UpdateEmployeePersonalRequest,
  UpdateEmployeePreviousCompanyRequest,
  UpdateEmployeeReferenceRequest,
  UpdateEmployeeStatutoryRequest,
  UpdateFeedbackRequest,
  UploadEmployeeDocumentRequest
} from './employee-details/employee-details.model';
import {
  FillAttendanceRequest,
  SubmitFeedbackRequest,
  TrainingActionRequest,
  UpdateTrainingNomineeRequest,
} from '../training/training.model';
import { MarkNotificationReadRequest, UploadFile } from 'src/app/app.model';

import { AppApiEndpoints } from 'src/app/app.constants';
import { EmployeeSections } from './employee-details/employee-details.constant';
import { HttpService } from 'src/app/shared/services/http-service';
import { Injectable } from '@angular/core';
import { PasswordChangeRequest } from 'src/app/shared/layout/menu-bar/menu-bar.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  role = '';
  employeeId = '';
  employeeSections = EmployeeSections.sections;
  getEmployeeVerificationSubject = new Subject();

  constructor(
    private httpService: HttpService
  ) { }

  setEmployeeId(employeeId: string) {
    this.employeeId = employeeId;
  }

  setCurrentUserRole(role: string) {
    this.role = role;
  }

  getCurrentUserRole() {
    return this.role;
  }

  getEmployeeId() {
    return this.employeeId;
  }

  getSectionTypeIcon(type: string) {
    return this.employeeSections.find(s => s.type === type).icon;
  }


  getRolesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getRolesForDropdown, null, false);
  }

  getAssetsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getAssetTypesForDropdown, null, false);
  }

  getDocumentTypesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getDocumentTypesForDropdown, null, false);
  }

  getTeamsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTeamsForDropdown, null, false);
  }

  getRegionsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getRegionsForDropdown, null, false);
  }

  getDesignationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getDesignationsForDropdown, null, false);
  }

  getGradesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getGradesForDropdown, null, false);
  }

  getCategoriesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getCategoriesForDropdown, null, false);
  }

  getDepartmentsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getDepartmentsForDropdown, null, false);
  }

  getLocationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getLocationsForDropdown, null, false);
  }

  getReportingToForDropdown(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeesForReportingDropdown, payload, false);
  }

  getAppraisalRatings() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getAppraisalRatings, null, false);
  }

  getTrainingsForDropdown(payload: GetCompanyTrainingsRequest) {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTrainingsForDropdown, payload, false);
  }

  getTrainingCodeForDropdown(payload: GetCompanyTrainingsRequest) {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTrainingCodeForDropdown, payload, false);
  }


  changePassword(payload: PasswordChangeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.changePassword, payload, false);
  }

  getEmployeeAccount(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeAccount, payload, false);
  }

  getEmployeePersonal(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeePersonal, payload, false);
  }

  getEmployeeCompany(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeCompany, payload, false);
  }

  getEmployeeStatutory(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeStatutory, payload, false);
  }

  getEmployeeDocuments(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeDocuments, payload, false);
  }

  getEmployeeBanks(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeBanks, payload, false);
  }

  getEmployeeContacts(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeContacts, payload, false);
  }

  getEmployeeAppraisalDetails(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeAppraisalDetails, payload, false);
  }

  getEmployeeAppraisalReport(payload: SubmitAppraisalRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeAppraisalReport, payload, false);
  }

  getEmployeeSingleAppraisalDetails(payload: SubmitAppraisalRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeSingleAppraisalDetails, payload, false);
  }

  getEmployeeDataVerification(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeDataVerification, payload, false);
  }

  getEmployeeReportees(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeReportees, payload, false);
  }

  getEmployeeCompensation(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeCompensation, payload, false);
  }


  getEmployeePreviousCompany(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeePreviousCompany, payload, false);
  }

  getEmployeeFamily(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeFamily, payload, false);
  }

  getEmployeeEducation(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeEducation, payload, false);
  }

  getEmployeeLanguage(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeLanguage, payload, false);
  }

  getEmployeeReference(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeReference, payload, false);
  }

  getEmployeeAssets(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeAssets, payload, false);
  }

  getEmployeeAssetsSigning(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeAssetSignings, payload, false);
  }

  getEmployeesBaseInfo() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeesForDropdown, null, false);
  }

  getAllEmployees(payload: EmployeeListFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployees, payload, false);
  }

  checkIfEmployeeExist(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.checkIfEmployeeExist, payload, false);
  }

  getTrainingDetails(payload: TrainingActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.trainingRoute.getTrainingDetails, payload, false);
  }


  createNewEmployee(payload: CreateEmployeeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.createNewEmployee, payload, false);
  }

  rehireEmployee(payload: RehireEmployeeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.copyNewEmployee, payload, false);
  }

  updateEmployeeAccount(payload: UpdateEmployeeAccountRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeAccount, payload, false);
  }

  updateEmployeeBank(payload: UpdateEmployeeBankRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeBank, payload, false);
  }

  updateEmployeeAssets(payload: UpdateEmployeeAssetRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeAsset, payload, false);
  }

  updateEmployeeAssetSignings(payload: UpdateEmployeeAssetSigningRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeAssetSignings, payload, false);
  }


  updateEmployeePersonal(payload: UpdateEmployeePersonalRequest, file: File) {
    const files: UploadFile[] = [];
    if (file) {
      files.push({
        file: file,
        name: 'Photo'
      });
    }
    return this.httpService.postMethodWithFile(AppApiEndpoints.employeeRoute.updateEmployeePersonal, payload, files);
  }

  updateEmployeeCompany(payload: UpdateEmployeeCompanyRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeCompany, payload, false);
  }

  updateEmployeeStatutory(payload: UpdateEmployeeStatutoryRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeStatutory, payload, false);
  }

  updateEmployeePreviousCompany(payload: UpdateEmployeePreviousCompanyRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeePreviousCompany, payload, false);
  }

  updateEmployeeContact(payload: UpdateEmployeeContactRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeContact, payload, false);
  }

  updateEmployeeFamily(payload: UpdateEmployeeFamilyRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeFamily, payload, false);
  }

  updateEmployeeEducation(payload: UpdateEmployeeEducationRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeEducation, payload, false);
  }

  updateEmployeeLanguage(payload: UpdateEmployeeLanguageRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeLanguage, payload, false);
  }

  updateEmployeeReference(payload: UpdateEmployeeReferenceRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeReference, payload, false);
  }

  convertEmployeeToOnRoll(payload: EmployeeActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.convertEmployeeToOnRoll, payload, false);
  }

  deleteEmployee(payload: EmployeeActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.deleteEmployee, payload, false);
  }

  toggleEmployeeLogin(payload: EmployeeActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.toggleEmployeeLogin, payload, false);
  }

  uploadEmployeeDocument(payload: UploadEmployeeDocumentRequest) {
    const files: UploadFile[] = [];
    if (payload.file) {
      files.push({
        file: payload.file,
        name: 'document'
      });
    }
    payload.file = null;
    return this.httpService.postMethodWithFile(AppApiEndpoints.employeeRoute.updateEmployeeDocument, payload, files);
  }

  deleteEmployeeDocument(payload: EmployeeDocumentActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.deleteEmployeeDocument, payload, false);
  }

  saveAppraisalBusinessNeeds(payload: SaveAppraisalBusinessNeedsRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveAppraisalAnswers, payload, false);
  }

  saveAppraisalSelfAnswers(payload: SaveAppraisalSelfRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveAppraisalAnswers, payload, false);
  }

  saveAppraisalOrgAnswers(payload: SaveAppraisalOrganizationRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveAppraisalAnswers, payload, false);
  }

  saveRecommendedFitmentOrPromotion(payload: SaveAppraisalSelfRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveRecommendedFitmentOrPromotion, payload, false);
  }

  saveAppraisalTraining(payload: SaveAppraisalTrainingRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveAppraisalTrainings, payload, false);
  }

  saveAppraisalInternalAnswers(payload: SaveAppraisalInternalRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveAppraisalInternalAnswers, payload, false);
  }

  submitAppraisal(payload: SubmitAppraisalRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.submitAppraisalAnswers, payload, false);
  }

  submitObjective(payload: SubmitAppraisalRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.submitObjective, payload, false);
  }

  updateFeedback(payload: UpdateFeedbackRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateFeedback, payload, false);
  }

  saveAppraisalRating(payload: SaveAppraisalRatingRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveAppraisalRating, payload, false);
  }

  getEmployeeReportingTo(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeReportingToAppraisal, payload, false);
  }

  getAllAppraisalsPendingWithHr(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllAppraisalsPendingWithHr, payload, false);
  }


  getRecentNotifications() {
    return this.httpService.getMethod(AppApiEndpoints.notificationRoute.getRecentNotifications, null, false);
  }

  getAllNotifications() {
    return this.httpService.getMethod(AppApiEndpoints.notificationRoute.getAllNotifications, null, false);
  }

  markNotificationsAsRead(payload: MarkNotificationReadRequest) {
    return this.httpService.postMethod(AppApiEndpoints.notificationRoute.markReadNotifications, payload, false);
  }


  verifyEmployeeDataUpdate(payload: EmployeeDataVerificationRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.verifyEmployeeDataUpdate, payload, false);
  }

  getEmployeeOrgChart(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeOrgChart, payload, false);
  }


  updateEmployeeCompensation(payload: EmployeeCompensationRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeCompensation, payload, false);
  }


  getEmployeeTrainings(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeTrainings, payload, false);
  }


  getAllTrainingTypes() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTrainingsForDropdown, null, false);
  }

  getAllTrainingCode() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTrainingCodeForDropdown, null, false);
  }

  startTraining(payload: TrainingActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.startTraining, payload, false);
  }

  acceptTraining(payload: UpdateTrainingNomineeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.acceptTraining, payload, false);
  }

  rejectTraining(payload: UpdateTrainingNomineeRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.rejectTraining, payload, false);
  }

  fillAttendance(payload: FillAttendanceRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.fillAttendance, payload, false);
  }

  completeTraining(payload: TrainingActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.completeTraining, payload, false);
  }

  submitFeedback(payload: SubmitFeedbackRequest) {
    return this.httpService.postMethod(AppApiEndpoints.trainingRoute.submitFeedback, payload, false);
  }

  submitResignation(payload: EmployeeResignationRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.initiateEmployeeResignation, payload, false);
  }

  updateEmployeeExit(payload: UpdateEmployeeExit) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeResignation, payload, false);
  }

  getEmployeeResignationDetails() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeExits, null, false);
  }

  getMyReporteesResignationDetails() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeeExitRequest, null, false);
  }

  getEmployeeRehire() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeRehire, null, false);
  }

  saveEmployeeExitForm(payload: EmployeeExitForm) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveEmployeeExitForm, payload, false);
  }

  saveHRFeedBackForm(payload: HrFeedbackForm) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveHRFeedBackForm, payload, false);
  }

  saveHODFeedBackForm(payload: HODFeedbackForm) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.saveHODFeedBackForm, payload, false);
  }

  getEmployeeExitForm(payload: ExitFormRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeExitForm, payload, false)
  }

  getHODFeedBackForm(payload: ExitFormRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getHODFeedBackForm, payload, false);
  }

  getHRFeedBackForm(payload: ExitFormRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getHRFeedBackForm, payload, false);
  }

  getAllEmployeeExitWithAssets() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeeExitWithAssets, null, false);
  }

  getExitEmployeeAssetDetails(payload: ExitFormRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getExitEmployeeAssetDetails, payload, false);
  }

  updateExitEmployeeAssetDetails(payload: UpdateEmployeeExitAsset) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateExitEmployeeAssetDetails, payload, false);
  }

  getEmployeeCareerDetails(payload: EmployeeActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getEmployeeCareerDetails, payload, false);
  }

  updateEmployeeCareerDetail(payload: UpdateEmployeeCareerRequest) {
    return this.httpService.postMethod(AppApiEndpoints.employeeRoute.updateEmployeeCareerDetail, payload, false);
  }
}
