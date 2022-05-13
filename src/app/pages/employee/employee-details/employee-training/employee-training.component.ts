import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse, SelectOption, SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DataTableParameters, DatePickerOptions, RegEx } from 'src/app/app.constants';
import {
  EmployeeActionRequest,
  EmployeeBaseInfo,
  EmployeeTraining,
  EmployeeTrainingsResponse,
  ReportingToResponse,
} from '../employee-details.model';
import {
  FillAttendanceRequest,
  SubmitFeedbackRequest,
  TrainingActionRequest,
  TrainingAttendance,
  TrainingAttendanceDate,
  TrainingDetailsResponse,
  UpdateTrainingNomineeRequest,
  UpdateTrainingRequest,
} from './../../../training/training.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { DataTableDirective } from 'angular-datatables';
import { EmployeeService } from '../../employee.service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { Subject } from 'rxjs/internal/Subject';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-training',
  templateUrl: './employee-training.component.html',
  styleUrls: ['./employee-training.component.scss']
})
export class EmployeeTrainingComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: DataTableDirective[];
  @ViewChild('trainingModal', { static: false }) trainingModal: CustomModalComponent;
  regex = RegEx;

  role = '';
  icon = '';
  type = '';
  canEdit = false;
  employeeId = '';
  isUpdating = true;
  currentTab = 'forme';
  isFeedbackProcessing = false;
  datePickerOptions = DatePickerOptions.datePicker;
  newTraining: UpdateTrainingRequest = new UpdateTrainingRequest();
  trainingDetailsResponse: TrainingDetailsResponse = new TrainingDetailsResponse();
  employeeTrainingResponse: EmployeeTrainingsResponse = new EmployeeTrainingsResponse();

  trainingTypes: SelectOption[] = [];
  departmentOptions: SelectOption[] = [];
  designationOptions: SelectOption[] = [];
  locationOptions: SelectOption[] = [];
  gradeOptions: SelectOption[] = [];
  employeesList: EmployeeBaseInfo[] = [];
  alertData: SweetAlertValue = new SweetAlertValue();

  forMeData: EmployeeTraining[] = [];
  organizerData: EmployeeTraining[] = [];
  reporteesData: EmployeeTraining[] = [];
  dtOptions: DataTables.Settings = {};
  forMeDtOptions: DataTables.Settings = {};
  reporteesDtOptions: DataTables.Settings = {};
  organizerDtOptions: DataTables.Settings = {};
  forMeTrigger = new Subject();
  reporteesTrigger = new Subject();
  organizedTrigger = new Subject();
  
  loggedInUserScreen = true;
  haveAccess: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.canEdit = false;
    this.icon = this.employeeService.getSectionTypeIcon('trainings');
    this.employeeId = this.employeeService.getEmployeeId();

    this.dtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
    });

    this.forMeDtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 1
        },
        {
          orderable: false,
          targets: 9
        },
      ],
      order: [],
      search: true,
      searching: true,
      id: 'forme'
    });

    this.reporteesDtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 2
        },
        {
          orderable: false,
          targets: 9
        },
      ],
      order: [],
      search: true,
      searching: true,
      id: 'reportees'
    });

    this.organizerDtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 1
        },
        {
          orderable: false,
          targets: 8
        },
      ],
      order: [],
      search: true,
      searching: true,
      id: 'organizer'
    });

    this.getTrainings();

    setTimeout(() => {
      this.getAllEmployees();
      this.getAllTrainingTypes();
    }, 100);

    setTimeout(() => {
      this.getGradeOptions();
      this.getLocationOptions();
    }, 300);

    setTimeout(() => {
      this.getDepartmentOptions();
      this.getDesignationOptions();
    }, 600);
  }

  private startTraining = (trainingId: string) => {
    this.subjectService.toggleLoading(true);
    const payload: TrainingActionRequest = {
      trainingId: trainingId
    };
    this.employeeService.startTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private finishTraining = (trainingId: string) => {
    this.subjectService.toggleLoading(true);
    const payload: TrainingActionRequest = {
      trainingId: trainingId
    };
    this.employeeService.completeTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private acceptTraining = (data: any) => {
    this.subjectService.toggleLoading(true);
    const payload: UpdateTrainingNomineeRequest = {
      trainingId: data.trainingId,
      nominees: [
        {
          isAccepted: true,
          isHr: false,
          isManager: data.type === 'manager',
          isSelf: data.type === 'self',
          nomineeId: data.nomineeId
        }
      ]
    };

    this.employeeService.acceptTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private rejectTraining = (data: any) => {
    this.subjectService.toggleLoading(true);
    const payload: UpdateTrainingNomineeRequest = {
      trainingId: data.trainingId,
      nominees: [
        {
          isAccepted: false,
          isHr: false,
          isManager: data.type === 'manager',
          isSelf: data.type === 'self',
          nomineeId: data.nomineeId
        }
      ]
    };
    this.employeeService.rejectTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  getGradeOptions() {
    this.employeeService.getGradesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.gradeOptions = response.options;
        }
      });
  }

  getLocationOptions() {
    this.employeeService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
        }
      });
  }

  getDesignationOptions() {
    this.employeeService.getDesignationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.designationOptions = response.options;
        }
      });
  }

  getDepartmentOptions() {
    this.employeeService.getDepartmentsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.departmentOptions = response.options;
        }
      });
  }

  getAllTrainingTypes() {
    this.employeeService.getAllTrainingTypes()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.trainingTypes = response.options;
        }
      })
  }

  getAllEmployees() {
    this.employeeService.getEmployeesBaseInfo()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.employeesList = response.employees;
        }
      })
  }

  findAccess(data: EmployeeTrainingsResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getTrainings() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeTrainings(payload)
      .then((response: EmployeeTrainingsResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.employeeTrainingResponse = response;

          if (this.forMeData.length === 0) {
            this.forMeData = response.trainingsForMe;
          }

          if (this.reporteesData.length === 0) {
            this.reporteesData = response.trainingForReportees;
          }

          if (this.organizerData.length === 0) {
            this.organizerData = response.myTrainings;
          }

          this.setupDatatables();

        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  setupDatatables() {

    setTimeout(() => {

      this.dtElements.map((dt: DataTableDirective) => {
        if (this.currentTab === 'forme' && dt.dtOptions && dt.dtOptions['id'] === 'forme') {
          if (dt.dtInstance) {
            dt.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              setTimeout(() => {
                this.forMeData = this.employeeTrainingResponse.trainingsForMe;
                this.forMeData.map(t => {
                  const start = moment(t.startDate)
                    .format(DatePickerOptions.datePicker.dateInputFormat);
                  const end = moment(t.endDate)
                    .format(DatePickerOptions.datePicker.dateInputFormat);

                  t.dateText = start + ' to ' + end;
                });
                this.forMeTrigger.next();
              }, 100);
            });
          } else {
            this.forMeData = this.employeeTrainingResponse.trainingsForMe;
            this.forMeData.map(t => {
              const start = moment(t.startDate)
                .format(DatePickerOptions.datePicker.dateInputFormat);
              const end = moment(t.endDate)
                .format(DatePickerOptions.datePicker.dateInputFormat);

              t.dateText = start + ' to ' + end;
            });

            this.forMeTrigger.next();
          }
        } else if (this.currentTab === 'reportees' && dt.dtOptions && dt.dtOptions['id'] === 'reportees') {
          if (dt.dtInstance) {
            dt.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              setTimeout(() => {

                this.reporteesData = this.employeeTrainingResponse.trainingForReportees;
                this.reporteesData.map(t => {
                  const start = moment(t.startDate)
                    .format(DatePickerOptions.datePicker.dateInputFormat);
                  const end = moment(t.endDate)
                    .format(DatePickerOptions.datePicker.dateInputFormat);

                  t.dateText = start + ' to ' + end;
                });
                this.reporteesTrigger.next();
              }, 100);
            });
          } else {
            this.reporteesData = this.employeeTrainingResponse.trainingForReportees;
            this.reporteesData.map(t => {
              const start = moment(t.startDate)
                .format(DatePickerOptions.datePicker.dateInputFormat);
              const end = moment(t.endDate)
                .format(DatePickerOptions.datePicker.dateInputFormat);

              t.dateText = start + ' to ' + end;
            });

            this.reporteesTrigger.next();
          }
        } else if (this.currentTab === 'organizer' && dt.dtOptions && dt.dtOptions['id'] === 'organizer') {
          if (dt.dtInstance) {
            dt.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.organizerData = this.employeeTrainingResponse.myTrainings;
              this.organizerData.map(t => {
                const start = moment(t.startDate)
                  .format(DatePickerOptions.datePicker.dateInputFormat);
                const end = moment(t.endDate)
                  .format(DatePickerOptions.datePicker.dateInputFormat);

                t.dateText = start + ' to ' + end;
              });
              setTimeout(() => {
                this.organizedTrigger.next();
              }, 200);
            });
          } else {
            this.organizerData = this.employeeTrainingResponse.myTrainings;
            this.organizerData.map(t => {
              const start = moment(t.startDate)
                .format(DatePickerOptions.datePicker.dateInputFormat);
              const end = moment(t.endDate)
                .format(DatePickerOptions.datePicker.dateInputFormat);

              t.dateText = start + ' to ' + end;
            });

            this.organizedTrigger.next();
          }
        }
      });

    }, 100);
  }

  view(training: EmployeeTraining, type: string) {
    this.type = type;
    this.getTrainingDetails(training.trainingId);
    this.trainingModal.showModal();
  }

  getTrainingDetails(trainingId: string) {
    const payload: TrainingActionRequest = {
      trainingId: trainingId
    };
    this.subjectService.toggleLoading(true);
    this.employeeService.getTrainingDetails(payload)
      .then((response: TrainingDetailsResponse) => {
        if (response.isSuccess) {
          this.isUpdating = true;
          this.trainingDetailsResponse = response;

          this.newTraining = {
            dates: [],
            nominees: [],
            isFeedbackClosed: response.isFeedbackClosed,
            isStarted: response.isStarted,
            isCompleted: response.isCompleted,
            departments: response.departments,
            description: response.description,
            designations: response.designations,
            grades: response.grades,
            isConfirmed: response.isConfirmed,
            isOfficeLocation: response.isOfficeLocation,
            locations: response.locations,
            maxNominees: response.maxNominees,
            officeLocationId: response.officeLocationId,
            organizers: response.organizers,
            otherLocation: response.otherLocation,
            timeOfDay: response.trainingTiming,
            trainerName: response.trainerName,
            trainingId: response.trainingId,
            trainingType: response.trainingTypeId,
            trainingTitle: response.trainingTitle,
            trainingCode: response.trainingCode,
            trainingCategory: response.trainingCategory,

            selectedDates: []
          };

          response.dates.map(d => {
            const date = moment(d)
              .add(10, 'hours')
              .format(this.datePickerOptions.dateInputFormat);

            this.newTraining.dates.push(date);
            this.newTraining.selectedDates = [
              ...this.newTraining.selectedDates,
              {
                label: date,
                value: date
              }
            ];
          });

          response.attendance.map(a => {
            a.dateString = moment(a.date)
              .add(10, 'hours')
              .format(this.datePickerOptions.dateInputFormat);
            if (a.isAttended === undefined || a.isAttended === null) {
              a.isAttended = true;
            }
          });

          this.trainingDetailsResponse.attendanceDate = [];
          this.newTraining.dates.map(d => {
            const newAttendance: TrainingAttendanceDate = {
              date: d,
              attendance: response.attendance.filter(s => s.dateString === d)
            };
            this.trainingDetailsResponse.attendanceDate.push(newAttendance);
          });

          if (this.newTraining.departments) {
            this.newTraining.selectedDepartments = this.departmentOptions.filter(
              d => this.newTraining.departments.some(s => d.value === s)
            );
          }

          if (this.newTraining.designations) {
            this.newTraining.selectedDesignations = this.designationOptions.filter(
              d => this.newTraining.designations.some(s => d.value === s)
            );
          }

          if (this.newTraining.grades) {
            this.newTraining.selectedGrades = this.gradeOptions.filter(
              d => this.newTraining.grades.some(s => d.value === s)
            );
          }

          if (this.newTraining.locations) {
            this.newTraining.selectedLocations = this.locationOptions.filter(
              d => this.newTraining.locations.some(s => d.value === s)
            );
          }

          if (this.newTraining.isOfficeLocation && this.newTraining.officeLocationId) {
            this.newTraining.selectedLocation = this.locationOptions.find(
              d => this.newTraining.officeLocationId === d.value
            );
          }

          if (this.newTraining.organizers) {
            this.newTraining.selectedOrganizers = this.employeesList.filter(
              d => this.newTraining.organizers.some(s => d.employeeId === s)
            );
          }

          if (this.newTraining.trainingType) {
            this.newTraining.trainingTypeSelection = this.trainingTypes.find(
              d => this.newTraining.trainingType === d.value
            );
          }
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });

  }

  startTrainingAlert(trainingId: string) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Start Training?',
      content: [
        'Are you sure you want to start the training? If the training is started it cannot be undone.'
      ],
      confirmText: null,
      confirmButtonText: 'Start Training',
      cancelButtonText: 'Dont Start',
      onConfirm: this.startTraining,
      data: trainingId
    };
    this.subjectService.showSweetAlert(this.alertData, 'primary');
  }

  finishTrainingAlert(trainingId: string) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Complete Training?',
      content: [
        'Are you sure you want to complete the training? If the training is completed it cannot be undone. You cannot add more attendance details to it. Only feedback will be editable.'
      ],
      confirmText: null,
      confirmButtonText: 'Finish Training',
      cancelButtonText: 'Dont Finish',
      onConfirm: this.finishTraining,
      data: trainingId
    };
    this.subjectService.showSweetAlert(this.alertData, 'primary');
  }

  acceptTrainingAlert(trainingId: string, nomineeId: string, type: string) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Accept Training?',
      content: [
        'Are you sure you want to accept the training?'
      ],
      confirmText: null,
      confirmButtonText: 'Accept Training',
      cancelButtonText: 'Dont Accept',
      onConfirm: this.acceptTraining,
      data: {
        trainingId: trainingId,
        nomineeId: nomineeId,
        type: type
      }
    };
    this.subjectService.showSweetAlert(this.alertData, 'primary');
  }

  rejectTrainingAlert(trainingId: string, nomineeId: string, type: string) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Reject Training?',
      content: [
        'Are you sure you want to reject the training?'
      ],
      confirmText: null,
      confirmButtonText: 'Reject Training',
      cancelButtonText: 'Dont Reject',
      onConfirm: this.rejectTraining,
      data: {
        trainingId: trainingId,
        nomineeId: nomineeId,
        type: type
      }
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }


  // ATTENDANCE
  saveAttendance() {
    this.isFeedbackProcessing = true;
    const attendance: TrainingAttendance[] = [];
    this.trainingDetailsResponse.attendanceDate.map(d => {
      d.attendance.map(a => {
        attendance.push({
          date: a.date,
          employeeName: a.employeeName,
          isAttended: a.isAttended,
          nomineeId: a.nomineeId,
          remark: a.remark
        });
      })
    });

    const payload: FillAttendanceRequest = {
      trainingId: this.newTraining.trainingId,
      attendance: attendance
    };
    this.employeeService.fillAttendance(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainingDetails(this.newTraining.trainingId);
          this.toaster.success('Attendance successfully saved.');
        }
      })
      .finally(() => {
        this.isFeedbackProcessing = false;
      })
  }

  submitFeedback() {
    this.isFeedbackProcessing = true;
    const payload: SubmitFeedbackRequest = {
      trainingId: this.newTraining.trainingId,
      answers: this.trainingDetailsResponse.selfFeedback,
      feedbackContent: this.trainingDetailsResponse.feedbackContent
    };
    this.employeeService.submitFeedback(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainingDetails(this.newTraining.trainingId);
          this.toaster.success('Feedbaack successfully saved.');
        }
      }).finally(() => {
        this.isFeedbackProcessing = false;
      })

  }

  onTabSelected(tab: string) {
    this.currentTab = tab;
    this.setupDatatables();
  }
}
