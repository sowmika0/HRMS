import { SelectOption } from 'src/app/app.model';

import { EmployeeBaseInfo } from './../employee/employee-details/employee-details.model';

export class CompanysettingsResponse {
    holidays: CompanyHoliday[];
    trainingsCalendar: CompanyHoliday[];
    locations: CompanyLocation[];
    grades: CompanyGrade[];
    documentTypes: UploadDocumentType[];
    ticketCategories: TicketCategory[];
    productLines: CompanyProductLine[];
    ticketFaqs: TicketFaq[];
    announcementTypes: AnnouncementType[];
    departments: Department[];
    regions: CompanyRegion[];
    teams: CompanyTeam[];
    categories: Category[];
    designations: Designation[];
    assetTypes: AssetType[];
    company: CompanyDetails;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class UpdateCompanyDetailsRequest {
    name: string;
    address: string;
    email: string;
    phone: string;
    panNumber: string;
    gstNumber: string;
    fullLogo: string;
    smallLogo: string;
}

export class UpdateCompanySettingsRequest {
    updateEntityType: string;
    holidays?: CompanyHoliday[];
    locations?: CompanyLocation[];
    grades?: CompanyGrade[];
    documentTypes?: UploadDocumentType[];
    ticketCategories?: TicketCategory[];
    productLines?: CompanyProductLine[];
    ticketFaqs?: TicketFaq[];
    assetTypes?: AssetType[];
    announcementTypes?: AnnouncementType[];
    departments?: Department[];
    regions?: CompanyRegion[];
    teams?: CompanyTeam[];
    categories?: Category[];
    companyDetails?: CompanyDetails;
    designations?: Designation[];
}

export class CompanyDetails {
    name: string;
    address: string;
    email: string;
    phone: string;
    panNumber: string;
    gstNumber: string;
    fullLogo: string;
    smallLogo: string;
    alternateLogo: string;
}

export class Category {
    categoryId: string;
    category: string;
    description: string;
    isActive: boolean;
    employeesCount: number;

    tempId?: number;
}

export class CompanyTeam {
    teamId: string;
    team: string;
    description: string;
    isActive: boolean;
    employeesCount: number;

    tempId?: number;
}

export class CompanyRegion {
    regionId: string;
    region: string;
    description: string;
    isActive: boolean;
    employeesCount: number;

    tempId?: number;
}

export class Department {
    departmentId: string;
    name: string;
    description: string;
    frontColor: string;
    backColor: string;
    designations: Designation[];
    isActive: boolean;
    employeesCount: number;

    activeDesignationsCount?: number;
    tempId?: number;
}

export class Designation {
    designationId: string;
    name: string;
    description: string;
    order: number;
    reportingTo: string;
    isActive: boolean;
    employeesCount: number;
    refId: number;

    tempId?: number;
    reportingToSelection?: SelectOption;
}

export class AnnouncementType {
    announcementTypeId: string;
    announcementType: string;
    description: string;
    isActive: boolean;
    announcementCount: number;

    tempId?: number;
}

export class TicketFaq {
    ticketFaqId: string;
    faqTitle: string;
    description: string;
    ticketSubCategoryId: string;
    ticketCategoryId: string;
    isActive: boolean;

    tempId?: number;
    categorySelection?: SelectOption;
    subCategorySelection?: SelectOption;
}

export class CompanyProductLine {
    productLineId: string;
    productLine: string;
    description: string;
    isActive: boolean;
    employeesCount: number;

    tempId?: number;
}

export class TicketCategory {
    ticketCategoryId: string;
    name: string;
    description: string;
    isActive: boolean;
    ticketSubCategories: TicketSubCategory[];
    ticketsCount: number;
    owners: string[];

    ownersSelection: EmployeeBaseInfo[];
    activeSubCategoriesCount?: number;
    tempId?: number;
}

export class TicketSubCategory {
    ticketSubCategoryId: string;
    name: string;
    description: string;
    isActive: boolean;
    ticketsCount: number;

    tempId?: number;
}

export class UploadDocumentType {
    documentTypeId: string;
    documentType: string;
    description: string;
    isRestricted: boolean;
    isActive: boolean;
    documentsCount: number;

    tempId?: number;
}

export class CompanyGrade {
    gradeId: string;
    grade: string;
    description: string;
    isActive: boolean;
    employeesCount: number;

    tempId?: number;
}

export class CompanyLocation {
    locationId: string;
    location: string;
    gstNumber: string;
    address: string;
    phone: string;
    email: string;
    state: string;
    country: string;

    isActive: boolean;
    employeesCount: number;

    stateSelection?: SelectOption;
    tempId?: number;
}

export class AssetType {
    assetType: string;
    assetTypeId: string;
    description: string;
    isActive: boolean;
    employeesActive: number;
    signingAuthorities: string[];

    tempId?: number;
    signingAuthoritiesSelection?: EmployeeBaseInfo[];
}

export class CompanyHoliday {
    date: Date | string;
    locationIds: string[];
    isActive: boolean;
    reason: string;
    holidayId: string;
    type: string;

    dateText?: string;
    tempId?: number;
    canDelete?: boolean;
    typeSelection?: SelectOption;
    selectedLocations?: SelectOption[];
}

export class TicketCategoryInfoResponse {
    ticketCategories: TicketCategory[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class AppraisalRating {
    ratingId: string;
    rating: string;
    description: string;
    tag: string;
}

export class GetAppraisalRatingResponse {
    appraisalRatings: AppraisalRating[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class UploadDataRequest {
    type: string;
    skipLines: number;
    isCompany: boolean;
}