export class SweetAlertValue {
    emoji: string;
    header: string;
    confirmText?: string;
    confirmButtonText: string;
    cancelButtonText?: string;
    onConfirm: Function;
    data?: any;
    content?: string[];
    onBeforeOpen?: Function;
    showCancelButton?: boolean;
    allowOutsideClick?: boolean;
    allowEscapeKey?: boolean;
    isEmojiLottie?: boolean;
}

export class SweetAlertOption {
    reverseButtons: boolean;
    buttonsStyling: boolean;
    confirmButtonClass: string;
    cancelButtonClass: string;
    showCancelButton: boolean;
    showConfirmButton: boolean;
    allowOutsideClick?: boolean;
    allowEscapeKey?: boolean;
    allowEnterKey?: boolean;
    focusCancel?: boolean;
    focusConfirm?: boolean;
}

export class ShowSweetAlertValue {
    alertData: SweetAlertValue;
    swalOptions: SweetAlertOption;
}

export class SelectOption {
    label: string;
    value: string;
    tag?: boolean;
    index?: number;
    icon?: string;
}

export class SelectOptionResponse {
    options: SelectOption[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class ColorPickerItem {
    color: string;
    backgroundColor: string;
}

export class UserStorageInformation {
    token?: string;
    name?: string;
    designation?: string;
    department?: string;
    location?: string;
    grade?: string;
    photoUrl?: string;
    emailId?: string;
    role?: string;
    allowedModules: string[];
    employeeId?: string;
    code?: string;
    locationId?: string;
    isManager?: boolean;
    nodeToken?: string;
}

export class TokenResponse {
    token: string;
}

export class NodeLoginRequest {
    emailId: string;
    password: string;
}

export class NodeLoginResponse {
    message: string;
    type: string;
    value: TokenResponse;
}

export class UserValidationResponse {
    isSuccess: boolean;
    errorMessage: string;
    isValid: boolean;
}

export class PasswordUpdateResponse {
    isSuccess: boolean;
    errorMessage: string;
    isUpdateSuccess: boolean;
}

export class Stat {
    statTitle: string;
    statDifference: string;
    item: string;
    value: string;
}

export class UploadFile {
    name: string;
    file: File;
    isNew?: boolean;
    type?: string;
    typeSelection?: SelectOption;
}

export class AttachmentType {
    type: string;
    allowedFiles: string;
}

export class AppNotification {
    notificationId: string;
    text: string;
    receivedOn: Date;
    isRead: boolean;
    readOn: Date;
    data: string;
    actionId: number;
    receivedOnText?: string;
    route?: string;
    icon?: string;
}

export class NotificationConstant {
    receivedOnText?: string;
    route?: string;
    icon?: string;
    type?: string;
    id?: number;
    text?: string;
}

export class NotificationListResponse {
    notifications: AppNotification[];
    unReadNotifications: number;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class MarkNotificationReadRequest {
    notifications: AppNotification[];
}

export class OrgChartNode {
    name: string;
    cssClass?: string;
    title: string;
    childs?: OrgChartNode[];
    image: string;
}

export class AppLogos {
    full: string;
    small: string;
    alternate: string;
}

/* Interfaces as resources from the API */
export interface BaseResponse {
    isSuccess: boolean;
    errorMessage: string;
}

export interface BaseRequest {
    timezoneDiff: number;
}