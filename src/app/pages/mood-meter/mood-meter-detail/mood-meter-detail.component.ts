import * as moment from 'moment';

import {
  BarChartRequest,
  EmployeeMood,
  EmployeeMoodCountResponse,
  EmployeeMoodReportsRequest,
  EmployeeMoodTag,
  EmployeeMoodTagsRequest,
  EmployeeMoodTagsResponse,
  MoodCount,
  MoodReportsResponse,
  MoodSettings,
  MoodSettingsResponse,
  NewTag,
  SettingsMoodReportFilterRequest,
  SettingsMoodTags,
  SettingsMoodTagsResponse
} from '../mood-meter.model';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableParameters, DateFormat, DatePickerOptions } from 'src/app/app.constants';
import { SelectOption, SelectOptionResponse, UserStorageInformation } from '../../../app.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeIdResponse } from '../../roles/roles.model';
import { EmployeeService } from '../../employee/employee.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { MoodMeterService } from '../mood-meter.service';
import { RolesService } from '../../roles/roles.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { getExportOptions } from 'src/app/shared/utils/getExportOptions';

@Component({
  selector: 'app-mood-meter-detail',
  templateUrl: './mood-meter-detail.component.html',
  styleUrls: ['./mood-meter-detail.component.scss']
})
export class MoodMeterDetailComponent implements OnInit {

  @ViewChild('tagsModal', { static: false }) tagsModal: CustomModalComponent;
  @ViewChild('tagsForMoodModal', {static: false}) tagsForMoodModal: CustomModalComponent;
  newTag: NewTag = new NewTag();
  moodNameList: MoodSettings[] = [];
  showTag: boolean = false;
  tagsOptions: SettingsMoodTags[] = [];
  selectedMoodSetting: MoodSettings = new MoodSettings();
  loggedInEmployeeId: string;
  icon = 'fas fa-tachometer-alt';
  moodCountData: MoodCount[] = [];
  employeeMoodReports: EmployeeMood[] = [];
  className = '';

  settingsMoodReportsData: any[] = [];
  dtOptionsForReports: DataTables.Settings = {};
  datePickerOptions = DatePickerOptions.datePicker;
  reportFilter: SettingsMoodReportFilterRequest;
  departmentOptions: SelectOption[] = [];
  locationOptions: SelectOption[] = [];

