import { ProjectStatusValues, ProjectTypesValues } from "../projects.model";

export const mockProjects = [{
    projectName: 'Test Project',
    startDate: '04-04-2021',
    endDate: '04-04-2021',
    status: 'ongoing' as ProjectStatusValues,
    projectType: 'public' as ProjectTypesValues,
    projectDescription: 'Long description',
    color: 'Red',
    projectId: 1,
    tasks: [],
},
{
    projectName: 'Test Project',
    startDate: '04-04-2021',
    endDate: '04-04-2021',
    status: 'ongoing' as ProjectStatusValues,
    projectType: 'public' as ProjectTypesValues,
    projectDescription: 'Long description',
    color: 'Red',
    projectId: 2,
    tasks: [],
}]