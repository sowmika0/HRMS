import { SelectOption } from 'src/app/app.model';

import { EmployeeBaseInfo } from './../employee/employee-details/employee-details.model';

export class TasksListResponse {
    tasks: Tasks[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class TaskDetailsResponse {
    taskId: string;
    dueOn: Date | string;
    content: string;
    addedBy: string;
    addedOn: string;
    assignedTo: string;
    assignedToId: string;
    comments: Comments[];
    isStarted: boolean;
    isCompleted: boolean;
    isVerified: boolean;
    isIrrelevant: boolean;
    isSelf: boolean;
    isCreator: boolean;
    taskPriority: string;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;

    dueOnText?: string;
    addedOnText?: string;
    taskPrioritySelection?: SelectOption;
    assignedToSelection?: EmployeeBaseInfo;
    assignedToSameAsLoggedInUser?: boolean;
}

export class Tasks {
    taskId: string;
    dueOn: Date | string;
    content: string;
    addedBy: string;
    addedOn: string;
    assignedTo: string;
    assignedToId: string;
    comments: Comments[];
    isStarted: boolean;
    isCompleted: boolean;
    isVerified: boolean;
    isIrrelevant: boolean;
    isSelf: boolean;
    isCreator: boolean;
    taskPriority: string;
    startedOn: Date | string;
    completetedOn: Date | string;
    priority: string;

    workingHours?: number;
    completedInTime?: boolean;
    dueOnText?: string;
    addedOnText?: string;
    assignedToSelection?: EmployeeBaseInfo;
    assignedToSameAsLoggedInUser?: boolean;
}

export class AddUpdateTasksRequest {
    taskId: string;
    taskContent: string;
    dueDate: Date | string;
    dueTime: Date;
    assignedTo: string;
    comments?: Comments[];
    newComment?: string;
    isStarted?: boolean;
    isCompleted?: boolean;
    isVerified?: boolean;
    isIrrelevant?: boolean;
    isSelf?: boolean;
    isCreator?: boolean;
    hourTime?: number;
    minuteTime?: number;
    startedOn?: Date | string;
    completedOn?: Date | string;
    verifiedOn?: Date | string;
    taskPriority: string;

    assignedToId?: string;
    addedBy?: string;
    taskPrioritySelection?: SelectOption;
    assignedToSelection?: EmployeeBaseInfo;
}

export class AddUpdateTaskResponse {
    taskId: string;
    isCreated: boolean;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class Comments {
    commentId: string;
    comment: string;
    addedBy: string;
    addedOn: string;
    isCreator: boolean;

    addedOnText?: string;
}

export class TaskActionRequest {
    taskId: string;
}

export class AddCommentRequest {
    taskId: string;
    commentId: string;
    comment: string;
}

export class DeleteCommentActionRequest {
    taskId: string;
    commentId: string;
}

export class GetTaskCommentsResponse {
    comments: Comments[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class DateWiseTask {
    date: string;
    tasks: Tasks[];
}

export class TaskFilterRequest {
    employeeId: string;
    assignedTo: string[];
    assignedBy: string[];
    started: boolean[];
    completed: boolean[];
    verified: boolean[];
    startDate: string | Date;
    endDate: string | Date;
    title: string;

    dateRangeSelection?: any[];
    assignedToSelection?: EmployeeBaseInfo[];
    assignedBySelection?: EmployeeBaseInfo[];
    startedSelection?: SelectOption[];
    completedSelection?: SelectOption[];
    verifiedSelection?: SelectOption[];
}