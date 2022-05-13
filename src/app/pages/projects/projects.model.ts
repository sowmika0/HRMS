import { SelectOption } from "src/app/app.model";

export enum EProjectsStatus {
    PENDING = 'pending',
    START = 'start',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    HOLD = 'hold'
}

export enum EProjectsTaskStatus {
    PENDING = 'pending',
    ONGOING = 'ongoing',
    START = 'start',
    HOLD = 'hold',
    RESTART = 'restart',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export enum EProjectTypes {
    PUBLIC = 'public',
    SELF = 'self',
}

export type ProjectStatusValues =
    EProjectsStatus.PENDING |
    EProjectsStatus.START |
    EProjectsStatus.ONGOING |
    EProjectsStatus.COMPLETED |
    EProjectsStatus.CANCELLED |
    EProjectsStatus.COMPLETED |
    EProjectsStatus.CANCELLED;

export type ProjectTasksStatusValues =
    EProjectsTaskStatus.PENDING |
    EProjectsStatus.START |
    EProjectsTaskStatus.HOLD |
    EProjectsTaskStatus.ONGOING |
    EProjectsTaskStatus.RESTART |
    EProjectsTaskStatus.COMPLETED |
    EProjectsTaskStatus.CANCELLED;

export type ProjectTypesValues =
    EProjectTypes.PUBLIC |
    EProjectTypes.SELF


export class IProjectTask {
    taskName: string;
    startDate: Date | string;
    startTime: Date | string | number;
    dueDate: Date | string;
    createdDate: Date | string;
    modifiedDate: Date | string;
    formattedStartDate: string;
    formattedEndDate: string;
    taskId: number;
    id: number;
    endDate: Date | string;
    taskDescription: string;
    taskProjectName: any;
    taskPriority: number;
    taskType: ProjectTypesValues;
    taskAssignTo: string;
    color: string;
    taskStatus: ProjectTasksStatusValues;
    timeSpend: string;
    assignedToSelection?: string;
    assignedTo?: string;
    isStarted?: boolean;
    taskProjectNameVar?: string;
    employeeId: string;
    projectName: string;
    projectId: string;
    taskPriorityVar: string;
    timer?: any;
    timerService?: any;
}

export class IProject {
    projectName: string;
    projectId: number;
    startDate: Date | string;
    endDate: Date | string;
    status: ProjectStatusValues;
    projectType: ProjectTypesValues;
    color: string;
    projectDescription: string;
    employeeId: string;
    tasks: IProjectTask[]
}

export class IDashboardFilter {
    filterType: any;
    filterTypeVar?: string;
    projectName?: any;
    taskProjectNameVar?: string;
    assignedToSelection?: any;
    myActivityTaskStatusSelection?: any;
}

export class ITimeSheetFilter {
    startDate: Date;
    endDate: Date;
    projectName?: any;
    taskProjectNameVar?: string;
    assignedToSelection?: any;
}

export class IComment {
    id: number;
    projectName: string;
    comments: string;
    commentBy: string;
    commentDate: Date;
    commentsFormattedDate: string;
    taskProjectName?: any;
    taskProjectNameVar?: string;
    commentProjectNameVar?: string;
}