  settingsMoodChartLabels: string[] = [];
  settingsMoodChartType: ChartType = 'bar';
  settingsMoodChartData: ChartDataSets[] = [];
  settingsMoodChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          stepSize: 5
        },
        scaleLabel: {
          display: true,
          labelString: '% Info'
        }
      }],
      xAxes: [{
        gridLines: {
          display: true
        },
        // barThickness: 50,
        scaleLabel: {
          display: true,
          labelString: 'Mood Info'
        }
      }]
    }
  };

  // CHART COLOR.
  settingsMoodChartColors = [
    {
      backgroundColor: ['#5cb85c', '#5bc0de', '#f6c7b6', '#f0ad4e', '#d9534f'],
    }
  ];
  totalCount = 0;

  employeeMoodTagsForMoodViewed: EmployeeMoodTag[] = [];
  selectedEmployeeMood: EmployeeMood = new EmployeeMood();

  constructor(private moodMeterService: MoodMeterService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService,
    private rolesService: RolesService) { }

  private getIcon(moodName: string): string {
    let icon = '';
    switch (moodName) {
      case 'Happy':
        icon = 'far fa-laugh';
        break;
      case 'Fine':
        icon = 'far fa-smile';
        break;
      case 'Worried':
        icon = 'far fa-frown-open';
        break;
      case 'Bad':
        icon = 'far fa-meh';
        break;
      case 'Angry':
        icon = 'far fa-angry';
        break;
      default:
        icon = 'far fa-laugh';
        break;
    }
    return icon;
  }
  private formatMoodSettings(): void {
    this.moodNameList.forEach((mood) => {
      mood.label = mood.mood;
      mood.value = mood.mood;
      mood.icon = this.getIcon(mood.mood)
    });
  }

  private getMoodSettings(): void {
    this.subjectService.toggleLoading(true);
    this.moodMeterService.getMoodSettings()
      .then((moodSettings: MoodSettingsResponse) => {
        this.moodNameList = moodSettings.value;
        this.formatMoodSettings();
        const req: BarChartRequest = {
          StartDate: moment().format(DateFormat.shortDate),
          EndDate: moment().format(DateFormat.shortDate)
        }
        this.getEmployeeMood(req);
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  private getLoggedInEmployeeId(empGuid: string) {
    this.subjectService.toggleLoading(true);
    this.rolesService.getEmployeeId({ guid: empGuid })
      .then((result: EmployeeIdResponse) => {
        this.loggedInEmployeeId = result.value[0].id;
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      });
  }

  private setSettingsMoodTagsByMoodName(): void {
    this.newTag.selectedTag = [];
    if (this.tagsOptions.length) {
      this.tagsOptions.forEach((tagOption: SettingsMoodTags, i) => {
        if (tagOption.isActive) {
          tagOption.label = tagOption.Tag;
          tagOption.value = tagOption.Tag;
          this.newTag.selectedTag = [...this.newTag.selectedTag, ...[tagOption]];
        } else {
          tagOption.label = tagOption.Tag;
          tagOption.value = tagOption.Tag;
        }
      });
    }
  }

  private setDataTableSettings(): void {
    this.dtOptionsForReports = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 1
        },
        {
          orderable: false,
          targets: 9
        }
      ],
      paging: true,
      info: false,
      search: true,
      searching: true,
      buttons: [],
      ...getExportOptions({ fileName: 'Employee Mood Report' })
    });
  }

  private getDepartmentOptions() {
    this.employeeService.getDepartmentsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.departmentOptions = response.options;
        }
      });
  }

  private getLocationOptions() {
    this.employeeService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
        }
      });
  }

  private getEmployeeMood(request: BarChartRequest) {
    this.subjectService.toggleLoading(true);
    this.moodMeterService.getEmployeeMood(request)
      .then((employeeMoodData: EmployeeMoodCountResponse) => {
        this.moodCountData = employeeMoodData.value;
        this.totalCount = 0;
        this.moodCountData.forEach((count: MoodCount, i: number) => {
          this.totalCount += count._count.moodId;
          if ((i + 1) === this.moodCountData.length) {
            this.formatBarChartData();
          }
        });
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  private formatBarChartData() {
    const dataSet: ChartDataSets[] = [];
    const data: number[] = [];
    this.settingsMoodChartData = [];
    this.settingsMoodChartLabels = [];
    this.moodCountData.forEach((count: MoodCount, i: number) => {
      const moodData: MoodSettings = this.moodNameList.filter((m) => Number(m.id) === Number(count.moodId))[0];
      data.push(Number((count._count.moodId/this.totalCount).toFixed(2)));
      this.settingsMoodChartLabels.push(moodData.mood);
      if ((i + 1) === this.moodCountData.length) {
        dataSet.push({
          data: data,
          borderWidth: 1
        });
        this.settingsMoodChartData = [...this.settingsMoodChartData, ...dataSet];
      }
    });
    console.log(this.settingsMoodChartData, 'total count ', this.totalCount);
  }

  private getEmployeeMoodReports(req): void {
    this.employeeMoodReports = [];
    this.subjectService.toggleLoading(true);
    this.moodMeterService.getEmployeeMoodReports(req)
      .then((moodReports: MoodReportsResponse) => {
        this.employeeMoodReports = [...this.employeeMoodReports, ...moodReports.value];
        this.className = this.employeeMoodReports && this.employeeMoodReports.length ? 'hide-no-data' : '';
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  private initializeTagValues(): void {
    const newTag = {
      tagName: '',
      moodName: new MoodSettings(),
      selectedTag: [],
      tags: []
    };
    this.newTag = Object.assign({}, newTag);
  }

  ngOnInit() {
    this.setDataTableSettings();
    this.initializeTagValues();
    this.reportFilter = new SettingsMoodReportFilterRequest();
    this.reportFilter.dateRangeSelection = [
      new Date(), new Date()
    ];
    this.reportFilter.StartDate = new Date();
    this.reportFilter.EndDate = new Date();
    this.getMoodSettings();
    const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    this.getLoggedInEmployeeId(userStorage.employeeId);
    this.getDepartmentOptions();
    this.getLocationOptions();
    const initialReq: EmployeeMoodReportsRequest = {
      StartDate: moment(this.reportFilter.StartDate).format(DateFormat.shortDate),
      EndDate: moment(this.reportFilter.EndDate).format(DateFormat.shortDate),
      departmentId: encodeURIComponent(''),
      locationId: ''
    }
    this.getEmployeeMoodReports(initialReq);
  }

  selectMultiple(values: SettingsMoodTags[]) {
    let item = [];
    if (values) {
      // item = values.map(m => m.employeeId);
      item = values.map(m => m.value);
    }
    return item;
  }

  addTags(): void {
    this.tagsModal.showModal();
  }

  onMoodNameChange(moodSetting: MoodSettings): void {
    this.subjectService.toggleLoading(true);
    this.selectedMoodSetting = moodSetting;
    this.showTag = true;
    this.moodMeterService.getSettingsMoodTags({ moodId: moodSetting.id })
      .then((tags: SettingsMoodTagsResponse) => {
        this.tagsOptions = [...this.tagsOptions, ...tags.value];
        this.setSettingsMoodTagsByMoodName();
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  addNewTagForMoodName(form: any): void {
    const tagName = form.value.tagNameVar;
    const tagOption: SettingsMoodTags[] = [{
      label: tagName,
      value: tagName,
      Tag: tagName,
      description: tagName,
      moodId: this.selectedMoodSetting.id
    }];
    this.tagsOptions = [...this.tagsOptions, ...tagOption];
    form.controls.tagNameVar.reset();
  }

  saveTags(form): void {
    const addNewTags: SettingsMoodTags[] = [];
    const updateTags: SettingsMoodTags[] = [];
    (this.newTag.selectedTag || []).forEach((tag: SettingsMoodTags, i) => {
      if ('id' in tag) {

      } else {
        let newTag: SettingsMoodTags = {
          moodId: Number(tag.moodId),
          Tag: tag.Tag,
          description: tag.description,
          addedBy: Number(this.loggedInEmployeeId),
          updatedBy: Number(this.loggedInEmployeeId),
          addedOn: new Date(),
          updatedOn: new Date(),
          companyId: 1,
          isActive: 1
        };
        addNewTags.push(newTag);
      }
      if ((i + 1) === this.newTag.selectedTag.length) {
        // if new tags are added
        if (addNewTags.length) {
          this.saveSettingsMoodTags(addNewTags, form);
        }
      }
    });
    this.tagsOptions.forEach((tag, i) => {
      if ('id' in tag) {
        const isTagAvailable = this.newTag.selectedTag.filter((s) => Number(s.id) === Number(tag.id));
        let updateTag: SettingsMoodTags = {
          id: Number(tag.id),
          moodId: Number(tag.moodId),
          Tag: tag.Tag,
          description: tag.description,
          addedBy: Number(tag.addedBy),
          addedOn: tag.addedOn,
          updatedBy: Number(this.loggedInEmployeeId),
          updatedOn: new Date(),
          companyId: Number(tag.companyId),
          isActive: isTagAvailable.length ? 1 : 0,
          guid: tag.guid
        };
        updateTags.push(updateTag);
      }
      if ((i + 1) === this.tagsOptions.length) {
        if (updateTags.length) {
          this.updateSettingsMoodTags(updateTags, form);
        }
      }
    });
  }

  saveSettingsMoodTags(addNewTags: SettingsMoodTags[], form: any): void {
    this.subjectService.toggleLoading(true);
    this.moodMeterService.saveSettingsMoodTags(addNewTags)
      .then((saveResponse) => {
        this.tagsModal.hideModal();
        form.reset();
        this.initializeTagValues();
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  updateSettingsMoodTags(updateTags: SettingsMoodTags[], form: any): void {
    this.subjectService.toggleLoading(true);
    this.moodMeterService.updateSettingsMoodTags(updateTags)
      .then((updateResponse) => {
        this.tagsModal.hideModal();
        form.reset();
        this.initializeTagValues();
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  onReportFilterDateChosen($event) {
    if ($event) {
      this.reportFilter.StartDate = $event[0];
      this.reportFilter.EndDate = $event[1];
    }
  }

  applyFilter(form: any): void {
    const reportsReq: EmployeeMoodReportsRequest = {
      StartDate: moment(this.reportFilter.StartDate).format(DateFormat.shortDate),
      EndDate: moment(this.reportFilter.EndDate).format(DateFormat.shortDate),
      departmentId: this.reportFilter.departmentId ? encodeURIComponent(this.reportFilter.departmentId) : encodeURIComponent(''),
      locationId: this.reportFilter.locationId ? this.reportFilter.locationId : ''
    };
    this.employeeMoodReports = [];
    this.getEmployeeMoodReports(reportsReq);
    const barChartReq: BarChartRequest = {
      StartDate: moment(this.reportFilter.StartDate).format(DateFormat.shortDate),
      EndDate: moment(this.reportFilter.EndDate).format(DateFormat.shortDate)
    };
    this.getEmployeeMood(barChartReq);
  }

  onDepartmentChange(event: SelectOption): void {
    this.reportFilter.departmentId = event ? event.value : null;
  }

  onLocationChange(event: SelectOption): void {
    this.reportFilter.locationId = event ? event.value : null
  }

  viewTags(report: EmployeeMood) {
    this.selectedEmployeeMood = report;
    const tagIds = [];
    report.EmployeeMoodTag.forEach((e: EmployeeMoodTag) => {
      tagIds.push(Number(e.TagId));
    });
    this.subjectService.toggleLoading(true);
    const req: EmployeeMoodTagsRequest = { tagIds: tagIds };
    this.moodMeterService.getEmployeeMoodTags(req)
    .then((tagsResponse: EmployeeMoodTagsResponse) => {
      this.employeeMoodTagsForMoodViewed = [...this.employeeMoodTagsForMoodViewed, ...tagsResponse.value];
      this.tagsForMoodModal.showModal();
    })
    .finally(() => {
      setTimeout(() => {
        this.subjectService.toggleLoading(false);
      }, 1000);
    });
  }

}
