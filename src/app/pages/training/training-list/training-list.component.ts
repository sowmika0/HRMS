import * as _ from 'lodash';
import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import {
  AddMoreNomineesRequest,
  FillAttendanceRequest,
  Training,
  TrainingActionRequest,
  TrainingAttendance,
  TrainingAttendanceDate,
  TrainingDetailsResponse,
  TrainingFilterRequest,
  TrainingListResponse,
  UpdateTrainingNomineeRequest,
  UpdateTrainingRequest,
} from '../training.model';
import { BaseResponse, SelectOption, SelectOptionResponse, SweetAlertValue } from 'src/app/app.model';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DataTableParameters, DatePickerOptions, RegEx, SelectionConstants } from 'src/app/app.constants';
import {
  Employee,
  EmployeeBaseInfo,
  EmployeeListResponse,
  ReportingToResponse,
} from '../../employee/employee-details/employee-details.model';

import { AppService } from 'src/app/app.service';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { DataTableDirective } from 'angular-datatables';
import { EmployeeListFilterRequest } from './../../employee/employee-details/employee-details.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ObjectToUrlService } from 'src/app/shared/services/obj-to-url-service';
import { Subject } from 'rxjs/internal/Subject';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from './../training.service';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: DataTableDirective[];
  @ViewChild('filterModal', { static: false }) filterModal: CustomModalComponent;
  @ViewChild('trainingModal', { static: false }) trainingModal: CustomModalComponent;
  regex = RegEx;

  isUpdating = false;
  isFilterSet = false;
  isFiltering = false;
  isProcessing = false;
  updatingNominees = false;
  isGettingNominees = false;
  trainings: Training[] = [];
  isConfirmProcessing = false;
  isNomineeFilterChanged = true;
  ongoingTrainings: Training[] = [];
  upcomingTrainings: Training[] = [];
  trainingNominees: Employee[] = [];
  trainingTypes: SelectOption[] = [];
  trainingCode: SelectOption[] = [];
  defaultFilter: TrainingFilterRequest;
  trainingFilter: TrainingFilterRequest;
  employeesList: EmployeeBaseInfo[] = [];
  nomineesEmployeeList: EmployeeBaseInfo[] = [];
  datePickerOptions = DatePickerOptions.datePicker;
  alertData: SweetAlertValue = new SweetAlertValue();
  trainingDetailsResponse: TrainingDetailsResponse = new TrainingDetailsResponse();

  newTraining: UpdateTrainingRequest = new UpdateTrainingRequest();

  departmentOptions: SelectOption[] = [];
  designationOptions: SelectOption[] = [];
  locationOptions: SelectOption[] = [];
  gradeOptions: SelectOption[] = [];

  trainingCategoryTypes = SelectionConstants.trainingCategoryTypes;

  dtOptions: DataTables.Settings = {};
  upcomingDtOptions: DataTables.Settings = {};
  completedDtOptions: DataTables.Settings = {};
  nomineeDtOptions: DataTables.Settings = {};
  upcomingTrigger = new Subject<any>();
  completedTrigger = new Subject<any>();
  today = new Date();

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private trainingService: TrainingService,
    private objToUrlService: ObjectToUrlService,
    private appService: AppService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.defaultFilter = {
      trainingName: '',
      startDate: '',
      endDate: '',
      employeeIds: [],
    };
    this.trainingFilter = Object.assign({}, this.defaultFilter);

    this.dtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [

      ],
      search: true,
      searching: true,
    });

    this.upcomingDtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 1
        },
        {
          orderable: false,
          targets: 10
        },
      ],
      searching: true,
      order: [],
      id: 'upcoming'
    });

    this.completedDtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
        {
          orderable: false,
          targets: 1
        },
        {
          orderable: false,
          targets: 10
        },
      ],
      searching: true,
      order: [],
      id: 'completed'
    });

    this.nomineeDtOptions = Object.assign(JSON.parse(JSON.stringify(DataTableParameters.dataTableOptions)), {
      columnDefs: [
      ],
      search: true,
      searching: true,
    });


    const employeeInfo = this.localStorageService.getLoggedInUserInfo();

    this.setFilterParametersFromUrl();

    setTimeout(() => {
      this.getAllEmployees();
      this.getAllTrainingTypes();
      this.getAllTrainingCode();
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

  ngAfterViewInit() {

  }

  private acceptTraining = (data: any) => {
    this.subjectService.toggleLoading(true);
    const payload: UpdateTrainingNomineeRequest = {
      trainingId: data.trainingId,
      nominees: [
        {
          isAccepted: true,
          isHr: data.type === 'hr',
          isManager: false,
          isSelf: false,
          nomineeId: data.nomineeId
        }
      ]
    };
    this.trainingService.acceptTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainingDetails(data.trainingId);
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
          isHr: data.type === 'hr',
          isManager: false,
          isSelf: false,
          nomineeId: data.nomineeId
        }
      ]
    };
    this.trainingService.rejectTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainingDetails(data.trainingId);
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private deleteTraining = (item: Training) => {
    this.subjectService.toggleLoading(true);
    const payload: TrainingActionRequest = {
      trainingId: item.trainingId
    };
    this.trainingService.deleteTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private closeFeedback = (item: Training) => {
    this.subjectService.toggleLoading(true);
    const payload: TrainingActionRequest = {
      trainingId: item.trainingId
    };
    this.trainingService.closeFeedbackFortraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getAllTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  private confirmTraining = (item: string) => {
    this.isConfirmProcessing = true;
    this.subjectService.toggleLoading(true);
    const payload: TrainingActionRequest = {
      trainingId: item
    };
    this.trainingService.confirmTraining(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Training successfully confirmed.');
          this.trainingModal.hideModal();
          this.getAllTrainings();
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
        this.isConfirmProcessing = false;
      })
  }

  getGradeOptions() {
    this.trainingService.getGradesForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.gradeOptions = response.options;
        }
      });
  }

  getLocationOptions() {
    this.trainingService.getLocationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.locationOptions = response.options;
        }
      });
  }

  getDesignationOptions() {
    this.trainingService.getDesignationsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.designationOptions = response.options;
        }
      });
  }

  getDepartmentOptions() {
    this.trainingService.getDepartmentsForDropdown()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.departmentOptions = response.options;
          console.log('departmentOptions ', this.departmentOptions);
        }
      });
  }

  setFilterParametersFromUrl() {
    this.trainingFilter = Object.assign({}, this.defaultFilter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.objToUrlService.convertQueryParamsToObject(this.trainingFilter, params);
      this.isFilterSet = !_.isEqual(this.defaultFilter, this.trainingFilter);
      this.setFilterSelections();
    });
  }

  setFilterSelections() {
    if (this.employeesList.length > 0) {
      this.trainingFilter.startDate =
        this.trainingFilter.startDate && this.trainingFilter.startDate !== ''
          ? new Date(moment(this.trainingFilter.startDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat))
          : '';

      if (this.trainingFilter.employeeIds) {
        this.trainingFilter.employeeIdsSelection =
          this.employeesList.filter(f => this.trainingFilter.employeeIds.find(d => d === f.employeeId));
      }

      this.getAllTrainings();
    }
  }

  applyFilter() {
    const filter = Object.assign({}, this.trainingFilter);
    filter.startDate = filter.startDate && filter.startDate !== ''
      ? moment(filter.startDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : null;
    filter.endDate = filter.endDate && filter.endDate !== ''
      ? moment(filter.endDate)
        .add(10, 'hours')
        .format(this.datePickerOptions.dateInputFormat)
      : null;

    filter.employeeIdsSelection = [];
    const queryParams = this.objToUrlService.buildParametersFromSearch(filter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = !_.isEqual(this.defaultFilter, this.trainingFilter);
    this.getAllTrainings();
    this.filterModal.hideModal();
  }

  clearFilter(form: NgForm) {
    this.trainingFilter = Object.assign({}, this.defaultFilter);
    form.reset();
    const queryParams = this.objToUrlService.buildParametersFromSearch(this.trainingFilter);
    this.location.replaceState(this.router.url.split('?')[0], queryParams);
    this.isFilterSet = false;
    this.getAllTrainings();
    this.filterModal.hideModal();
  }

  getAllTrainings() {

    this.trainingService.getAllTrainings(this.trainingFilter)
      .then((response: TrainingListResponse) => {
        if (response.isSuccess) {
          this.trainings = [];
          this.trainings = response.trainings;
          if (this.upcomingTrainings.length === 0) {
            this.upcomingTrainings = response.upcomingTrainings;
          }

          if (this.ongoingTrainings.length === 0) {
            this.ongoingTrainings = response.trainings;
          }

          setTimeout(() => {

            this.dtElements.map((dt: DataTableDirective) => {
              if (dt.dtOptions && dt.dtOptions['id'] === 'upcoming') {
                if (dt.dtInstance) {
                  dt.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.destroy();
                    setTimeout(() => {
                      this.upcomingTrainings = response.upcomingTrainings;
                      this.upcomingTrigger.next();
                    }, 100);
                  });
                } else {
                  this.upcomingTrainings = response.upcomingTrainings;
                  this.upcomingTrigger.next();
                }
              } else {
                if (dt.dtInstance) {
                  dt.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.destroy();
                    setTimeout(() => {
                      this.ongoingTrainings = response.trainings;
                      this.completedTrigger.next();
                    }, 100);
                  })
                } else {
                  this.ongoingTrainings = response.trainings;
                  this.completedTrigger.next();
                }
              }
            });

          }, 100);
        }
      })
  }

  getAllTrainingTypes() {
    this.trainingService.getAllTrainingTypes()
      .then((response: SelectOptionResponse) => {
        if (response.isSuccess) {
          this.trainingTypes = response.options;
        }
      })
  }

  getAllTrainingCode () {
    this.trainingService.getAllTrainingCode()
    .then((response: SelectOptionResponse) => {
      if (response.isSuccess) {
        this.trainingCode = response.options;
      }
    })
  }

  getAllEmployees() {
    this.trainingService.getHrEmployeesForDropdown()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.employeesList = response.employees;
          this.setFilterSelections();
        }
      })

    this.trainingService.getEmployeesBaseInfo()
      .then((response: ReportingToResponse) => {
        if (response.isSuccess) {
          this.nomineesEmployeeList = response.employees;
        }
      })
  }

  showFilters() {
    this.filterModal.showModal();
  }

  selectMultiple(values: EmployeeBaseInfo[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.employeeId);
    }

    return item;
  }

  selectMultipleFilters(values: SelectOption[]) {
    let item = [];
    if (values) {
      item = values.map(m => m.value);
    }
    console.log('selectMultipleFilters ', item);
    return item;
  }

  reportingSearchFunction(term: string, item: EmployeeBaseInfo) {
    term = term.trim().toLowerCase();
    return item.employeeCode.trim().toLowerCase().indexOf(term) > -1 || item.employeeName.trim().toLowerCase().indexOf(term) > -1;
  }

  onDateChosen($event) {
    if ($event) {
      const date = moment($event)
        .format(this.datePickerOptions.dateInputFormat);

      if (!this.newTraining.dates) {
        this.newTraining.dates = [];
      }
      if (!this.newTraining.selectedDates) {
        this.newTraining.selectedDates = [];
      }

      if (this.newTraining.dates.some(s => s === date)) {
        this.newTraining.dates = this.newTraining.dates.filter(s => s !== date);
        this.newTraining.selectedDates = this.newTraining.selectedDates.filter(s => s.value !== date);
      } else {
        this.newTraining.selectedDates = [...this.newTraining.selectedDates, {
          label: date,
          value: date
        }];
        this.newTraining.dates.push(date);
      }
    }
    this.newTraining.selectedDate = null;
  }

  onDateDeselected($event: SelectOption[]) {
    this.newTraining.dates = $event.map(s => s.value);
  }

  addTrainingModal(form: NgForm) {
    this.isUpdating = false;
    if (form) {
      form.reset();
    }
    this.newTraining = new UpdateTrainingRequest();
    this.trainingModal.showModal();
  }

  addNewTraining(form: NgForm) {
    this.isProcessing = true;
    var dates = this.newTraining.dates.map(d =>  new Date(d));
    dates = _.orderBy(dates);
    var datesStr = dates.map(d => moment(d).format(this.datePickerOptions.dateInputFormat))
    this.newTraining.dates = datesStr;
    this.trainingService.updateTraining(this.newTraining)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.toaster.success('Training has been successfully added.');
          this.trainingModal.hideModal();
          form.reset();
          this.newTraining = new UpdateTrainingRequest();
          this.getAllTrainings();
        }
      }).finally(() => {
        this.isProcessing = false;
      })
  }

  updateTrainingNomineeList() {
    if ((this.newTraining.departments && this.newTraining.departments.length > 0)
      || (this.newTraining.designations && this.newTraining.designations.length > 0)
      || (this.newTraining.grades && this.newTraining.grades.length > 0)
      || (this.newTraining.locations && this.newTraining.locations.length > 0)) {
      this.updatingNominees = true;

      const employeeFilter: EmployeeListFilterRequest = new EmployeeListFilterRequest();
      employeeFilter.departments = this.newTraining.departments;
      employeeFilter.designations = this.newTraining.designations;
      employeeFilter.grades = this.newTraining.grades;
      employeeFilter.locations = this.newTraining.locations;

      this.trainingNominees = [];
      this.newTraining.nominees = [];
      this.trainingService.getAllEmployees(employeeFilter)
        .then((response: EmployeeListResponse) => {
          if (response.isSuccess) {
            this.trainingNominees = response.employees;

            this.trainingNominees.map(s => {
              s.label = s.name;
            });

            this.newTraining.nominees = this.trainingNominees.map(s => s.employeeId);
            this.newTraining.selectedNominees = this.trainingNominees;
          }
        })
        .finally(() => {
          this.updatingNominees = false;
        })
    }
  }

  deleteTrainingAlert(item: Training) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Training?',
      content: [
        'Are you sure you want to delete the created training. Once deleted this action cannot be undone.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete Training',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.deleteTraining,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  feedbackCloseAlert(item: Training) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Close Feedback For Training?',
      content: [
        'Are you sure you want to close the feedback for this training. Once closed this action cannot be undone.'
      ],
      confirmText: null,
      confirmButtonText: 'Close Feedback',
      cancelButtonText: 'Dont Close',
      onConfirm: this.closeFeedback,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  edit(training: Training) {
    this.getTrainingDetails(training.trainingId);
    this.trainingNominees = [];
    this.trainingModal.showModal();
  }

  getTrainingDetails(trainingId: string) {
    const payload: TrainingActionRequest = {
      trainingId: trainingId,
      getAllFeedbacks: true
    };
    this.subjectService.toggleLoading(true);
    this.trainingService.getTrainingDetails(payload)
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
            trainingCode: response.trainingCode,
            trainingTitle: response.trainingTitle,
            trainingCategory: response.trainingCategory,

            selectedDates: []
          };

          this.newTraining.selectedNominees = [];
          response.nominees.map(s => {
            const emp = new Employee();
            emp.code = s.code;
            emp.employeeId = s.employeeId;
            emp.name = s.name;
            emp.label = s.name;
            this.newTraining.selectedNominees.push(emp);
            this.newTraining.nominees.push(s.employeeId);
          });

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

          if (this.newTraining.trainingCode) {
            this.newTraining.trainingCodeSelection = this.trainingCode.find(
              d => this.newTraining.trainingCode === d.label
            );
          }

          if (this.newTraining.trainingCategory) {
            this.newTraining.trainingCategorySelection = this.trainingCategoryTypes.find(
              d => this.newTraining.trainingCategory === d.value
            );
          }

          // this.updateTrainingNomineeList();
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      });

  }

  confirmAlert(training: string) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Confirm Training?',
      content: [
        'Are you sure you want to confirm the training. Once you confirm the training, the details cannot be changed.'
      ],
      confirmText: null,
      confirmButtonText: 'Confirm Training',
      cancelButtonText: 'Dont Confirm',
      onConfirm: this.confirmTraining,
      data: training
    };
    this.subjectService.showSweetAlert(this.alertData, 'primary');
  }

  //NOMINEE
  showAddMoreNominee = false;
  newNominees: string[] = [];
  newNomineesSelected: EmployeeBaseInfo[] = [];

  acceptTrainingAlert(trainingId: string, nomineeId: string, type: string) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: 'Accept Training?',
      content: [
        'Are you sure you want to accept the nomination of the employee for this training?'
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
        'Are you sure you want to reject the nomination of the employee for this training? The HR access is final for the nominee. The nominee is not added to attendance if the nominee is rejected during starting the training.'
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

  addSelectedNominees() {
    this.isGettingNominees = true;
    const payload: AddMoreNomineesRequest = {
      trainingId: this.newTraining.trainingId,
      nominees: this.newNominees
    };
    this.trainingService.addNewNominees(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainingDetails(this.newTraining.trainingId);
          this.newNomineesSelected = [];
          this.newNominees = [];
        }
      })
      .finally(() => {
        this.isGettingNominees = false;
      })
  }


  // ATTENDANCE
  saveAttendance() {
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
    this.trainingService.fillAttendance(payload)
      .then((response: BaseResponse) => {
        if (response.isSuccess) {
          this.getTrainingDetails(this.newTraining.trainingId);
          this.newNomineesSelected = [];
          this.newNominees = [];
        }
      })
  }

}
