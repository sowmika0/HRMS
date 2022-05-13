import { SelectOption } from "src/app/app.model";

export class AccessResponse {
  hrAccess?: number;
  empAccess?: number;
  mgAccess?: number;
}
export class CreateEmployeeResponse {
  employeeId: string;
  isCreated: boolean;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeAccountResponse extends AccessResponse {
  employeeId: string;
  loginEmail: string;
  name: string;
  roleId: string;
  employeeCode: string;
  canLogin: boolean;
  status: string;
  offRoleCode: string;
  addressingName: string;
  uniqueCode: string;

  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;

  statusSelection?: SelectOption;
  roleSelection?: SelectOption;
}

export class EmployeePersonalResponse extends AccessResponse {
  employeeId: string;
  nationality: string;
  gender: string;
  bloodGroup: string;
  recordDob: Date | string;
  actualDob: Date | string;
  maritalStatus: string;
  marriageDate: Date | string;
  sports: string;
  specializedTraining: string;
  height: number;
  weight: number;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  photoUrl: string;
  photoLinkUrl: string;
  hideBirthday: boolean;

  recordDobDate?: Date;
  actualDobDate?: Date;
  marriageDateDate?: Date;
  nationalitySelection?: SelectOption;
  maritalStatusSelection?: SelectOption;
  bloodGroupSelection?: SelectOption;
}

export class EmployeeCompanyResponse extends AccessResponse {
  employeeId: string;
  status: string;
  employeeCode: string;
  offRoleCode: string;
  addressingName: string;
  regionId: string;
  departmentId: string;
  designationId: string;
  teamId: string;
  locationId: string;
  categoryId: string;
  gradeId: string;
  doj: Date | string;
  probationStartDate: Date | string;
  probationEndDate: Date | string;
  probationPeriod: number;
  confirmationRemarks: string;
  isConfirmed: boolean;
  confirmedOn: Date | string;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  locationBifurcation: string;
  vendor: string;
  reportingToId: string;
  probationDays: number;
  probationExtraDays: number;
  reportingToName: string;
  statusCategory: string;
  uniqueCode: string;
  isCircularManager: boolean;
  managerList: EmployeeCard[];
  locationForField: string;
  division: string;

  reportingToSelection?: EmployeeBaseInfo;
  statusSelection?: SelectOption;
  statusCategorySelection?: SelectOption;
  regionSelection?: SelectOption;
  departmentSelection?: SelectOption;
  designationSelection?: SelectOption;
  teamSelection?: SelectOption;
  gradeSelection?: SelectOption;
  locationSelection?: SelectOption;
  categorySelection?: SelectOption;
  divisionSelection?: SelectOption;
}

export class EmployeeStatutoryResponse extends AccessResponse {
  employeeId: string;
  panNumber: string;
  pfNumber: string;
  uanNumber: string;
  previousEmployeePensionNumber: string;
  aadharNumber: string;
  aadharName: string;
  drivingLicenseNumber: string;
  passportNumber: string;
  drivingLicenseValidity: string | Date;
  passportValidity: string | Date;
  esiNumber: string;
  licIdNumber: string;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeDocument {
  employeeDocumentId: string;
  isActive: boolean;
  documentTypeId: string;
  name: string;
  size: number;
  fileLocation: string;
  fileUrl: string;

  documentTypeSelection?: SelectOption;
}

export class EmployeeDocumentResponse extends AccessResponse {
  employeeId: string;
  employeeDocuments: EmployeeDocument[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  isAllowed: boolean;
}

export class EmployeeBank {
  employeeBankId: string;
  bankName: string;
  branch: string;
  accountType: string;
  accountNumber: string;
  ifscCode: string;
  isActive: boolean;
  effectiveDate: Date | string;

