import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegEx } from 'src/app/app.constants';
import { AppLogos, UploadFile } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanyDetails, CompanysettingsResponse } from '../settings.model';
import { SettingsService } from '../settings.service';
import { FileFormats } from './../../../app.constants';

@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss']
})
export class SettingsCompanyComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('companyDetails') companyDetails: CompanyDetails;

  regex = RegEx;
  fullLogoFile: File;
  smallLogoFile: File;
  alternateLogoFile: File;
  isProcessing = false;
  fullLogoRejected = false;
  logos: AppLogos;
  smallLogoRejected = false;
  alternateLogoRejected = false;

  fileFormats = FileFormats.logos;

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('company');
    this.companyDetails = this.settingsService.getCompanySettingsValue().company;

    // this.logos.alternate = this.appService.fileBaseUrl + this.logos.alternate;
    // this.logos.small = this.appService.fileBaseUrl + this.logos.small;
    // this.logos.full = this.appService.fileBaseUrl + this.logos.full;

    this.logos = this.appService.getLogoPath();

    if (!this.companyDetails) {
      this.companyDetails = new CompanyDetails();
    }
  }

  updateCompanySettings() {
    this.isProcessing = true;
    const files: UploadFile[] = [];
    if (this.fullLogoFile) {
      files.push({
        name: 'Full',
        file: this.fullLogoFile
      });
    }
    if (this.smallLogoFile) {
      files.push({
        name: 'Small',
        file: this.smallLogoFile
      });
    }
    if (this.alternateLogoFile) {
      files.push({
        name: 'Alternate',
        file: this.alternateLogoFile
      });
    }
    this.settingsService.updateCompanyDetails(this.companyDetails, files)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Updated company details successfully.');
          this.settingsService.setCompanySettingsValue(response);
          this.companyDetails = response.company;
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  onLogoSelected(event: any, logoType: string) {

    let isWrongExtension = false;
    event.addedFiles.map(f => {
      var count = (f.name.match(/\./g) || []).length;
      if (count > 1) {
        isWrongExtension = true;
      }
    });

    if (!isWrongExtension) {

      if (logoType === 'fullLogo') {
        if (event.rejectedFiles.length > 0) {
          this.fullLogoRejected = true;
        } else {
          this.fullLogoRejected = false;
        }
        this.fullLogoFile = undefined;
        setTimeout(() => { this.fullLogoFile = event.addedFiles[0]; }, 100);
      } else if (logoType === 'smallLogo') {
        if (event.rejectedFiles.length > 0) {
          this.smallLogoRejected = true;
        } else {
          this.smallLogoRejected = false;
        }
        this.smallLogoFile = undefined;
        setTimeout(() => { this.smallLogoFile = event.addedFiles[0]; }, 100);
      } else if (logoType === 'alternateLogo') {
        if (event.rejectedFiles.length > 0) {
          this.alternateLogoRejected = true;
        } else {
          this.alternateLogoRejected = false;
        }
        this.alternateLogoFile = undefined;
        setTimeout(() => { this.alternateLogoFile = event.addedFiles[0]; }, 100);
      }
    }
  }

}
