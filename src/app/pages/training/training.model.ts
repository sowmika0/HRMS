import { SelectOption } from 'src/app/app.model';

import { Employee, EmployeeBaseInfo } from './../employee/employee-details/employee-details.model';

export class Training {
    trainingId: string;
    trainingName: string;
    trainingCode: string;
    totalDays: number;
    trainerType: string;
    location: string;
    organizers: string;
    startDate: Date;
    endDate: Date;
    attendancePercentage: number;
    maxNominees: number;
    isConfirmed: boolean;
    isStarted: boolean;
    isCompleted: boolean;
    isFeedbackClosed: boolean;
    trainerName: string;
    effectiveness: string;
    feedbackPercentage: string;
}

export class TrainingListResponse {
    trainings: Training[];
    upcomingTrainings: Training[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class TrainingFilterRequest {
    trainingName: string;
    employeeIds: string[];
    startDate: string | Date;
    endDate: string | Date;

    employeeIdsSelection?: EmployeeBaseInfo[];
}

export class UpdateTrainingRequest {
    trainingId: string;
    trainingType: string;
    maxNominees: number;
    isConfirmed: boolean;
    isCompleted: boolean;
    isFeedbackClosed: boolean;
    isStarted: boolean;
    dates: string[];
    organizers: string[];
    description: string;
    grades: string[];
    departments: string[];
    designations: string[];
    locations: string[];
    trainerName: string;
    isOfficeLocation: boolean;
    otherLocation: string;
    officeLocationId: string;
    timeOfDay: string;

    trainingTitle: string;
    trainingCode: string;
    trainingCategory: string;

    nominees: string[];

    selectedDate?: Date;
    trainingTypeSelection?: SelectOption;
    trainingCodeSelection?: SelectOption;
    trainingCategorySelection?: SelectOption;
    selectedLocation?: SelectOption;
    selectedDates?: SelectOption[];
    selectedGrades?: SelectOption[];
    selectedDepartments?: SelectOption[];
    selectedDesignations?: SelectOption[];
    selectedLocations?: SelectOption[];
    selectedOrganizers?: EmployeeBaseInfo[];

    selectedNominees?: Employee[];
    selectedReporteesForNominate?: any;

    isAlreadyNominated?: boolean;
    isPastTraining?: boolean;
}

export class TrainingActionRequest {
    trainingId: string;
    getAllFeedbacks?: boolean;
}

export class UpdateTrainingNomineeRequest {
    trainingId: string;
    nominees: UpdateNominee[];
}

export class UpdateNominee {
    nomineeId: string;
    isAccepted: boolean;
    isSelf: boolean;
    isManager: boolean;
    isHr: boolean;
}



export class TrainingFeedback {
    questionId: number;
    question: string;
    answer: string;
}

export class TrainingNominee {
    employeeId: string;
    code: string;
    nomineeId: string;
    name: string;
    isSelfAccepted: boolean;
    isMangerAccepted: boolean;
    isHrAccepted: boolean;
    selfUpdatedOn: Date;
    managerUpdatedOn: Date;
    hrUpdatedOn: Date;
    managerName: string;
    hrName: string;
    isSelf: boolean;
    isManager: boolean;
    isHr: boolean;
    isAccepted: boolean;
    isRejected: boolean;
    rejectionReason: string;
    feedback: TrainingFeedback[];
    isFeedbackDone: boolean;
    feedbackContent: string;
    feedbackRating: number;
}

export class TrainingAttendance {
    date: Date;
    nomineeId: string;
    employeeName: string;
    isAttended: boolean;
    remark: string;

    dateString?: string;
}

export class TrainingEffectiveness {
    questionId: number;
    question: string;
    answer: string;
}

export class TrainingDetailsResponse {
    trainingId: string;
    trainingTypeId: string;
    organizers: string[];
    trainerName: string;
    nominees: TrainingNominee[];
    grades: string[];
    locations: string[];
    departments: string[];
    designations: string[];
    trainingTiming: string;
    attendance: TrainingAttendance[];
    description: string;
    isConfirmed: boolean;
    isCompleted: boolean;
    isFeedbackClosed: boolean;
    otherLocation: string;
    isOfficeLocation: boolean;
    officeLocationId: string;
    effectiveness: TrainingEffectiveness[];
    dates: string[];
    maxNominees: number;
    isStarted: boolean;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
    selfFeedback: TrainingFeedbackInfo[];
    feedbackContent: string;

    trainingTitle: string;
    trainingCode: string;
    trainingCategory: string;

    attendanceDate: TrainingAttendanceDate[];
}

export class TrainingFeedbackInfo {
    employeeId: string;
    nomineeId: string;
    name: string;
    questionId: number;
    question: string;
    answer: string;
}

export class TrainingAttendanceDate {
    date: string;
    attendance: TrainingAttendance[];
}

export class AddMoreNomineesRequest {
    trainingId: string;
    nominees: string[];
}

export class FillAttendanceRequest {
    trainingId: string;
    attendance: TrainingAttendance[];
}

export class SubmitFeedbackRequest {
    trainingId: string;
    answers: TrainingFeedbackInfo[];
    feedbackContent: string;
}