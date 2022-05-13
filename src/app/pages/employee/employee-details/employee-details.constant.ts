import { EmployeeVerification } from './employee-details.model';

export class EmployeeSections {
    public static sections: EmployeeSection[] = [
        {
            leftHeader: 'Account Info',
            leftSubHeader: 'Set the employee\' account settings',
            icon: 'fas fa-cog',
            rightHeader: 'Employee Account Info (HR Use Only)',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'account',
            route: 'account',
        },
        {
            leftHeader: 'Personal Info',
            leftSubHeader: 'The employee\'s name, personal details etc can be seen here.',
            icon: 'fas fa-user',
            rightHeader: 'Personal Info',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'personal',
            route: 'personal'
        },
        {
            leftHeader: 'Official Info',
            leftSubHeader: 'The employee\'s information related to the company.',
            icon: 'fas fa-user-tie',
            rightHeader: 'Employee Official Info (HR Use Only)',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'company',
            route: 'company'
        },
        {
            leftHeader: 'Div/Dept Hierarchy',
            leftSubHeader: 'The company hierarchy of the employees reporting to and higher up the order are shown.',
            icon: 'fas fa-sitemap',
            rightHeader: 'Division/ Department Hierarchy',
            rightSubHeader: `The company hierarchy of the employees reporting to and higher up the order are shown.`,
            type: 'hierarchy',
            route: 'hierarchy'
        },
        {
            leftHeader: 'Identity Info',
            leftSubHeader: 'The employee\'s proofs like passport details.',
            icon: 'fas fa-user-tie',
            rightHeader: 'Personal Identity Info',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'statutory',
            route: 'statutory'
        },
        {
            leftHeader: 'Contact Info',
            leftSubHeader: 'The employee\'s contact information.',
            icon: 'fas fa-phone-alt',
            rightHeader: 'Contact Info',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'contact',
            route: 'contact'
        },
        {
            leftHeader: 'Bank Details',
            leftSubHeader: 'The employee\'s bank account details.',
            icon: 'fas fa-piggy-bank',
            rightHeader: 'Bank Details',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'bank',
            route: 'bank'
        },
        {
            leftHeader: 'Education Details',
            leftSubHeader: 'The employee\'s educational details like degrees.',
            icon: 'fas fa-user-graduate',
            rightHeader: 'Education Details',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'education',
            route: 'education'
        },
        {
            leftHeader: 'Family Info',
            leftSubHeader: 'The employee\'s family information.',
            icon: 'fas fa-home',
            rightHeader: 'Family Info',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'family',
            route: 'family'
        },
        {
            leftHeader: 'Languages Known',
            leftSubHeader: 'The employee\'s known languages.',
            icon: 'fas fa-language',
            rightHeader: 'Languages Known',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'language',
            route: 'language'
        },
        {
            leftHeader: 'Work Exp Info',
            leftSubHeader: 'The employee\'s known languages.',
            icon: 'fas fa-caret-square-left',
            rightHeader: 'Work Experience Info',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'previous',
            route: 'previous'
        },
        {
            leftHeader: 'References',
            leftSubHeader: 'The employee\'s reference contacts.',
            icon: 'fas fa-bookmark',
            rightHeader: 'Employee References',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'reference',
            route: 'reference'
        },
        {
            leftHeader: 'Documents',
            leftSubHeader: 'The employee related douments uploaded.',
            icon: 'fas fa-file',
            rightHeader: 'Employee Documents',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'documents',
            route: 'documents'
        },
        {
            leftHeader: 'Appraisal',
            leftSubHeader: 'The employee\'s appraisal information.',
            icon: 'fas fa-comments-dollar',
            rightHeader: 'Employee Objective/Appraisal',
            rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
            type: 'appraisal',
            route: 'appraisal'
        },
        {
            leftHeader: 'Assets',
            leftSubHeader: 'The employee\'s assets assigned in the organization.',
            icon: 'fas fa-mobile-alt',
            rightHeader: 'Employee Assets',
            rightSubHeader: 'The employee\'s assets assigned in the organization.',
            type: 'asset',
            route: 'asset'
        },
        {
            leftHeader: 'Reportees Info',
            leftSubHeader: 'The employees reporting to you will be displayed here.',
            icon: 'fas fa-marker',
            rightHeader: 'Reportees Info',
            rightSubHeader: 'The employees reporting to you will be displayed here.',
            type: 'reportees',
            route: 'reportees',
            shouldCheck: true
        },
        {
            leftHeader: 'Signing Assets',
            leftSubHeader: 'Employees for whom the signing authority of assets.',
            icon: 'fas fa-signature',
            rightHeader: 'Employee Signing Assets',
            rightSubHeader: 'Employees for whom the signing authority of assets.',
            type: 'signing',
            route: 'signing',
            shouldCheck: true
        },
        {
            leftHeader: 'Compensation Info',
            leftSubHeader: 'Employees compensation information.',
            icon: 'fas fa-dollar-sign',
            rightHeader: 'Compensation Info',
            rightSubHeader: 'Employees compensation information.',
            type: 'compensation',
            route: 'compensation',
        },
        // {
        //     leftHeader: 'Recognition',
        //     leftSubHeader: 'The employee\'s recognitions inside the company.',
        //     icon: 'fas fa-award',
        //     rightHeader: 'Employee Recognitions',
        //     rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
        //     type: 'recognition',
        //     route: 'recognition'
        // },
        {
            leftHeader: 'Training Info',
            leftSubHeader: 'Trainings related to the employee are shown here.',
            icon: 'fas fa-hiking',
            rightHeader: 'Training Info',
            rightSubHeader: `Trainings related to the employee are shown here`,
            type: 'trainings',
            route: 'trainings'
        },
        {
            leftHeader: 'Career Growth',
            leftSubHeader: 'The employee\'s career growth information.',
            icon: 'fas fa-chart-line',
            rightHeader: 'Employee Career Growth Information',
            rightSubHeader: `Career growth related to the employee are shown here`,
            type: 'career',
            route: 'career'
        },
        {
            leftHeader: 'Exit',
            leftSubHeader: 'The employee\'s exit information.',
            icon: 'fas fa-door-open',
            rightHeader: 'Exit',
            rightSubHeader: ``,
            // rightSubHeader: `For Resignation and to view Resignation and asset details of employee\'s`,
            type: 'exit',
            route: 'exit'
        },
        // {
        //     leftHeader: 'Tickets',
        //     leftSubHeader: 'The tickets that are created or participated by the employee.',
        //     icon: 'fas fa-flag',
        //     rightHeader: 'Employee Tickets',
        //     rightSubHeader: `Update the employee\'s account settings like the role, is prevented from login etc`,
        //     type: 'tickets',
        //     route: 'tickets'
        // }
    ];
}

export class EmployeeSection {
    leftHeader: string;
    leftSubHeader: string;
    icon: string;
    rightHeader: string;
    rightSubHeader: string;
    type: string;
    route: string;
    verification?: EmployeeVerification;
    shouldCheck?: boolean;
    checkValidation?: boolean;
}