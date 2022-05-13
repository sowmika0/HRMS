import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from "src/app/shared/services/http-service";
import { Injectable } from "@angular/core";
import { mockProjects } from "./mockData/projects";

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    constructor(private httpSrevice: HttpService) {

    }

    // getAllProjects() {
    //     return mockProjects;
    // }

    getAllRealProjects(payload) {
        const proejctUrl = AppApiEndpoints.projectsRoute.getAllProjects;
        return this.httpSrevice.getMethod(proejctUrl, payload, false)
    }

    getAllComments(payload) {
        const commentUrl = AppApiEndpoints.commentsRoute.getAllComments;
        return this.httpSrevice.getMethod(commentUrl, payload, false)
    }

    createProject(payload) {
        return this.httpSrevice.postMethod(AppApiEndpoints.projectsRoute.createProject, payload, false)
    }

    createTask(payload) {
        // const commentUrl = AppApiEndpoints.projectsRoute.createProject;
        return this.httpSrevice.postMethod(AppApiEndpoints.projectsRoute.createTask, payload, false)
    }

    updateTask(payload) {
        return this.httpSrevice.postMethod(AppApiEndpoints.projectTasksRoute.updateTask, payload, false)
    }

    getAllHistoryTasks(payload) {
        return this.httpSrevice.getMethod(AppApiEndpoints.projectTasksRoute.getAllHistoryTasks, payload, false)
    }

    createComment(payload) {
        return this.httpSrevice.postMethod(AppApiEndpoints.commentsRoute.createComment, payload, false)
    }

    getAllOpenTasks(payload) {
        const commentUrl = AppApiEndpoints.projectTasksRoute.getAllTasks;
        return this.httpSrevice.getMethod(commentUrl, payload, false, false)
    }

}