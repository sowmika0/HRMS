import { Injectable } from '@angular/core';
import { AppApiEndpoints } from 'src/app/app.constants';
import { UploadFile } from 'src/app/app.model';
import { HttpService } from 'src/app/shared/services/http-service';

import { SettingsSections } from './settings.constant';
import {
  CompanysettingsResponse,
  UpdateCompanyDetailsRequest,
  UpdateCompanySettingsRequest,
  UploadDataRequest,
} from './settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: CompanysettingsResponse;
  settingsSections = SettingsSections.sections;

  constructor(
    private httpService: HttpService
  ) { }

  setCompanySettingsValue(settings: CompanysettingsResponse) {
    this.settings = settings;
  }

  getCompanySettingsValue() {
    return this.settings;
  }

  getSectionTypeIcon(type: string) {
    return this.settingsSections.find(s => s.type === type).icon;
  }

  getCompanySettings() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getCompanySettings, null, false);
  }

  getLocationsForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getLocationsForDropdown, null, false);
  }

  getTicketCategoryForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.companyRoute.getTicketCategoryForDropdown, null, false);
  }

  getHrEmployeesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getHrEmployeesForDropdown, null, false);
  }

  getAllEmployeesForDropdown() {
    return this.httpService.getMethod(AppApiEndpoints.employeeRoute.getAllEmployeesForDropdown, null, false);
  }

  updateCompanyDetails(payload: UpdateCompanyDetailsRequest, files?: UploadFile[]) {
    return this.httpService.postMethodWithFile(AppApiEndpoints.companyRoute.updateCompanyDetails, payload, files);
  }

  updateCompanySettings(entityType: string, items: any) {
    const payload: UpdateCompanySettingsRequest = {
      updateEntityType: entityType
    };
    switch (entityType) {
      case 'AnnouncementTypes':
        payload.announcementTypes = items;
        break;
      case 'Categories':
        payload.categories = items;
        break;
      case 'Designations':
        payload.designations = items;
        break;
      case 'Departments':
        payload.departments = items;
        break;
      case 'DocumentTypes':
        payload.documentTypes = items;
        break;
      case 'Grades':
        payload.grades = items;
        break;
      case 'Holidays':
        payload.holidays = items;
        break;
      case 'Locations':
        payload.locations = items;
        break;
      case 'ProductLines':
        payload.productLines = items;
        break;
      case 'Regions':
        payload.regions = items;
        break;
      case 'Teams':
        payload.teams = items;
        break;
      case 'TicketFaq':
        payload.ticketFaqs = items;
        break;
      case 'TicketCategory':
        payload.ticketCategories = items;
        break;
      case 'AssetTypes':
        payload.assetTypes = items;
        break;
    }
    return this.httpService.postMethod(AppApiEndpoints.companyRoute.updateCompanySettings, payload, false);
  }

  uploadData(payload: UploadDataRequest, file: File) {
    const files: UploadFile[] = [];
    if (file) {
      files.push({
        file: file,
        name: 'upload'
      });
    }

    return this.httpService.postMethodWithFile(AppApiEndpoints.companyRoute.uploadDataToSettings, payload, files);
  }
}
