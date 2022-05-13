export class LoginResponse {
    token: string;
    name: string;
    designation: string;
    department: string;
    location: string;
    photoUrl: string;
    grade: string;
    emailId: string;
    role: string;
    isSuccess: boolean;
    errorMessage: string;
    isLoginSuccess: boolean;
    allowedModules: string[];
    code: string;
    employeeId: string;
    locationId?: string;
    isManager?: boolean;
    isAccountLocked: boolean;
    isCaptchaSuccess: boolean;
    nodeToken: string;
}

export class LoginRequest {
    emailId: string;
    password: string;
    captchaKey: string;
    maxInvalidAttempted?: boolean;
    OTPPassword?: string;
}

export class ForgotPasswordRequest {
    emailId: string;
}

export class ForgotPasswordResponse {
    errorMessage: string;
    isSuccess: boolean;
}