import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { UploadFile } from 'src/app/app.model';
import { HttpService } from 'src/app/shared/services/http-service';

import { AnnouncementActionRequest, AnnouncementFilterRequest, UpdateAnnouncementRequest } from './announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(
    private httpService: HttpService
  ) { }

  getLocationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getLocationsForDropdown, null, false);
  }

  getAnnouncementTypes() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getAnnouncementTypesForDropdown, null, false);
  }

  getAllAnnouncements(payload: AnnouncementFilterRequest) {
    return this.httpService.getMethod(AppApiEndpoints.announcementRoute.getAllAnnouncements, payload, false);
  }

  getAllAnnouncementsToShow() {
    return this.httpService.getMethod(AppApiEndpoints.announcementRoute.getGeneralAnnouncementsToShow, null, false);
  }

  getAnnouncementDetails(payload: AnnouncementActionRequest) {
    return this.httpService.getMethod(AppApiEndpoints.announcementRoute.getAnnouncementDetails, payload, false);
  }

  updateAnnouncement(payload: UpdateAnnouncementRequest, files: UploadFile[]) {
    return this.httpService.postMethodWithFile(AppApiEndpoints.announcementRoute.updateAnnouncement, payload, files);
  }

  deleteAnnouncement(payload: AnnouncementActionRequest) {
    return this.httpService.postMethod(AppApiEndpoints.announcementRoute.deleteAnnouncement, payload, false);
  }
}
