export class Announcement {
    announcementId: string;
    title: string;
    subTitle: string;
    content: string;
    startDate: Date;
    endDate: Date;
    isHidden: boolean;
    isPublished: boolean;
    date: Date;
    announcementType: string;
    attachmentCount: number;
    dateText: string;
}

export class DashboardAnnouncementResponse {
    announcements: Announcement[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class CompanyCalendarRequest {
    location?: string;
    year: number;
    month: number;
}

export class ManagerDashboardStatResponse {
    onRollPercent: number;
    offRollPercent: number;
    locationWiseHeadCount: LocationWiseHeadCount[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class HrDashboardStatResponse {
    onRollPercent: number;
    offRollPercent: number;
    locationWiseHeadCount: LocationWiseHeadCount[];
    departmentWiseHeadCount: LocationWiseHeadCount[];
    averageAge: number;
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class LocationWiseHeadCount {
    location: string;
    onRollCount: number;
    offRollCount: number;
}