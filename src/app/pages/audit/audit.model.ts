import { EmployeeBaseInfo } from '../employee/employee-details/employee-details.model';
import { SelectOption } from './../../app.model';

export class AuditFilterRequest {
    employeeIds: string[];
    startDate: Date | string;
    endDate: Date | string;
    modules: string[];
    verifiedEmpIds: string[];
    updatedEmpIds: string[];
    verifiedStartDate: Date | string;
    verifiedEndDate: Date | string;

    modulesSelection?: SelectOption[];
    employeeIdsSelection?: EmployeeBaseInfo[];
    verifiedEmpIdsSelection?: EmployeeBaseInfo[];
    updatedEmpIdsSelection?: EmployeeBaseInfo[];
}

export class Audit {
    employeeName: string;
    employeeId: string;
    employeeCode: string;
    module: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    verifiedBy: string;
    verifiedDate: Date | string;
    updatedBy: string;
    updatedDate: Date | string;

    formattedUpdated?: string;
    formattedVerified?: string;
}

export class AuditListResponse {
    isSuccess: boolean;
    auditList: Audit[];
}