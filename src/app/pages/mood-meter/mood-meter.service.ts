import { AppApiEndpoints } from 'src/app/app.constants';
import { HttpService } from "src/app/shared/services/http-service";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodMeterService {

  constructor(private httpService: HttpService) { }

  getMoodSettings() {
    const url = AppApiEndpoints.moodMeterRoute.getMoodSettings;
    return this.httpService.getMethod(url);
  }

  getSettingsMoodTags(payload) {
    const url = AppApiEndpoints.moodMeterRoute.getSettingsMoodTags;
    return this.httpService.getMethod(url, payload, false);
  }

  saveSettingsMoodTags(payload) {
    const url = AppApiEndpoints.moodMeterRoute.saveSettingsMoodTags;
    return this.httpService.postMethod(url, payload, false);
  }

  updateSettingsMoodTags(payload) {
    const url = AppApiEndpoints.moodMeterRoute.updateSettingsMoodTags;
    return this.httpService.postMethod(url, payload, false);
  }

  getEmployeeMood(payload) {
    const url = AppApiEndpoints.moodMeterRoute.getEmployeeMood;
    return this.httpService.postMethod(url, payload, false);
  }

  getEmployeeMoodReports(payload) {
    const url = AppApiEndpoints.moodMeterRoute.getEmployeeMoodReports;
    return this.httpService.postMethod(url, payload, false);
  }

  getEmployeeMoodTags(payload) {
    const url = AppApiEndpoints.moodMeterRoute.getEmployeeMoodTags;
    return this.httpService.postMethod(url, payload, false);
  }
}
