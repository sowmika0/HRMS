import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  Announcement,
  CompanyCalendarRequest,
  DashboardAnnouncementResponse,
  HrDashboardStatResponse,
  ManagerDashboardStatResponse,
} from './dashboard.model';
import { AppSettings, DateFormat, DatePickerOptions } from 'src/app/app.constants';
import { BaseResponse, SelectOption, SelectOptionResponse, UserStorageInformation } from 'src/app/app.model';
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import {
  Employee,
  EmployeeActionRequest,
  EmployeeBaseInfo,
  EmployeeCard,
  EmployeeCardResponse,
  EmployeeListResponse,
  ReportingToResponse,
} from './../employee/employee-details/employee-details.model';
import {
  EmployeeMood,
  EmployeeMoodResponse,
  MoodSettings,
  MoodSettingsResponse,
  SettingsMoodTags,
  SettingsMoodTagsResponse,
  TagsForMoodRequest,
  TodayEmployeeMoodRequest
} from '../mood-meter/mood-meter.model';
import { TrainingActionRequest, UpdateTrainingRequest } from '../training/training.model';

import { AppService } from 'src/app/app.service';
import { CompanysettingsResponse } from '../settings/settings.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { DashboardService } from './dashboard.service';
import { EmployeeIdResponse } from '../roles/roles.model';
import { EmployeeService } from '../employee/employee.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { MoodMeterService } from '../mood-meter/mood-meter.service';
import { RolesService } from '../roles/roles.service';
import { Subject } from 'rxjs';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from '../training/training.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: true }) calendar: TemplateRef<any>;
  @ViewChild('printButton', { static: false }) printButton;
  @ViewChild('trainingCalendarModal', { static: false }) trainingCalendarModal: CustomModalComponent;
  @ViewChild('moodTagsModal', { static: false }) moodTagsModal: CustomModalComponent;
  role = '';
  isHr = false;
  employeeId = '';
  isManager = false;
  empStatusData: any;
  selectedLocation: string;
  selectedLocationForTrainingCalendar: string;
  viewDate: Date = new Date();
  trainingViewDate: Date = new Date();
  hierarchyEmpId: string = '';
  birthdays: EmployeeCard[] = [];
  referrals: Announcement[] = [];
  empHierarchy: EmployeeCard[] = [];
  announcements: Announcement[] = [];
  currentEvents: CalendarEvent[] = [];
  currentTrainingEvents: CalendarEvent[] = [];
  selectedTrainingEvent: UpdateTrainingRequest;

  locationOptions: SelectOption[] = [];
  startYear = new Date().getFullYear();
  selectedLocationOption: SelectOption;
  selectedLocationOptionForTrainingCalendar: SelectOption;
  allEmployees: EmployeeBaseInfo[] = [];
  holidayTypes = AppSettings.holidayTypes;
  hierarchyEmpSelection: EmployeeBaseInfo;
  calendarView: CalendarView = CalendarView.Month;
  trainingCalendarView: CalendarView = CalendarView.Month;
  datePickerOptions = DatePickerOptions.datePicker;
  hrStat: HrDashboardStatResponse = new HrDashboardStatResponse();
  managerStat: ManagerDashboardStatResponse = new ManagerDashboardStatResponse();
  employeesList: EmployeeBaseInfo[] = [];
  nomineesEmployeeList: EmployeeBaseInfo[] = [];
  refresh: Subject<any> = new Subject();
  trainingTypes: SelectOption[] = [];
  gradeOptions: SelectOption[] = [];
  eligibleReporteesForNominate: SelectOption[] = [];
  canSelfNominate: boolean = false;
  isAlreadyNominated: boolean = false;
  isPastTraining: boolean = false;
  isEligibleForReporteesToNominate: boolean = false;
  reportees: Employee[] = [];

  showTags: boolean = false;
  tagsOptions: SettingsMoodTags[] = [];
  moodNameList: MoodSettings[] = [];
  tagComments = '';
  loggedInEmployeeId: string;
  loggedInEmployeeMood: EmployeeMood[] = [];
  selectedMood: MoodSettings = new MoodSettings();
  savedEmployeeMood: EmployeeMood[] = [];
  todayEmployeeMoodData: EmployeeMood[] = [];
  isEmployeeMoodAdded = false;
  showLoadingGif = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private dashboardService: DashboardService,
    private trainingService: TrainingService,
    private appService: AppService,
    private moodMeterService: MoodMeterService,
    private rolesService: RolesService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    console.log('userStage', userStorage)
    this.employeeId = userStorage.employeeId;
    this.isHr = userStorage.role === 'HR';
    this.role = userStorage.role;
    this.isManager = userStorage.isManager;
    this.selectedLocation = userStorage.locationId;
    this.selectedLocationForTrainingCalendar = userStorage.locationId;

    this.getAnnouncements();
    this.getBirthdays();
    this.getCompanyCalendar();
    this.getTrainingCalendar();
    this.getLocationsForDropdown();

    // this.getAllEmployees();
    this.getAllEmployeesInHR();

    if (this.isManager) {
      this.getManagerStats();
    }

    if (this.isHr) {
      this.getHrStats();
    }

    this.getMoodSettings();
  }

  ngAfterViewInit(): void {
    const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    this.getLoggedInEmployeeId(userStorage.employeeId);
  }

  trainingCalendarActions: CalendarEventAction[] = [
    {
      label: 'boossss....',
      a11yLabel: 'boss...',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.onClickTraining(event);
      },
    },

  ];

  getHrStats() {
    this.subjectService.toggleLoading(true);
    this.dashboardService.getHrDashboardStats()
      .then((response: HrDashboardStatResponse) => {
        if (response.isSuccess) {
          this.hrStat = response;

          this.empStatusData = {
            datasets: [{
              data: [this.hrStat.onRollPercent, this.hrStat.offRollPercent]
            }],
            labels: [
              'On Roll Employees',
              'Off Roll Employees'
            ]
          };
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getManagerStats() {
    this.subjectService.toggleLoading(true);
    this.dashboardService.getManagerDashboardStats()
      .then((response: ManagerDashboardStatResponse) => {
        if (response.isSuccess) {
          this.managerStat = response;

          this.empStatusData = {
            datasets: [{
              data: [this.managerStat.onRollPercent, this.managerStat.offRollPercent]
            }],
            labels: [
              'On Roll Employees',
              'Off Roll Employees'
            ]
          };
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getLocationsForDropdown() {
    this.subjectService.toggleLoading(true);
    this.dashboardService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
          this.selectedLocationOption = this.locationOptions.find(l => l.value === this.selectedLocation);
          this.selectedLocationOptionForTrainingCalendar = this.locationOptions.find(l => l.value === this.selectedLocationForTrainingCalendar);
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getAnnouncements() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId,
    };
    this.dashboardService.getAnnouncements(payload)
      .then((response: DashboardAnnouncementResponse) => {
        if (response.isSuccess) {
          this.announcements = response.announcements.filter(s => s.announcementType !== 'Employee Referral');;
          this.referrals = response.announcements.filter(s => s.announcementType === 'Employee Referral');
          this.parseAnnouncementInfo();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  locationChanged(location: SelectOption) {
    this.selectedLocation = location.value;
    this.getCompanyCalendar();
  }

  locationChangedForTrainingCalendar(location: SelectOption) {
    this.selectedLocationForTrainingCalendar = location.value;
    this.getTrainingCalendar()
  }

  async onClickTraining(event: CalendarEvent) {

    // this.selectedTrainingEvent = event;

    const payload: TrainingActionRequest = {
      trainingId: event.meta.trainingId,
      getAllFeedbacks: true
    };

    const payloadToGetReportees: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.subjectService.toggleLoading(true);
    const employeeReporteesResponse: any = await this.employeeService.getEmployeeReportees(payloadToGetReportees);
    this.reportees = employeeReporteesResponse.employees;

    // .then((response: EmployeeListResponse) => {
    //   if (response.isSuccess) {
    //     this.reportees = response.employees;
    //     console.log('in call,', this.reportees)
    //   }
    // })
    // .finally(() => {
    // })

    this.subjectService.toggleLoading(false);

    this.trainingService.getTrainingDetails(payload)
      .then((response: any) => {
        if (response.isSuccess) {
          // this.selectedTrainingEvent = response;

          console.log('locationOptions', this.locationOptions)
          console.log('employeesList', this.employeesList)
          console.log('response.trainingTypes', response.trainingTypes)

          this.selectedTrainingEvent = {
            trainingTitle: response.trainingTitle,
            trainerName: response.trainerName,
            trainingCode: response.trainingCode,
            timeOfDay: response.trainingTiming,
            trainingCategory: response.trainingCategory,
            isOfficeLocation: response.isOfficeLocation,
            trainingType: response.trainingTypeId,
            trainingTypeSelection: this.trainingTypes.find(
              d => response.trainingTypeId === d.value
            ),
            selectedLocation: this.locationOptions.find(
              d => response.officeLocationId === d.value
            ),
            selectedDate: null,
            maxNominees: response.maxNominees,
            grades: response.grades,
            selectedOrganizers: this.employeesList.filter(
              d => response.organizers.some(s => d.employeeId === s)
            ),
            description: response.description,
            selectedGrades: this.gradeOptions.filter(
              d => response.grades.some(s => d.value === s)
            ),
            dates: [],
            nominees: response.nominees,
            isFeedbackClosed: response.isFeedbackClosed,
            isStarted: response.isStarted,
            isCompleted: response.isCompleted,
            departments: response.departments,
            designations: response.designations,
            isConfirmed: response.isConfirmed,
            locations: response.locations,
            officeLocationId: response.officeLocationId,
            organizers: response.organizers,
            otherLocation: response.otherLocation,
            trainingId: response.trainingId,

            selectedDates: []
          };

          // response.dates.map(d => {
          //   const date = moment(d)
          //     .add(10, 'hours')
          //     .format(this.datePickerOptions.dateInputFormat);

          //   this.selectedTrainingEvent.dates.push(date);
          //   this.selectedTrainingEvent.selectedDates = [
          //     ...this.selectedTrainingEvent.selectedDates,
          //     {
          //       label: date,
          //       value: date
          //     }
          //   ];
          // });
          const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
          const selectedGradeArray = this.selectedTrainingEvent.selectedGrades.map(grade => grade.label);
          const isPastDate = moment().isSameOrAfter(new Date(response.dates[0])); // true

          this.selectedTrainingEvent.isAlreadyNominated = response.nominees.filter(nominee => {
            return nominee.code === userStorage.code
          }).length > 0;

          const nomineesEmployeeIds = response.nominees.map(nominee => {
            return nominee.employeeId;
          })

          this.canSelfNominate = selectedGradeArray.includes(userStorage.grade) && response.isConfirmed && !isPastDate && !this.selectedTrainingEvent.isAlreadyNominated;

          this.selectedTrainingEvent.isPastTraining = isPastDate;
          // isPastTraining: boolean = false;
          this.eligibleReporteesForNominate = this.reportees.filter(reportee => {
            return selectedGradeArray.includes(reportee.grade) && !nomineesEmployeeIds.includes(reportee.employeeId)
          }).map(reportee => {
            return {
              label: reportee.name,
              value: reportee.employeeId
            }
          })
          console.log(this.eligibleReporteesForNominate.length);
          console.log(isPastDate);
          console.log(response.isConfirmed);
          this.isEligibleForReporteesToNominate = this.eligibleReporteesForNominate.length > 0 && !isPastDate && response.isConfirmed;
          this.selectedTrainingEvent.selectedReporteesForNominate = this.eligibleReporteesForNominate;
          console.log('selectedTrainingEvent', this.selectedTrainingEvent)
          console.log('eligibleReporteesForNominate', this.eligibleReporteesForNominate)
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })

    this.trainingCalendarModal.showModal();

  }

  onChangeReporteeNomination() {

  }

  onSelfNominate() {

  }

  onRequestNominate(isSelfNominate: boolean) {
    const userStorage: UserStorageInformation = this.localStorageService.getLoggedInUserInfo();
    const nomineesForReportees = this.selectedTrainingEvent.selectedReporteesForNominate.map(reportee => {
      return reportee.value
    })
    const payload = {
      trainingId: this.selectedTrainingEvent.trainingId,
      nominees: isSelfNominate ? [userStorage.employeeId] : nomineesForReportees
    }
    console.log('payload', payload)
    this.trainingService.addNewNominees(payload).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.toaster.success('Requested successfully.')
      }
    })

    this.trainingCalendarModal.hideModal();

  }

  parseAnnouncementInfo() {
    this.announcements.map(a => {
      a.dateText = moment(a.date)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat);
    });
  }

  getAllEmployeesInHR() {
    this.subjectService.toggleLoading(true);
    this.trainingService.getHrEmployeesForDropdown()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.employeesList = response.employees;
        }
      })

    this.trainingService.getEmployeesBaseInfo()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.nomineesEmployeeList = response.employees;
        }
      })

    this.trainingService.getAllTrainingTypes()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.trainingTypes = response.options;
        }
      })

    this.trainingService.getGradesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.gradeOptions = response.options;
        }
        this.subjectService.toggleLoading(false);
      });

  }

  getBirthdays() {
    this.subjectService.toggleLoading(true);
    this.dashboardService.getEmployeeBirthdays()
      .then((response: EmployeeCardResponse) => {
        if (response.isSuccess) {
          this.birthdays = response.employees;
          this.birthdays.map(emp => {
            emp.image = emp.image ? this.appService.fileBaseUrl.replace('/hrms', '') + emp.image : 'assets/avatar/avatar.svg';
          });
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getCompanyCalendar() {
    this.subjectService.toggleLoading(true);
    const payload: CompanyCalendarRequest = {
      location: this.selectedLocation,
      month: 0,
      year: this.viewDate.getFullYear()
    };
    this.dashboardService.getCompanyCalendar(payload)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          this.currentEvents = [];
          response.holidays.map(c => {
            const type = this.holidayTypes.find(h => h.value === c.type);
            this.currentEvents.push({
              start: new Date(c.date),
              end: new Date(c.date),
              title: c.reason,
              allDay: true,
              meta: type ? type.color : null
            });
          });
          console.log('boss curre', this.currentEvents)
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getTrainingCalendar() {
    this.subjectService.toggleLoading(true);
    const payload: CompanyCalendarRequest = {
      // location: this.selectedLocationForTrainingCalendar,
      month: 0,
      year: this.trainingViewDate.getFullYear()
    };
    this.trainingService.getTrainingCalendar(payload)
      .then((response: any) => {
        if (response.isSuccess) {
          this.currentTrainingEvents = [];
          response.trainingsCalendar.map(c => {
            // const type = this.holidayTypes.find(h => h.value === c.type);
            c.date = new Date(moment(c.date).format(this.datePickerOptions.dateInputFormat))
            this.currentTrainingEvents.push({
              start: new Date(c.date),
              end: new Date(c.date),
              title: c.trainingName,
              meta: c,
              color: c.isConfirmed ? {
                primary: '#012e2d',
                secondary: '#30817f',
              } : {
                primary: '#e3bc08',
                secondary: '#dfc758',
              },
              // metaData: c,
              // actions: this.trainingCalendarActions,
              // allDay: true,
              // meta: type ? type.color : null
            });
          });
          this.refresh.next();
          console.log('updated trai', this.currentTrainingEvents)
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  closeOpenMonthViewDay() {
    if (this.startYear !== this.viewDate.getFullYear()) {
      this.getCompanyCalendar();
    }
  }

  closeOpenMonthViewDayForTrainingCalendar() {
    if (this.startYear !== this.trainingViewDate.getFullYear()) {
      this.getTrainingCalendar();
    }
  }

  getAllEmployees() {
    this.dashboardService.getEmployeesBaseInfo()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.allEmployees = response.employees;
        }
      })
  }

  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }

  printHierarchy() {
    this.getEmployeeOrgChart();
  }

  getEmployeeOrgChart() {
    if (this.hierarchyEmpId) {
      this.subjectService.toggleLoading(true);
      const payload: EmployeeActionRequest = {
        employeeId: this.hierarchyEmpId
      };
      this.dashboardService.getEmployeeOrgChart(payload)
        .then((response: EmployeeCardResponse) => {
          if (response.isSuccess) {
            this.empHierarchy = response.employees;
            setTimeout(() => {
              this.printButton.nativeElement.click();
            }, 500);
          }
        })
        .finally(() => {
          this.subjectService.toggleLoading(false);
        })
    }
  }

  private setDefaultSize(): void {
    this.moodNameList.forEach((m) => {
      m.height = '70';
      m.width = '70';
    });
  }

  getTags(moodSetting: MoodSettings): void {
    console.log('mood name ', moodSetting);
    this.setDefaultSize();
    moodSetting.width = '80';
    moodSetting.height = '80';
    this.selectedMood = moodSetting;
    this.showTags = true;
    this.getSettingsMoodTags(moodSetting);
  }

  private uncheckTagSelection(): void {
    this.tagsOptions.forEach((option: SettingsMoodTags) => {
      option.tagSelected = false;
    });
  }

  private getSettingsMoodTags(moodSetting: MoodSettings): void {
    this.subjectService.toggleLoading(true);
    this.tagsOptions = [];
    this.moodMeterService.getSettingsMoodTags({ moodId: moodSetting.id })
      .then((tags: SettingsMoodTagsResponse) => {
        this.tagsOptions = [...this.tagsOptions, ...tags.value];
        this.uncheckTagSelection();
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  private getMoodSettings(): void {
    this.subjectService.toggleLoading(true);
    this.moodMeterService.getMoodSettings()
      .then((moodSettings: MoodSettingsResponse) => {
        console.log(moodSettings);
        this.moodNameList = moodSettings.value;
        this.formatMoodSettings();
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  private formatMoodSettings(): void {
    this.moodNameList.forEach((mood) => {
      mood.source = this.getImageSource(mood.mood);
      mood.height = '70';
      mood.width = '70';
    });
  }

  private todayEmployeeMood(req: TodayEmployeeMoodRequest): void {
    this.subjectService.toggleLoading(true);
    this.dashboardService.getEmployeeMoodForToday(req)
      .then((response: EmployeeMoodResponse) => {
        console.log(response);
        this.todayEmployeeMoodData = response.value;
        this.isEmployeeMoodAdded = this.todayEmployeeMoodData.length ? true : false;
        if (!this.isEmployeeMoodAdded) {
          this.moodTagsModal.showModal();
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      })
  }

  private getLoggedInEmployeeId(empGuid: string) {
    this.subjectService.toggleLoading(true);
    this.rolesService.getEmployeeId({ guid: empGuid })
      .then((result: EmployeeIdResponse) => {
        this.loggedInEmployeeId = result.value[0].id;
        const request: TodayEmployeeMoodRequest = {
          addedBy: Number(this.loggedInEmployeeId),
          addedOn: new Date(moment().format(DateFormat.shortDate))
        };
        this.todayEmployeeMood(request);
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      });
  }

  private getImageSource(moodName: string): string {
    let source = '';
    switch (moodName) {
      case 'Happy':
        source = 'happy.gif';
        break;
      case 'Fine':
        source = 'neutral.gif';
        break;
      case 'Worried':
        source = 'boring.gif';
        break;
      case 'Bad':
        source = 'disappointed.gif';
        break;
      case 'Angry':
        source = 'embarrassed.gif';
        break;
      default:
        source = 'happy.gif';
        break;
    }
    return source;
  }

  private saveTagsForEmployeeMood(selectedTags: SettingsMoodTags[], form: any): void {
    let employeeMoodRequest: EmployeeMood = {
      companyId: 1,
      addedBy: Number(this.loggedInEmployeeId),
      addedOn: new Date(moment().format(DateFormat.shortDate)),
      updatedBy: Number(this.loggedInEmployeeId),
      updatedOn: new Date(moment().format(DateFormat.shortDate)),
      employeeId: Number(this.loggedInEmployeeId),
      moodId: Number(this.selectedMood.id),
      Remarks: this.tagComments
    };
    this.subjectService.toggleLoading(true);
    this.dashboardService.saveEmployeeMood(employeeMoodRequest)
      .then((employeeMoodResponse: EmployeeMoodResponse) => {
        console.log(employeeMoodResponse);
        this.savedEmployeeMood = employeeMoodResponse.value;
        this.saveEmployeeTagsForMood(selectedTags, form);
      })
      .finally(() => {
        setTimeout(() => {
          this.subjectService.toggleLoading(false);
        }, 1000);
      })
  }

  private saveEmployeeTagsForMood(tags: SettingsMoodTags[], form: any): void {
    const tagList: TagsForMoodRequest[] = [];
    tags.forEach((tag: SettingsMoodTags, i: number) => {
      const moodTag: TagsForMoodRequest = {
        employeeMoodId: Number(this.savedEmployeeMood[0].id),
        moodId: Number(this.selectedMood.id),
        TagId: Number(tag.id)
      };
      tagList.push(moodTag);
      if ((i + 1) === tags.length) {
        this.subjectService.toggleLoading(true);
        this.showLoadingGif = true;
        this.dashboardService.saveEmployeeMoodTags(moodTag)
          .then((response) => {
            this.moodTagsModal.hideModal();
            this.tagComments = '';
            this.uncheckTagSelection();
            form.reset();
          })
          .finally(() => {
            setTimeout(() => {
              this.subjectService.toggleLoading(false);
              this.showLoadingGif = false;
            }, 1000);
          });
      }
    });
  }

  saveEmployeeMoodTags(form: any): void {
    console.log('save employee mood tags settings form ', form);
    console.log('tagsOptions ', this.tagsOptions, this.tagComments);
    const selectedTags = [];
    this.tagsOptions.forEach((option: SettingsMoodTags, i: number) => {
      if (option.tagSelected) {
        selectedTags.push(option);
      }
      if ((i + 1) === this.tagsOptions.length && selectedTags.length) {
        this.saveTagsForEmployeeMood(selectedTags, form);
      }
    });
  }

}