  accountTypeSelection?: SelectOption;
  tempId?: number;
}

export class EmployeeBankResponse extends AccessResponse {
  employeeId: string;
  employeeBanks: EmployeeBank[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeContactResponse extends AccessResponse {
  employeeId: string;
  presentAddress: EmployeeAddress;
  permanentAddress: EmployeeAddress;
  contactNumber: string;
  alternateContactNumber: string;
  personalEmail: string;
  officialEmail: string;
  officialContactNumber: string;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;

  permanentAddressSame?: boolean;
}

export class EmployeeFamily {
  employeeFamilyId: string;
  isActive: boolean;
  relation: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  dob: Date | string;
  occupation: string;
  isEmergencyContact: boolean;
  isDependant: boolean;
  isOptedForMediclaim: boolean;
  isAlive: boolean;
  gender: string;

  tempId?: number;
  relationSelection?: SelectOption;
}

export class EmployeeFamilyResponse extends AccessResponse {
  employeeId: string;
  employeeFamily: EmployeeFamily[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeEducation {
  employeeEducationId: string;
  isActive: boolean;
  institute: string;
  city: string;
  state: string;
  courseName: string;
  startedYear: number;
  completedYear: number;
  courseDuration: number;
  majorSubject: string;
  grade: string;
  courseType: string;
  percentage: number;

  courseTypeSelection?: SelectOption;
  tempId?: number;
}

export class EmployeeEducationResponse extends AccessResponse {
  employeeId: string;
  employeeEducation: EmployeeEducation[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeLanguage {
  employeeLanguageId: string;
  isActive: boolean;
  language: string;
  canSpeak: boolean;
  canWrite: boolean;
  canRead: boolean;
  level: string;

  tempId?: number;
  levelSelection?: SelectOption;
}

export class EmployeeLanguageResponse extends AccessResponse {
  employeeId: string;
  employeeLanguage: EmployeeLanguage[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeReference {
  employeeReferenceId: string;
  isActive: boolean;
  name: string;
  designation: string;
  company: string;
  phone: string;
  email: string;
  remarks: string;
  address: string;

  tempId?: number;
}

export class EmployeeReferenceResponse extends AccessResponse {
  employeeId: string;
  canAdd: boolean;
  employeeReference: EmployeeReference[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class CreateEmployeeRequest {
  name: string;
  status: string;
  officialEmail: string;
  roleId: string;
  canLogin: boolean;
  copyData: boolean;
  uniqueCode: string;

  roleSelection?: SelectOption;
}

export class UpdateEmployeeAccountRequest {
  employeeId: string;
  roleId: string;
  canLogin: boolean;
  status: string;
  offRoleCode: string;
  addressingName: string;
  employeeCode: string;
}

export class UpdateEmployeePersonalRequest {
  employeeId: string;
  nationality: string;
  gender: string;
  bloodGroup: string;
  recordDob: Date | string;
  actualDob: Date | string;
  maritalStatus: string;
  marriageDate: Date | string;
  sports: string;
  specializedTraining: string;
  height: number;
  weight: number;
  age: number;
}

export class UpdateEmployeeCompanyRequest {
  employeeId: string;
  status: string;
  employeeCode: string;
  offRoleCode: string;
  addressingName: string;
  regionId: string;
  departmentId: string;
  designationId: string;
  teamId: string;
  locationId: string;
  categoryId: string;
  gradeId: string;
  doj: Date | string;
  probationStartDate: Date | string;
  probationEndDate: Date | string;
  probationPeriod: number;
  confirmationRemarks: string;
  isConfirmed: boolean;
  confirmedOn: Date | string;
  locationBifurcation: string;
  vendor: string;
  reportingToId: string;
  locationForField: string;
}

export class UpdateEmployeeStatutoryRequest {
  employeeId: string;
  panNumber: string;
  pfNumber: string;
  uanNumber: string;
  previousEmployeePensionNumber: string;
  aadharNumber: string;
  aadharName: string;
  drivingLicenseNumber: string;
  passportNumber: string;
  drivingLicenseValidity: string | Date;
  passportValidity: string | Date;
  esiNumber: string;
  licIdNumber: string;
}

export class UploadEmployeeDocumentRequest {
  employeeId: string;
  documentName: string;
  documentTypeId: string;
  file: File;
  documentId: string;
}

export class EmployeeDocumentActionRequest {
  employeeId: string;
  documentId: string;
}

export class UpdateEmployeeContactRequest {
  employeeId: string;
  presentAddress: EmployeeAddress;
  permanentAddress: EmployeeAddress;
  contactNumber: string;
  alternateContactNumber: string;
  personalEmail: string;
  officialEmail: string;
  officialContactNumber: string;
}

export class UpdateEmployeeFamilyRequest {
  employeeId: string;
  employeeFamily: EmployeeFamily[];
}

export class UpdateEmployeeEducationRequest {
  employeeId: string;
  employeeEducation: EmployeeEducation[];
}

export class UpdateEmployeeBankRequest {
  employeeId: string;
  employeebanks: EmployeeBank[];
}

export class UpdateEmployeeLanguageRequest {
  employeeId: string;
  employeeLanguage: EmployeeLanguage[];
}

export class UpdateEmployeeReferenceRequest {
  employeeId: string;
  employeeReference: EmployeeReference[];
}

export class EmployeeActionRequest {
  employeeId: string;
}

export class EmployeeDataVerificationRequest {
  employeeId: string;
  section: string;
}

export class Employee {
  employeeId: string;
  name: string;
  emailId: string;
  phone: string;
  location: string;
  department: string;
  designation: string;
  grade: string;
  canLogin: boolean;
  region: string;
  team: string;
  status: string;
  role: string;
  code: string;
  isVerificationPending: boolean;

  label?: string;
}

export class EmployeeListResponse extends AccessResponse {
  employees: Employee[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeListRequest {
  name: string;
  email: string;
  phone: string;
  locationIds: string[];
  gradeIds: string[];
}

export class EmployeeExistResponse {
  name: string;
  code: string;
  isExist: boolean;
  role: string;
  hasReportees: boolean;
  hasAssetSignings: boolean;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class UpdateEmployeePreviousCompanyRequest {
  employeeId: string;
  previousCompanies: EmployeePreviousCompany[];
}

export class EmployeePreviousCompany {
  employer: string;
  designation: string;
  department: string;
  dateOfJoin: Date | string;
  dateOfExit: Date | string;
  reasonForChange: string;
  previousCompanyId: string;
  ctc: number;
  isActive: boolean;

  tempId?: number;
  dateOfJoinText?: string;
  dateOfExitText?: string;
}

export class EmployeePreviousCompanyResponse extends AccessResponse {
  employeeId: string;
  previousCompanies: EmployeePreviousCompany[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  currentDateOfJoin: Date;
}

export class GetDesignationOptionsRequest {
  departmentId: string;
}

export class EmployeeBaseInfo {
  employeeCode: string;
  employeeId: string;
  employeeName: string;
}

export class ReportingToResponse {
  employees: EmployeeBaseInfo[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class TaskFilterResponse {
  assignedTo: EmployeeBaseInfo[];
  createdBy: EmployeeBaseInfo[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class SelfAnswer {
  selfAppraisalAnswerId: string;
  title: string;
  description: string;
  weightage: number;
  selfWeightage: number;
  managementWeightage: number;
  l2Weightage: number;
  isActive: boolean;

  count?: number;
  newRecord?: boolean = false;
  appraisalMode: number;
}

export class Question {
  employeeAnswerId: string;
  employeeQuestionId: string;
  title: string;
  description: string;
  weightage: number;
  selfWeightage: number;
  managementWeightage: number;
  l2Weightage: number;
}

export class Feedback {
  employeeFeedbackId: string;
  givenBy: string;
  givenByName: string;
  givenOn: Date | string;
  feedback: string;
  appraiseeType: string;
  appraisalMode: number;
}

export class Appraisal {
  employeeAppraisalId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isSelf: boolean;
  isManager: boolean;
  isL2Manager: boolean;
  selfAppraisalDoneOn: Date;
  appraisalClosedOn: Date;
  rmSubmittedOn: Date;
  l2SubmittedOn: Date;
  rating: string;
  selfAnswers: SelfAnswer[];
  questions: Question[];
  feedbacks: Feedback[];
  internalSelf: number;
  internalMgmt: number;
  internalL2: number;
  trainings: Training[];
  businessNeeds: BusinessNeed[];
  showCalculation: boolean;

  startDateText?: string;
  endDateText?: string;
  selfTrainings?: string[];
  rmTrainings?: string[];
  selfTrainingSelections?: SelectOption[];
  rmTrainingSelections?: SelectOption[];
  appraisalCalculation?: AppraisalRatingCalculation;

  category: string;
  mode: string;
  calculationMethod: string;
  hrSubmittedOn: Date;
  selfObjectiveSubmittedOn: Date;
  rmObjectiveSubmittedOn: Date;
  l2ObjectiveSubmittedOn: Date;
  hrObjectiveSubmittedOn: Date;
  grade: string;
  employeeCateogry: string;

  isFitmentRecommended?: boolean;
  isPromotionRecommended?: boolean;
  trainingComments: string;
}

export class AppraisalRatingCalculation {
  selfTotal: number;
  businessNeedTotal: number;
  internalTotal: number;
  definedTotal: number;
  ratingTotal: number;
}

export class UpdateAppraisalFeedbackResponse {
  feedbacks: Feedback[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class Training {
  trainingId: string;
  addedBy: string;
  isSelf: boolean;
  comments: string;
}

export class GetCompanyTrainingsRequest {
  gradeIds: string[];
}

export class SaveAppraisalTrainingRequest {
  isSelf: boolean;
  employeeId: string;
  employeeAppraisalId: string;
  trainings: string[];
  comments: string;
}

export class EmployeeAppraisalResponse extends AccessResponse {
  appraisals: Appraisal[];
  appraisalObjectiveDocuments: EmployeeDocument[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  isAllowed: boolean;
}

export class EmployeeAddress {
  doorNo: string;
  street: string;
  village: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;

  stateSelection?: SelectOption;
}

export class SaveAppraisalBusinessNeedsRequest {
  isSelf: boolean;
  employeeId: string;
  employeeAppraisalId: string;
  businessNeeds: BusinessNeed[];
}

export class SaveAppraisalSelfRequest {
  isSelf: boolean;
  employeeId: string;
  employeeAppraisalId: string;
  selfAnswers: SelfAnswer[];

  isFitmentRecommended?: boolean;
  isPromotionRecommended?: boolean;
}

export class SaveAppraisalOrganizationRequest {
  isSelf: boolean;
  employeeId: string;
  employeeAppraisalId: string;
  questions: Question[];
}

export class SaveAppraisalInternalRequest {
  isSelf: boolean;
  employeeId: string;
  employeeAppraisalId: string;
  weightage: number;
}

export class SubmitAppraisalRequest {
  employeeAppraisalId: string;
  employeeId: string;
  isSelf: boolean;
  ratingId?: string;
  appraisalMode?: number;
}

export class UpdateFeedbackRequest {
  employeeId: string;
  appraiseeType: string;
  employeeAppraisalId: string;
  employeeFeedbackId: string;
  feedback: string;
  appraisalMode: number;
}

export class SaveAppraisalRatingRequest {
  employeeAppraisalId: string;
  employeeId: string;
  ratingId: string;
}

export class EmployeeReportingTo {
  employeeId: string;
  code: string;
  name: string;
  emailId: string;
  location: string;
  department: string;
  designation: string;
  grade: string;
  region: string;
  team: string;
  selfFilledOn: Date;
  managerFilledOn: Date;
  hrFilledOn: Date;
  rating: string;
  isReportingToMe: boolean;
  managerName: string;
  appraisalName: string;
  hrName: string;
  l2FilledOn: Date;
  l2ManagerName: string;

  selfFilledOnText?: string;
  managerFilledOnText?: string;
  l2FilledOnText?: string;
  hrFilledOnText?: string;

  selfObjectiveFilledOn: Date;
  managerObjectiveFilledOn: Date;
  l2ObjectiveFilledOn: Date;
  hrObjectiveFilledOn: Date;
  selfVariableFilledOn: Date;
  managerVariableFilledOn: Date;
  l2VariableFilledOn: Date;
  hrVariableFilledOn: Date;
  appraisalMode: number;
}

export class GetEmployeeReportingToResponse {
  employees: EmployeeReportingTo[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeVerification {
  section: string;
  updatedOn: Date;
  updatedBy: string;
  verifiedOn: Date;
  verifiedBy: string;

  verifiedOnText?: string;
  updatedOnText?: string;
}

export class EmployeeVerificationResponse {
  verifications: EmployeeVerification[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeListFilterRequest {
  name: string;
  emailId: string;
  phoneNumber: string;
  code: string;
  roles: string[];
  departments: string[];
  locations: string[];
  grades: string[];
  designations: string[];
  status: string[];

  roleSelections?: SelectOption[];
  departmentSelections?: SelectOption[];
  locationSelections?: SelectOption[];
  gradeSelections?: SelectOption[];
  designationSelections?: SelectOption[];
  statusSelections?: SelectOption[];
  FromDate?: string | Date;
  ToDate?: string | Date;
}

export class EmployeeCard {
  employeeId: string;
  image: string;
  name: string;
  designation: string;
  location: string;
  department: string;
  manager: string;
  birthDate?: string;
  code: string;
  children: EmployeeCard[];
}

export class EmployeeCardResponse extends AccessResponse {
  employees: EmployeeCard[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeAsset {
  employeeAssetId: string;
  assetId: string;
  assetName: string;
  isActive: boolean;
  description: string;
  assetUniqueId: string;
  givenOn: Date;
  lastUpdatedBy: string;
  lastUpdatedOn?: Date;

  lastUpdatedOnText?: string;
  assetIdSelection?: SelectOption;
  tempId?: number;
  givenOnText?: string;
  assetDamaged?: boolean;
  claimAmount?: number;
}

export class EmployeeAssetResponse extends AccessResponse {
  employeeId: string;
  doj: Date | string;
  assetCodeTaken: boolean;
  assetUniqueId: string;
  assets: EmployeeAsset[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class UpdateEmployeeAssetRequest {
  employeeId: string;
  assets: EmployeeAsset[];
}

export class UpdateEmployeeAssetSigningRequest {
  employeeId: string;
  assets: AssetSigning[];
}

export class BusinessNeed {
  businessNeedAnswerId: string;
  title: string;
  description: string;
  weightage: number;
  selfWeightage: number;
  managementWeightage: number;
  l2Weightage: number;
  isActive: boolean;
  count?: number;
  appraisalMode: number;
}

export class AssetSigning {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeAssetId: string;
  assetId: string;
  assetName: string;
  isActive: boolean;
  description: string;
  assetUniqueId: string;
  givenOn: Date;
  doj: Date | string;
  lastUpdatedBy: string;
  lastUpdatedOn?: Date;

  maxDate?: Date | string;
  lastUpdatedOnText?: string;
  assetIdSelection?: SelectOption;
  givenOnText?: string;
}

export class GetAssetSigningResponse extends AccessResponse {
  employeeId: string;
  assets: AssetSigning[];
  assetCodeTaken: boolean;
  assetUniqueId: string;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeCompensation {
  employeeCompensationId: string;
  year: number;
  annualBasic: number;
  annualHra: number;
  annualConvAllow: number;
  annualSplAllow: number;
  annualMedAllow: number;
  annualLta: number;
  annualWashing: number;
  annualChildEdu: number;
  annualGross: number;
  statutoryBonus: number;
  annualVarBonus: number;
  annualVarBonusPaid1: number;
  annualVarBonusPaid2: number;
  annualAccidIns: number;
  annualHealthIns: number;
  annualGratuity: number;
  annualPf: number;
  annualEsi: number;
  otherBenefits: number;
  annualCtc: number;
  vendorCharges: number;
  offrollCtc: number;
  isActive: boolean;

  tempId?: number;
}

export class EmployeeCompensationResponse extends AccessResponse {
  employeeId: string;
  isOnRoll: boolean;
  employeeCompensation: EmployeeCompensation[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  isAllowed: boolean;
}

export class EmployeeCompensationRequest {
  employeeId: string;
  employeeCompensation: EmployeeCompensation[];
}

export class TrainingDate {
  date: Date;
  isAttended: boolean;
}

export class EmployeeTraining {
  employeeName: string;
  nomineeId: string;
  trainingId: string;
  trainingName: string;
  organizers: string;
  trainerName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  isConfirmed: boolean;
  isStarted: boolean;
  isCompleted: boolean;
  isFeedbackClosed: boolean;
  isFeedbackCompleted: boolean;
  isSelfAccepted: boolean;
  isMangerAccepted: boolean;
  isHrAccepted: boolean;
  isRejected: boolean;
  selfUpdatedOn: Date;
  managerUpdatedOn: Date;
  hrUpdatedOn: Date;
  managerName: string;
  hrName: string;
  attendance: string;
  effectiveness: string;

  dateText?: string;
  attendedText?: string;
}

export class EmployeeTrainingsResponse extends AccessResponse {
  employeeId: string;
  myTrainings: EmployeeTraining[];
  trainingForReportees: EmployeeTraining[];
  trainingsForMe: EmployeeTraining[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeResignationRequest {
  employeeId: string;
  resignationReason: string;
  preferredRelievingDate: Date;
  relievingDateAsPerPolicy: Date;
}

export class UpdateEmployeeExit {
  employeeExitId: number;
  employeeId: string;
  feedback: string;
  status: string;
  relievingDate?: Date;
  isRevoked?: boolean;
  eligibleForRehire?: boolean;
  clearanceComments?: string;
  feedbackForOthers: string;
}

export class EmployeeResignationResponse extends AccessResponse{
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;

  employeeExits: EmployeeResignationDetail[];
}

export class EmployeeResignationDetail {
  exitId: number;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeResignationReason: string;
  resignationDate: Date;
  relievingDate: Date;
  department: string;
  dateOfJoining: string;
  feedback: string;
  manangerId: number;
  manangerName: string;
  seniorManagerId: number;
  seniorManangerName: string;
  hrId: number;
  hrName: string;
  status: string;
  employeeHasCompanyAsset: boolean;
  isAssetHandOverCompleted: boolean;
  isEmployeeExitFormSubmitted: boolean;
  isHODFeedBackFormSubmitted: boolean;
  isHRFeedBackFormSubmitted: boolean;
  isRevoked: boolean;
  preferredRelievingDate: Date;
  l1ApprovalFeedback: string;
  l2ApprovalFeedback: string;
  hrApprovalFeedback: string;
  l1ApprovalFeedbackForOthers: string;
  l2ApprovalFeedbackForOthers: string;
  hrApprovalFeedbackForOthers: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  relievingDateAsPerPolicy: Date;
  feedbackForOthers: string;
  address: string;
  shortfallDays: number;
}

export class EmployeeExitFormDetails {
  id?: number;
  exitId?: number;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  tenureInKai: string;
  totalExperience: string;
  likeAboutKai: string;
  dislikeAboutKai: string;
  thingsKaiMustChange: string;
  thingsKaiMustContinue: string;
  whatPromptedToChange: string;
  reasonForLeavingKai: string;
  rejoinKaiLater: boolean;
  associateWhom: string;
  whichOrganization: string;
  designation: string;
  ctc: string;
  emailId: string;
  mobileNumber: string;
  dateOfJoining?: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  address: string;

  tenureInKAISelection: SelectOption;
  totalExperienceSelection: SelectOption;
}

export class EmployeeExitForm {
  employeeExitId: number;
  employeeExitForm: EmployeeExitFormDetails;
}

export class EmployeeExitFormResponse {
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
  employeeExitForm: EmployeeExitFormDetails;
}

export class HrFeedbackFormDetails {
  id?: number;
  exitId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  dateOfJoining: string;
  dateOfResignation: string;
  dateOfRelieving: string;
  employeeThoughtOnKai: string;
  employeeLikeToChange: string;
  employeeRejoinLater: string;
  salaryAndDesignationOffered: string;
  comments: string;
}

export class IEmployeeReHire {
  code: string;
  dateofJoing: Date;
  dateofRelieving: Date;
  formattedDateOfJoining: string;
  formattedDateOfReliieving: string;
  department: string;
  designation: string;
  desired: string;
  emailId: string;
  employeeId: string;
  grade: string;
  location: string;
  name: string;
  region: string;
  role: string;
  status: string;
  team: string;
}

export class HrFeedbackForm {
  employeeExitId: number;
  hrFeedBackForm: HrFeedbackFormDetails;
}

export class HODFeedbackFormDetails {
  id?: number;
  exitId: number;
  employeeName: string;
  employeeCode: string;
  isDesiredAttrition: boolean;
  desiredUnDesiredDetails: string;
  intentionToLeaveKai: string;
  attemptsToRetainEmployee: string;
  eligibleToRehire: string;
  comments: string;
}

export class HODFeedbackForm {
  employeeExitId: number;
  hodFeedBackForm: HODFeedbackFormDetails;
}

export class ExitFormRequest {
  employeeExitId: number;
}

export class HODFeedbackFormResponse {
  hodFeedBackForm: HODFeedbackFormDetails;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class HRFeedbackFormResponse {
  hrFeedBackForm: HrFeedbackFormDetails;
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeExitAssetRequest {
  employeeId: number;
}

export class EmployeeExitAsset {
  empoyeeExitId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  department: string;
  relievingDate: Date;
}

export class EmployeeExitAssetResponse {
  employeeExitAssets: EmployeeExitAsset[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class EmployeeExitAssetDetail {
  employeeAssetId: number;
  employeeCode: string;
  employeeName: string;
  assetType: string;
  assetUniqueId: string;
  assetBreakageFee: number;
  status: string;
  manager: string;
  seniorManager: string;
  loggedInUserAssetOwner: boolean;
  comments: string;
  hodComments: string;
  isDefaultRMHODAssets: boolean;
}

export class EmployeeExitAssetDetailResponse {
  employeeExitAssetDetails: EmployeeExitAssetDetail[];
  isSuccess: boolean;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class UpdateEmployeeExitAsset {
  employeeExitAssetId: number;
  status: string;
  breakageFee?: number;
  comments: string;
  hodComments: string;
}

export class EmployeeCareer {
  id: number;
  companyId: number;
  addedBy: number;
  addedOn: Date | string;
  updatedBy: number;
  updatedOn: Date | string;
  isActive: boolean;
  employeeId: number;
  employeeCode: string;
  addressingName: string;
  appraisalYear: number;
  appraisalType: string;
  rating: number;
  description: string;
  grade: string;
  designation: string;
  department: string;
  location: string;
  dateofChange: Date | string;
  effectiveFrom: Date | string;
  reasonForChange: string;
  rnR: string;
  remarks: string;
  movementStatus: string;
  guid: string;
  transferType?: string;
  departmentSelection?: { label: string; value: string; };
  locationSelection?: { label: string; value: string; };
  transferTypeSelection?: { label: string; value: string; };
}

export class EmployeeCareerResponse extends AccessResponse {
  employeeCareers: EmployeeCareer[];
  errorCode: number;
  isSuccess: boolean;
}

export class UpdateEmployeeCareerRequest {
  employeeId: string;
  employeeCareers: EmployeeCareer[];
}

export class UpdateEmployeeCareerResponse {
  employeeCareers: EmployeeCareer[];
  errorCode: number;
  isSuccess: boolean;
}

export class EmployeeTransferHistoryResponse {
  employeeCareers: EmployeeCareer[];
  errorCode: number;
  isSuccess: boolean;
}

export class RehireEmployeeResponse {
  employeeId: string;
  isCreated: boolean;
  isSuccess: boolean
  mgAccess: number;
  hrAccess: number;
  empAccess: number;
  errorCode: number;
  errorMessage: string;
  refreshToken: string;
}

export class RehireEmployeeRequest {
  name: string;
  status: string;
  officialEmail: string;
  oldEmail: string;
  employeeCode: string;
  roleId: string;
  canLogin: boolean;
  roleSelection?: string;
}