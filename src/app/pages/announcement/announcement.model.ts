import { SelectOption } from 'src/app/app.model';

export class Announcement {
    announcementId: string;
    title: string;
    subTitle: string;
    content: string;
    startDate: Date | string;
    endDate: Date | string;
    isHidden: boolean;
    isPublished: boolean;
    date: Date | string;
    announcementType: string;
    attachmentCount: number;

    announcementTypeSelection?: SelectOption;
    startDateText?: string;
    endDateText?: string;
    dateText?: string;
}

export class AnnouncementListResponse {
    announcements: Announcement[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class AnnouncementAttachment {
    attachmentId: string;
    fileName: string;
    fileUrl: string;
    size: number;
    type: string;
    isActive: boolean;
    isNew: boolean;
    contentType: string;

    typeSelection?: SelectOption;
}

export class AnnouncementDetailsResponse {
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
    attachments: AnnouncementAttachment[];
    locations: string[];
    isSuccess: boolean;
    errorCode: number;
    errorMessage: string;
    refreshToken: string;
}

export class UpdateAnnouncementRequest {
    announcementId: string;
    title: string;
    subTitle: string;
    content: string;
    startDate: Date | string;
    endDate: Date | string;
    isHidden: boolean;
    isPublished: boolean;
    date: Date | string;
    announcementType: string;
    attachments: AnnouncementAttachment[];
    locations: string[];

    dateText?: string;
    announcementTypeSelection?: SelectOption;
    locationSelections?: SelectOption[];
}

export class AnnouncementActionRequest {
    announcementId: string;
}

export class AnnouncementFilterRequest {
    title: string;
    date: string | Date;
    types: string[];
    publish: boolean[];
    locations: string[];

    publishSelection?: SelectOption[];
    typesSelection?: SelectOption[];
    locationSelection?: SelectOption[];
}