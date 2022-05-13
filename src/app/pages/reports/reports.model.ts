export class IEmployeeBirthDayReport {
    location: string;
    grade: string;
    department: string;
    emailId: string;
    bdayDate: Date;
    formattedBirthDate: string;
    code: string;
    role: string;
    region: string;
    team: string;
    employeeId: string;
    name: string;
    designation: string;
    status: string;
    serialNumber: number;
}

export class IReport {
    location: string;
    grade: string;
    department: string;
    emailId: string;
    bdayDate: Date;
    wdayDate: Date;
    addExitDate: Date;
    formattedBirthDate: string;
    formattedDate: string;
    code: string;
    role: string;
    region: string;
    team: string;
    employeeId: string;
    name: string;
    designation: string;
    status: string;
    serialNumber: number;
    dateofJoing: Date;
    confirmationDueDate: Date;
    confirmationDueDateExtended: Date;
    formattedDateofJoing: string;
    formattedConfirmationDueDate: string;
    formattedConfirmationDueDateExtended: string;

    selfSubmitted: Date;
    rmSubmitted: Date;
    hodSubmitted: Date;
    formattedSelfSubmitted: string;
    formattedRmSubmitted: string;
    formattedHodSubmitted: string;

}

export interface IAddExitReport {
    additionDetails?: Array<IReport>;
    exitDetails?: Array<IReport>;
}

export interface IEmployeeObjective {
    employeeObjectiveDetails?: Array<IReport>;
    employeeVariableBonusDetails?: Array<IReport>;
    employeeAppraisalDetails?: Array<IReport>;
}

export interface IHeadCount {
    casualorTemp?: number;
    expatriate?: number;
    offRollCount?: number;
    onRollCount?: number;
    trainee?: number;
    type?: string;
}