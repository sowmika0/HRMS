import { SelectOption } from 'src/app/app.model';

import { EmployeeBaseInfo } from './../employee/employee-details/employee-details.model';

export class TicketListResponse {
    tickets: Ticket[];
    isSuccess: boolean;
    errorCode: 0;
    errorMessage: string;
    refreshToken: string;
}

export class Ticket {
    ticketId: string;
    category: string;
    subCategory: string;
    title: string;
    status: string;
    addedOn: Date | string;
    startedOn: Date | string;
    closedOn: Date | string;
    addedBy: string;
    isStarted: boolean;
    isCompleted: boolean;
    explanation?: string;
    isCreator: boolean;

    addedOnText?: string;
}
export class TicketFaq {
    ticketFaqId: string;
    faqTitle: string;
    description: string;
    ticketSubCategoryId: string;
    ticketCategoryId: string;
    isActive: boolean;
    ticketCategoryName?: string;
    ticketSubCategoryName?: string;
}

export class TicketAttachment {
    attachmentId: string;
    fileName: string;
    fileUrl: string;
    size: number;
    type: string;
    isActive: boolean;
    isNew: boolean;
    contentType: string;
}

export class FaqResponse {
    ticketFaqs: TicketFaq[];
    isSuccess: boolean;
    errorCode: 0;
    errorMessage: string;
    refreshToken: string;
}

export class AddUpdateTicketRequest {
    ticketId: string;
    categoryId: string;
    subCategoryId: string;
    title: string;
    explanation: string;
    attachments: TicketAttachment[];
    categorySelection?: CategorySelect;
    subCategorySelection?: SubCategorySelect;
    isCreator?: boolean;
    newComment?: string;
    isStarted?: boolean;
    isCompleted?: boolean;
}

export class TicketCategory {
    ticketCategoryId: string;
    name: string;
    description: string;
    isActive: true;
    ticketSubCategories: TicketSubCategory[];
    ticketCategorySelection: CategorySelect;
}

export class TicketCategories {
    ticketCategories: TicketCategory[];
    isSuccess: true;
    errorCode: 0;
    errorMessage: string;
    refreshToken: string;
}

export class TicketSubCategory {
    ticketSubCategoryId: string;
    name: string;
    description: string;
    isActive: true;
    ticketsCount: 0;
    subCategorySelection: SubCategorySelect[];
}

export class CategorySelect {
    categoryId: string;
    category: string;
    description: string;
}

export class SubCategorySelect {
    subCategoryId: string;
    subCategory: string;
    description: string;
}

export class TicketActionRequest {
    ticketId: string;
}

export class TicketDetailsResponse {
    ticketInfo: Ticket;
    attachments: TicketAttachment[];
    comments: TicketComment[];
    isSuccess: boolean;
    errorCode: 0;
    errorMessage: string;
    refreshToken: string;
}


export class TicketComment {
    commentId: string;
    comment: string;
    addedBy: string;
    addedOn: Date | string;
    isCreator: boolean;
    addedOnText?: string;
}

export class AddTicketCommentRequest {
    ticketId: string;
    commentId: string;
    comment: string;
}
export class DeleteTicketCommentActionRequest {
    ticketId: string;
    commentId: string;
}

export class AddCommentResponse {
    comments: TicketComment[];
    isSuccess: boolean;
    errorCode: number;
}

export class TicketFilterRequest {
    employeeId: string;
    title: string;
    startDate: string | Date;
    endDate: string | Date;
    category: string;
    subCategory: string;
    addedBy: string[];
    status: string[];

    statusSelection?: SelectOption[];
    categorySelection?: SelectOption;
    subCategorySelection?: SelectOption;
    dateRangeSelection?: any[];
    addedBySelections?: EmployeeBaseInfo[];
}