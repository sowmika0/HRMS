export class SettingsSections {
    public static sections: SettingsSection[] = [
        {
            leftHeader: 'Company',
            leftSubHeader: 'Set company details like name and logo etc',
            icon: 'fas fa-building',
            rightHeader: 'Company Information',
            rightSubHeader: `Update the company name, logo and other information that will be used
            across the application. The changes made in this section will be refreshed for the users after the
            reload the page. Information used in Payslips, Invoices and at other places will be changed for newer
            items.`,
            type: 'company',
            route: 'company'
        },
        {
            leftHeader: 'Departments',
            leftSubHeader: 'Manage company\'s departments',
            icon: 'fas fa-puzzle-piece',
            rightHeader: 'Departments',
            rightSubHeader: `Add the different departments available in your company.`,
            type: 'departments',
            route: 'departments'
        },
        {
            leftHeader: 'Designations',
            leftSubHeader: 'Manage company\'s designations across various departments',
            icon: 'fas fa-dice-d6',
            rightHeader: 'Designations',
            rightSubHeader: `Add all the designations that are available in your company across various departments.
            The employee designation will be based on the designations added here.`,
            type: 'designations',
            route: 'designations'
        },
        {
            leftHeader: 'Locations',
            leftSubHeader: 'Manage company\'s operating locations',
            icon: 'fas fa-location-arrow',
            rightHeader: 'Company Locations',
            rightSubHeader: `Set and update the different company locations here. Once the locations
            are added here, they can be used to add holidays specific for the locations.`,
            type: 'categories',
            route: 'categories'
        },
        {
            leftHeader: 'Tickets',
            leftSubHeader: 'Manage ticket type categories and subcategories',
            icon: 'fas fa-clipboard-list',
            rightHeader: 'Ticket Categories and Sub Categories',
            rightSubHeader: `Create and manage the ticket cateogries and the sub categories that will
            be used when creating HR Tickets. Unless at least one ticket category and subcategory is active, HR
            ticket cannot be raised.`,
            type: 'tickets',
            route: 'tickets'
        },
        // {
        //     leftHeader: 'Appraisal Questions',
        //     leftSubHeader: 'Set questions collection to use for appraisals',
        //     icon: 'fas fa-award',
        //     rightHeader: 'Appraisal Questions',
        //     rightSubHeader: `This is the question bank for the appraisal questions. When creating an
        //     appraisal pick and choose the questions needed to be added for each grade.`,
        //     type: 'appraisal'
        // },
        {
            leftHeader: 'Grades',
            leftSubHeader: 'Grades that employees can be assigned',
            icon: 'fas fa-user-graduate',
            rightHeader: 'Employee Grades',
            rightSubHeader: `Update the various grades of employees present in the company. Once
            created, grades can be given to employees.`,
            type: 'grades',
            route: 'grades'
        },
        {
            leftHeader: 'Product Lines',
            leftSubHeader: 'Product lines that are managed by the company to track',
            icon: 'fas fa-dolly',
            rightHeader: 'Product Lines',
            rightSubHeader: `Prouct lines are used to track the line of work each employee is given.`,
            type: 'productLines',
            route: 'product-lines'
        },
        {
            leftHeader: 'Ticket FAQ',
            leftSubHeader: 'Frequently asked questions before creating a ticket',
            icon: 'fas fa-question-circle',
            rightHeader: 'Ticket FAQ',
            rightSubHeader: `Add frequently asked questions when creating a HR Ticket here and it will
            automatically be shown to the user when trying to create a ticket to reduce similar tickets
            getting create.`,
            type: 'ticketFaq',
            route: 'ticket-faq'
        },
        {
            leftHeader: 'Categories',
            leftSubHeader: 'Categories of work to assign to employees.',
            icon: 'fas fa-user-tag',
            rightHeader: 'Employee Categories',
            rightSubHeader: `List of categories that are used to represent the category of work each
            employee will be mapped to.`,
            type: 'locations',
            route: 'locations'
        },
        {
            leftHeader: 'Teams',
            leftSubHeader: 'Employee teams that are working in the company',
            icon: 'fas fa-users',
            rightHeader: 'Employee Teams',
            rightSubHeader: `The teams in the company that each employee can be assigned to.`,
            type: 'teams',
            route: 'teams'
        },
        {
            leftHeader: 'Document Types',
            leftSubHeader: 'Various document types users can upload into the application',
            icon: 'fas fa-file',
            rightHeader: 'Document Types for Upload',
            rightSubHeader: `The entire list of document types that can be uploaded for each employee into the
            application like Driving License, Passport, Offer Letter etc`,
            type: 'documentTypes',
            route: 'document-types'
        },
        {
            leftHeader: 'Announcement Types',
            leftSubHeader: 'Types of announcements that can be created using the application',
            icon: 'fas fa-bullhorn',
            rightHeader: 'Announcement Types',
            rightSubHeader: `The types of announcements that can be used to communicate messages,
            reports and other things to the entire company like Report, Information, Event, Training etc`,
            type: 'announcementTypes',
            route: 'announcement-types'
        },
        {
            leftHeader: 'Zones',
            leftSubHeader: 'Company\'s zones of operation to map every user',
            icon: 'fas fa-map-signs',
            rightHeader: 'Employee Zones',
            rightSubHeader: `The different zones of operation of your company so each employee can
            be mapped to a specific zone.`,
            type: 'regions',
            route: 'regions'
        },
        {
            leftHeader: 'KAI Calendar',
            leftSubHeader: 'KAI calendar containing holidays and working saturdays.',
            icon: 'fas fa-calendar',
            rightHeader: 'KAI Calendar',
            rightSubHeader: `KAI calendar containing holidays and working saturdays.`,
            type: 'calendar',
            route: 'calendar'
        },
        {
            leftHeader: 'Asset Types',
            leftSubHeader: 'Types of assets that can be given to employees in the organization.',
            icon: 'fas fa-mobile-alt',
            rightHeader: 'Asset Types',
            rightSubHeader: `Types of assets that can be given to employees in the organization.`,
            type: 'asset',
            route: 'asset'
        },
        {
            leftHeader: 'Bulk Data',
            leftSubHeader: 'Add bulk data to the application.',
            icon: 'fas fa-upload',
            rightHeader: 'Bulk Data',
            rightSubHeader: `Add bulk data to the application.`,
            type: 'data',
            route: 'data'
        }
    ];
}

export class SettingsSection {
    leftHeader: string;
    leftSubHeader: string;
    icon: string;
    rightHeader: string;
    rightSubHeader: string;
    type: string;
    route: string;
}