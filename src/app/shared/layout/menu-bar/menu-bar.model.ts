export class MenuItem {
    title: string;
    icon: string;
    url: string;
    subMenuList: MenuItem[];
    isHover?: boolean;
    isActive?: boolean;
    showAdmin: boolean;
    showEmployee: boolean;
    showHr: boolean;
}

export class PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
    reTypeNewPassword: string;
}

export class PasswordChangeResponse {
    isPasswordChanged: boolean;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}