import { SelectOption } from "src/app/app.model";

export class ApiResponse {
    errorCode: number;
    isSuccess: boolean;
    message: string;
    type: string;
}

export class MoodSettingsResponse {
    errorCode: number;
    isSuccess: boolean
    message: string;
    type: string;
    value: MoodSettings[];
}

export class MoodSettings {
    id: number;
    isActive: number;
    mood: string;
    label?: string;
    value?: string;
    icon?: string;
    source?: string;
    width?: string;
    height?: string;
}

export class SettingsMoodTagsResponse {
    errorCode: number;
    isSuccess: boolean
    message: string;
    type: string;
    value: SettingsMoodTags[];
}

export class SettingsMoodTags {
    id?: number;
    moodId?: number;
    Tag?: string;
    description?: string;
    guid?: string;
    addedOn?: Date;
    addedBy?: number;
    updatedOn?: Date;
    updatedBy?: number;
    isActive?: number;
    companyId?: number;
    label?: string;
    value?: string;
    tagSelected?: boolean;
}

export class NewTag {
    tagName: string;
    moodName: MoodSettings;
    selectedTag: SettingsMoodTags[];
    tags?: SettingsMoodTags[];
}

export class SettingsMoodReportFilterRequest {
    StartDate: Date | string;
    EndDate: Date | string;
    departmentId: string;
    locationId: string;

    dateRangeSelection?: any[];
    departmentSelection?: SelectOption;
    locationSelection?: SelectOption;
}

export class EmployeeMoodRequest {
    employeeId: string;
}

export class EmployeeMoodResponse extends ApiResponse {
    value: EmployeeMood[];
}

export class EmployeeMood {
    id?: number;
    companyId: number;
    addedBy: number;
    addedOn: Date | string;
    updatedBy: number;
    updatedOn: Date | string;
    employeeId: number;
    moodId: number;
    guid?: string;
    Remarks: string;
    employee?: Employee;
    settingsMood?: SettingsMood;
    EmployeeMoodTag?: EmployeeMoodTag[];
}

export class SettingsMood {
    id: string;
    mood: string;
    isActive: boolean;
}

export class Employee {
    OTPPassword: string;
    addedBy: string;
    addedOn: string;
    canLogin: boolean;
    companyId: string;
    emailId: string;
    employeeCompany?: EmployeeCompany;
    guid: string;
    id: string;
    isActive: boolean;
    isTemporaryPasswordSet: boolean;
    name: string;
    password: string;
    passwordSalt: string;
    roleId: string;
    temporaryPassword: string;
    temporaryPasswordExpiry: string;
    updatedBy: string;
    updatedOn: string;
}

export class EmployeeCompany {
    addedBy: string;
    addedOn: string;
    addressingName: string;
    categoryId: string;
    companyId: string;
    confirmationRemarks: string;
    confirmationStatus: string;
    confirmedOn: string;
    department: Department;
    departmentId: string;
    designation: Designation;
    designationId: string;
    division: string;
    doj: string;
    employeeCode: string;
    employeeId: string;
    gradeId: string;
    id: string;
    isResigned: boolean;
    location: Location;
    locationBifurcation: string;
    locationForField: string;
    locationId: string;
    offRoleCode: string;
    onRollDate: string;
    photo: string;
    probationEndDate: string;
    probationExtension: number;
    probationPeriod: string;
    probationStartDate: string;
    productLineId: string;
    regionId: string;
    reportingManager: Employee;
    reportingToId: string;
    status: string;
    statusCategory: string;
    teamId: string;
    trainingAssessmentDate: string;
    trainingPeriod: string;
    trainingStartDate: string;
    uniqueCode: string;
    updatedBy: string;
    updatedOn: string;
    vendor: string;
    vendorName: string;
}

export class Department {
    addedBy: string;
    addedOn: string;
    backColor: string;
    companyId: string;
    description: string;
    frontColor: string;
    guid: string;
    id: string;
    isActive: boolean;
    name: string;
    updatedBy: string;
    updatedOn: string;
}

export class Designation {
    addedBy: string;
    addedOn: string;
    companyId: string;
    departmentId: string;
    description: string;
    guid: string;
    id: string;
    isActive: boolean;
    name: string;
    order: string;
    reportingToId: string;
    updatedBy: string;
    updatedOn: string;
}

export class Location {
    addedBy: string;
    addedOn: string;
    address: string;
    companyId: string;
    country: string;
    description: string;
    email: string;
    gstNumber: string;
    guid: string;
    id: string;
    isActive: boolean;
    name: string;
    phone: string;
    state: string;
    updatedBy: string;
    updatedOn: string;
}

export class EmployeeMoodTag {
    id?: number;
    employeeMoodId: number;
    TagId: number;
    moodId: number;
}

export class TagsForMoodRequest extends EmployeeMoodTag {
    
}

export class TodayEmployeeMoodRequest {
    addedBy: number;
    addedOn: Date | string;
}

export class EmployeeMoodCountResponse extends ApiResponse {
    value: MoodCount[];
}

export class MoodCount {
    moodId: string;
    _count: {
        moodId: number;
    };
    _sum: {
        moodId: string;
    };
}

export class MoodReportsResponse extends ApiResponse {
    value: EmployeeMood[];
}

export class EmployeeMoodReportsRequest {
    StartDate: string;
    EndDate: string;
    departmentId: string;
    locationId: string;
}

export class EmployeeMoodTagsResponse extends ApiResponse {
    value: EmployeeMoodTag[];
}

export class EmployeeMoodTagsRequest {
    tagIds: number[];
}

export class BarChartRequest {
    StartDate: string;
    EndDate: string;
}