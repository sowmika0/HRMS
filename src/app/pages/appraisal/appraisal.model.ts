import { SelectOption } from 'src/app/app.model';

export class Appraisal {
    appraisalId: string;
    isActive: boolean;
    startDate: Date | string;
    endDate: Date | string;
    title: string;
    description: string;
    isCurrent: boolean;
    grades: string[];
    status: string;
    questions: UpdateAppraisaQuestion[];
    isLive: boolean;
    showCalculation: boolean;

    dateRangeSelection?: any[];
    startDateText?: string;
    endDateText?: string;
    gradesSelected?: SelectOption[];

    category: string;
    mode: string;
    calculationMethod: string;
    calculationMethodSelection?: SelectOption;
    eligbilityPeriod?: any[];
    year: number;
    eligibleFrom: Date | string;
    eligibleTo: Date | string;
}

export class GetAppraisalsResponse {
    appraisals: Appraisal[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
    isGradeMismatch: boolean;
}

export class AppraisalInfo {
    appraisalId: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    description: string;
    isCurrent: boolean;
    grades: string[];
}

export class AppraisalEmployee {
    employeeId: string;
    name: string;
    code: string;
    emailId: string;
    department: string;
    designation: string;
    location: string;
    grade: string;
    status: string;
    rating: string;
    selfFilledOn: Date;
    rmFilledOn: Date;
    hrFilledOn: Date;
    l2FilledOn: Date;
    appraisalClosedOn: Date;
    managerName: string;
    hrName: string;
    l2ManagerName: string;

    selfFilledOnText?: string;
    rmFilledOnText?: string;
    hrFilledOnText?: string;
    l2FilledOnText?: string;

    variableRating?: string;
    selfObjectiveFilledOn?: Date;
    rmObjectiveFilledOn?: Date;
    l2ObjectiveFilledOn?: Date;
    rrObjectiveFilledOn?: Date;
    selfVariableFilledOn?: Date;
    rmVariableFilledOn?: Date;
    l2VariableFilledOn?: Date;
    hrVariableFilledOn?: Date;
    appraisalMode?: number;
    hrObjectiveFilledOn?: Date;
    selected?: boolean;
}

export class AppraisalDetailsResponse {
    appraisalInfo: AppraisalInfo;
    appraisalEmployees: AppraisalEmployee[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class UpdateAppraisalRequest {
    appraisalId: string;
    startDate: Date | string;
    endDate: Date | string;
    gradeIds: string[];
    title: string;
    description: string;
    questions: UpdateAppraisaQuestion[];
    isLive: boolean;
    showCalculation: boolean;

    gradesSelected?: SelectOption[];
    dateRangeSelection?: any[];

    category: string;
    mode: string;
    calculationMethod: string;
    calculationMethodSelection?: SelectOption;
    eligbilityPeriod?: any[];
    eligibleFrom: Date | string;
    eligibleTo: Date | string;
    year: number;
}

export class UpdateAppraisaQuestion {
    questionId: string;
    percentage: number;
    question: string;
    description: string;

    questionSelection?: SelectOption;
}

export class AppraisalQuestion {
    questionId: string;
    question: string;
    description: string;
    isActive: boolean;
    appraisalsCount: number;

    tempId?: number;
}

export class AppraisalActionRequest {
    appraisalId: string;
}

export class GetAppraisalQuestionResponse {
    appraisalQuestions: AppraisalQuestion[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class UpdateAppraisalQuestionRequest {
    appraisalQuestions: AppraisalQuestion[];
}

export class AppraisalRating {
    ratingId: string;
    rating: string;
    description: string;
    tag: string;
    score: number;
}

export class GetAppraisalRatingResponse {
    appraisalRatings: AppraisalRating[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class AppraisalFilterRequest {
    title: string;
    grades: string[];
    startDate: Date | string;
    endDate: Date | string;

    gradesSelection?: SelectOption[];
    dateRangeSelection?: any[];
}