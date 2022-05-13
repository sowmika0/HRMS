import { SelectOption } from "src/app/app.model";

export class RolesModules {
    id: number;
    module: string;
    moduleSlug: string;
    hr_Users?: string[];
    selected_HrUsers?: SelectOption[];
    rmL2selected?: boolean;
    employeeSelected?: boolean;
}

export class RolesModuleResponse {
    errorCode: number;
    isSuccess: boolean
    message: string;
    type: string;
    value: RolesModules[];
}

export class RolesSettings {
    addedBy: string;
    addedOn: string;
    canAccess: number;
    companyId: string;
    employeeid: any;
    employeeGuid?: string;
    guid: string;
    id: number;
    ismanager: number;
    moduleid: number;
    roleid: number;
    updatedBy: string;
    updatedOn: string;
}

export class RolesModuleSettingsResponse {
    errorCode: number;
    isSuccess: boolean;
    message: string;
    type: string;
    value: RolesSettings[];
}

export class EmployeeIdResponse {
    errorCode: number;
    isSuccess: boolean;
    message: string;
    type: string;
    value: [{ id: string; }]
}