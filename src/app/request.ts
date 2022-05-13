// AUTH REQUESTS

export class LoginRequest {
    emailId: string;
    password: string;
}

// Response for both Login and Signup requests
export class LoginResponse {
    token: string;
    name: string;
    isSuccess: boolean;
    isLoggedIn: boolean;
    isBannerAlreadyCreated?: boolean;
    isAlreadyRegistered?: boolean;
}

export class SignupRequest {
    emailId: string;
    password: string;
}

export class ForgotPasswordRequest {
    emailId: string;
}

export class VerifyResetPasswordLinkRequest {
    token: string;
}

export class ResetPasswordRequest {
    token: string;
    newPassword: string;
}

// PROJECT

export class CreateUntitledProjectRequest {

}

export class AddProjectFromBannerRequest {
    projectName: string;
    description?: string;
}

export class UpdateProjectInfoRequest {
    projectId: string;
    projectName: string;
    description: string;
    isLive: boolean;
    isActive: boolean;
    
}