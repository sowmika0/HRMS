import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { SettingsService } from '../settings.service';
import { FileFormats, SelectionConstants } from './../../../app.constants';
import { BaseResponse, SelectOption } from './../../../app.model';
import { UploadDataRequest } from './../settings.model';

@Component({
  selector: 'app-settings-upload',
  templateUrl: './settings-upload.component.html',
  styleUrls: ['./settings-upload.component.scss']
})
export class SettingsUploadComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';

  file: File;
  skipLines = 0;
  upload = 'company';
  uploadType = '';
  invalidFile = false;
  isProcessing = false;
  uploadTypeSelection: SelectOption;
  uploadSettingsTypeOptions = SelectionConstants.uploadSettingsTypeOptions;
  employeeUploadTypeOptions = SelectionConstants.employeeUploadOptions;

  fileFormats = FileFormats.settingsUpload;

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('data');
  }

  onFileUploaded(selectedFile: any) {
    this.file = selectedFile.addedFiles[0];
  }

  uploadData() {
    this.isProcessing = true;
    const payload: UploadDataRequest = {
      type: this.uploadType,
      skipLines: this.skipLines,
      isCompany: this.upload === 'company'
    };
    this.settingsService.uploadData(payload, this.file)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Data uploaded successfully.');
        }
      })
      .finally(() => {
        this.isProcessing = false;
      })
  }
}
