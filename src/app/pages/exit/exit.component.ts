import * as moment from 'moment';

import { BaseResponse, SelectOption, SelectOptionResponse, SweetAlertValue, UserStorageInformation } from 'src/app/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableParameters, DatePickerOptions, RegEx } from 'src/app/app.constants';
import {
  Employee,
  EmployeeExitAsset,
  EmployeeExitAssetDetail,
  EmployeeExitAssetDetailResponse,
  EmployeeExitAssetResponse,
  EmployeeResignationDetail,
  EmployeeResignationRequest,
  EmployeeResignationResponse,
  ExitFormRequest,
  IEmployeeReHire,
  RehireEmployeeRequest,
  RehireEmployeeResponse,
  UpdateEmployeeExit,
  UpdateEmployeeExitAsset
} from 'src/app/pages/employee/employee-details/employee-details.model';

import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from 'src/app/pages/employee/employee.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.component.html',
  styleUrls: ['./exit.component.scss']
})

export class ExitComponent implements OnInit {

  @ViewChild('rejectReasonModal', { static: false }) rejectReasonModal: CustomModalComponent;
  @ViewChild('hrApproveModal', { static: false }) hrApproveModal: CustomModalComponent;
  @ViewChild('createEmployeeModal', { static: false }) createEmployeeModal: CustomModalComponent;
  @ViewChild('rehireEmployeeModal', { static: false }) rehireEmployeeModal: CustomModalComponent;
  @ViewChild('moreDescriptionModal', { static: false }) moreDescriptionModal: CustomModalComponent;
  @ViewChild('empExitFormModal', { static: false }) empExitFormModal: CustomModalComponent;
  @ViewChild('hrFeedbackModal', { static: false }) hrFeedbackModal: CustomModalComponent;
  @ViewChild('resignationModal', { static: false }) resignationModal: CustomModalComponent;
  @ViewChild('hodFeedbackModal', { static: false }) hodFeedbackModal: CustomModalComponent;
  @ViewChild('assetSubmitFormModal', { static: false }) assetSubmitFormModal: CustomModalComponent;
  @ViewChild('hrClearanceModal', { static: false }) hrClearanceModal: CustomModalComponent;
  @ViewChild('hrCompleteClearanceModal', { static: false }) hrCompleteClearanceModal: CustomModalComponent;

  regex = RegEx;
  employeeId = '';
  employeeExitId = 0;
  userInfo = {} as UserStorageInformation;
  isProcessing = false;
  dtOptionsWithHorizontalScroll: DataTables.Settings = {};
  dtOptions: DataTables.Settings = {};
  alertData: SweetAlertValue = new SweetAlertValue();
  datePickerOptions = DatePickerOptions.datePicker;
  employeeResignationRequest: EmployeeResignationRequest = new EmployeeResignationRequest();
  updateEmployeeExit: UpdateEmployeeExit = new UpdateEmployeeExit();
  employeeResignationDetail: EmployeeResignationDetail = new EmployeeResignationDetail();
  myReporteeResignationDetail: EmployeeResignationDetail = new EmployeeResignationDetail();
  empResignationDetail: EmployeeResignationDetail = new EmployeeResignationDetail();
  myReporteesResignationDetails: EmployeeResignationDetail[] = [];
  minDate = new Date(moment().add(1, 'days').format(DatePickerOptions.datePicker.dateInputFormat));
  displayExitModal = false;
  displayHODModal = false;
  displayHRModal = false;
  displayResignModal = false;
  dateOfResignation = new Date(moment().format(DatePickerOptions.datePicker.dateInputFormat));
  exitAssetsEmployees: EmployeeExitAsset[] = [];
  employeeExitAssetDetails: EmployeeExitAssetDetail[] = [];
  employeeRehireDetailsReport: IEmployeeReHire[] = [];
  printedDate = moment(new Date()).format(DatePickerOptions.datePicker.dateTimeFormat);
  currentDescirpition: string = '';
  currentEmployeeName: string = '';
  currentEmployeeCode: string = '';
  // employee rehire
  isEmailAlreadyAdded = false;
  selectedRehireEmployee: Employee = new Employee();
  rehireEmployee: RehireEmployeeRequest = new RehireEmployeeRequest();
  employeeRoles: SelectOption[] = [];
  constructor(private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private subjectService: SubjectService,
    private router: Router,
    private toastr: ToastrService) { }


  ngOnInit() {
    this.userInfo = this.localStorageService.getLoggedInUserInfo();
    this.employeeId = this.userInfo.employeeId;
    this.dateOfResignation = new Date(moment().format(DatePickerOptions.datePicker.dateInputFormat));
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [],
      order: [[1, "asc"]],
      search: true,
      searching: true
    });
    this.subjectService.toggleLoading(true);
    this.employeeService.getEmployeeResignationDetails().then((response: EmployeeResignationResponse) => {
      if (response.isSuccess && response.employeeExits
        && response.employeeExits.length > 0) {

        if (response.employeeExits[0].exitId !== 0) {
          this.employeeResignationDetail = response.employeeExits[0];

          if (!response.employeeExits[0].isRevoked && !response.employeeExits[0].status.includes("Rejected")) {
            this.employeeResignationRequest = {
              ...this.employeeResignationRequest,
              resignationReason: this.employeeResignationDetail.employeeResignationReason,
              preferredRelievingDate: new Date(
                moment(this.employeeResignationDetail.preferredRelievingDate)
                  .add(10, 'hours')
                  .format(this.datePickerOptions.dateTimeFormat)
              )
            }
            this.dateOfResignation = new Date(moment(this.employeeResignationDetail.resignationDate).format(DatePickerOptions.datePicker.dateInputFormat));
            this.employeeResignationDetail.relievingDateAsPerPolicy = new Date(moment(response.employeeExits[0].relievingDateAsPerPolicy).format(DatePickerOptions.datePicker.dateInputFormat));;
          }
          else {
            this.employeeResignationDetail.relievingDate = null;
          }
        }
        else {
          this.employeeResignationDetail.relievingDateAsPerPolicy = new Date(moment(response.employeeExits[0].relievingDateAsPerPolicy).format(DatePickerOptions.datePicker.dateInputFormat));
        }
      }
    }).finally(() => {
      this.getMyReporteesResignationDetails();
      this.getExitEmployeesAsset();
      this.subjectService.toggleLoading(false);
    });

    this.getReHireDetails();
    this.getRolesForCompany();


    this.dtOptionsWithHorizontalScroll = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 7
        },
        {
          orderable: false,
          targets: 8
        },
        {
          orderable: false,
          targets: 9
        },
        {
          orderable: false,
          targets: 10
        },
        {
          orderable: false,
          targets: 13
        },
      ],
      order: [[1, "asc"]],
      search: true,
      scrollY: '250px',
      searching: true
    });
  }

  viewEmployeeDetails(employee: Employee) {
    this.router.navigate(['/employees/' + employee.employeeId]);
  }

  addNewEmployeeModal(employee: Employee) {
    // this.createEmployeeModal.showModal();
    this.selectedRehireEmployee = employee;
    console.log('selectedRehireEmployee ', this.selectedRehireEmployee);
    this.rehireEmployee.oldEmail = this.selectedRehireEmployee.emailId;
    this.rehireEmployeeModal.showModal();
  }

  getRolesForCompany() {
    this.employeeService.getRolesForDropdown()
        .then((response: SelectOptionResponse) => {
            if (response.isSuccess) {
                this.employeeRoles = response.options;
            }
        });
}

  getReHireDetails = async () => {
    const reHireResponse: any = await this.employeeService.getEmployeeRehire();
    this.employeeRehireDetailsReport = reHireResponse.employeeRehireDetails;
    console.log(this.employeeRehireDetailsReport);
    this.employeeRehireDetailsReport.map(report => {
      report.formattedDateOfJoining = moment(report.dateofJoing).format(this.datePickerOptions.dateInputFormat)
      report.formattedDateOfReliieving = moment(report.dateofRelieving).format(this.datePickerOptions.dateInputFormat)
    })
  }

  getMyReporteesResignationDetails = () => {
    this.myReporteesResignationDetails = [];
    this.employeeService.getMyReporteesResignationDetails().then((response: EmployeeResignationResponse) => {
      if (response.isSuccess && response.employeeExits) {
        this.myReporteesResignationDetails = response.employeeExits;
      }
    })
  }

  submitResignationAlert = (resignationForm: NgForm) => {
    if (resignationForm.valid) {
      this.alertData = {
        emoji: "assets/emoji/sad.png",
        header: "Submit Resignation?",
        content: ["Are you sure you want to submit your resignation."],
        confirmText: null,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        onConfirm: this.submitResignation,
        data: resignationForm,
      };
      this.subjectService.showSweetAlert(this.alertData, "danger");
    }
  }

  printPage() {
    window.print();
  }

  submitResignation = (resignationForm: NgForm) => {
    this.isProcessing = true;

    this.employeeResignationRequest.preferredRelievingDate =
      new Date(
        moment(this.employeeResignationRequest.preferredRelievingDate)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      );

    this.employeeResignationRequest.relievingDateAsPerPolicy =
      new Date(
        moment(this.employeeResignationDetail.relievingDateAsPerPolicy)
          .add(10, 'hours')
          .format(this.datePickerOptions.dateTimeFormat)
      );

    this.employeeResignationRequest = {
      ...this.employeeResignationRequest,
      employeeId: this.employeeId
    }

    this.employeeService.submitResignation(this.employeeResignationRequest).then((response: BaseResponse) => {
      if (response.isSuccess) {
        resignationForm.reset();

        this.employeeService.getEmployeeResignationDetails().then((response: EmployeeResignationResponse) => {
          if (response.isSuccess && response.employeeExits
            && response.employeeExits.length > 0) {
            this.employeeResignationDetail = response.employeeExits[0];
            this.employeeResignationRequest = {
              ...this.employeeResignationRequest,
              resignationReason: this.employeeResignationDetail.employeeResignationReason,
              preferredRelievingDate: new Date(moment(this.employeeResignationDetail.preferredRelievingDate).add(10, 'hours').format(DatePickerOptions.datePicker.dateTimeFormat))
            }
            this.dateOfResignation = new Date(moment(this.employeeResignationDetail.resignationDate).format(DatePickerOptions.datePicker.dateInputFormat));
          }
        });
      }
    }).finally(() => {
      this.isProcessing = false;
      this.toastr.success("Resignation has been submitted. Please contact HR for further information!", null, { timeOut: 10000 })
    })
  }

  canShowMoreDescription(description: string) {
    if (description != null && description.length > 20) {
      return true;
    }
    return false;
  }

  showMoreDescription(current: EmployeeResignationDetail, description: string) {
    this.currentDescirpition = description; // current.employeeResignationReason;
    this.currentEmployeeName = current.employeeName;
    this.currentEmployeeCode = current.employeeCode;
    this.moreDescriptionModal.showModal();
  }

  hrReleivingDateModal = (hrApprovalForm: NgForm, myReporteeResignation: EmployeeResignationDetail) => {
    hrApprovalForm.reset();

    this.updateEmployeeExit = {
      ...this.updateEmployeeExit,
      employeeExitId: myReporteeResignation.exitId,
      employeeId: myReporteeResignation.employeeId,
      feedback: "",
      status: "Approved"
    }

    setTimeout(() => {
      this.hrApproveModal.showModal();
    }, 500);
  }

  approveResignationAlert = (myReporteeResignation: EmployeeResignationDetail) => {
    this.alertData = {
      emoji: "assets/emoji/sad.png",
      header: "Approve Resignation?",
      content: ["Are you sure you want to approve resignation."],
      confirmText: null,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      onConfirm: this.approveResignation,
      data: myReporteeResignation,
    };
    this.subjectService.showSweetAlert(this.alertData, "danger");
  }

  approveResignation = (myReporteeResignation: EmployeeResignationDetail) => {
    this.subjectService.toggleLoading(true);

    if (myReporteeResignation !== null) {
      this.updateEmployeeExit = {
        ...this.updateEmployeeExit,
        employeeExitId: myReporteeResignation.exitId,
        employeeId: myReporteeResignation.employeeId,
        status: "Approved"
      }
    }

    if (this.updateEmployeeExit.relievingDate) {
      this.updateEmployeeExit.relievingDate =
        new Date(
          moment(this.updateEmployeeExit.relievingDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat)
        );
    }

    this.employeeService.updateEmployeeExit(this.updateEmployeeExit).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.hrApproveModal.hideModal();
        this.getMyReporteesResignationDetails();
      }
    }).finally(() => {
      this.subjectService.toggleLoading(false);
    })
  }

  rejectResignationModal = (rejectForm: NgForm, myReporteeResignation: EmployeeResignationDetail) => {
    rejectForm.reset();

    this.updateEmployeeExit = {
      ...this.updateEmployeeExit,
      employeeExitId: myReporteeResignation.exitId,
      employeeId: myReporteeResignation.employeeId,
      feedback: "",
      status: "Rejected"
    }

    setTimeout(() => {
      this.rejectReasonModal.showModal();
    }, 500);
  }

  rejectResignationAlert = (rejectForm: NgForm) => {
    if (rejectForm.valid) {
      this.alertData = {
        emoji: "assets/emoji/smile.png",
        header: "Reject Resignation?",
        content: ["Are you sure you want to reject the resignation."],
        confirmText: null,
        confirmButtonText: "Reject",
        cancelButtonText: "Cancel",
        onConfirm: this.rejectEmpResignation,
        data: rejectForm,
      };
      this.subjectService.showSweetAlert(this.alertData, "primary");
    }
  }

  rejectEmpResignation = (rejectForm: NgForm) => {
    this.subjectService.toggleLoading(true);

    this.employeeService.updateEmployeeExit(this.updateEmployeeExit).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.rejectReasonModal.hideModal();
        this.getMyReporteesResignationDetails();
      }
    }).finally(() => {
      this.subjectService.toggleLoading(false);
    })
  }

  revokeResignationAlert = (myReporteeResignation: EmployeeResignationDetail) => {
    this.alertData = {
      emoji: "assets/emoji/smile.png",
      header: "Revoke Resignation?",
      content: ["Are you sure you want to revoke resignation."],
      confirmText: null,
      confirmButtonText: "Revoke",
      cancelButtonText: "Cancel",
      onConfirm: this.revokeResignation,
      data: myReporteeResignation,
    };
    this.subjectService.showSweetAlert(this.alertData, "primary");
  }

  revokeResignation = (myReporteeResignation: EmployeeResignationDetail) => {
    this.subjectService.toggleLoading(true);

    this.updateEmployeeExit = {
      ...this.updateEmployeeExit,
      employeeExitId: myReporteeResignation.exitId,
      employeeId: myReporteeResignation.employeeId,
      isRevoked: true
    }

    this.employeeService.updateEmployeeExit(this.updateEmployeeExit).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.getMyReporteesResignationDetails();
      }
    }).finally(() => {
      this.subjectService.toggleLoading(false);
    })
  }

  showExitFormModal = (employeeExit: EmployeeResignationDetail) => {
    this.employeeExitId = employeeExit.exitId;
    this.empResignationDetail = employeeExit;

    this.displayExitModal = true;
    this.displayHODModal = false;
    this.displayHRModal = false;

    setTimeout(() => {
      this.empExitFormModal.showModal();
    }, 500);
  }

  showResignationModal = (employeeExit: EmployeeResignationDetail) => {
    this.empResignationDetail = employeeExit;

    this.displayResignModal = true
    this.displayExitModal = false;
    this.displayHODModal = false;
    this.displayHRModal = false;

    setTimeout(() => {
      this.resignationModal.showModal();
    }, 500);
  }

  showHodFeedbackModal = (employeeExit: EmployeeResignationDetail) => {
    this.myReporteeResignationDetail = employeeExit;

    this.displayExitModal = false;
    this.displayHODModal = true;
    this.displayHRModal = false;

    this.employeeExitId = employeeExit.exitId;
    setTimeout(() => {
      this.hodFeedbackModal.showModal();
    }, 500);
  }

  showHrFeedbackModal = (employeeExit: EmployeeResignationDetail) => {
    this.myReporteeResignationDetail = employeeExit;

    this.displayExitModal = false;
    this.displayHODModal = false;
    this.displayHRModal = true;

    this.employeeExitId = employeeExit.exitId;
    setTimeout(() => {
      this.hrFeedbackModal.showModal();
    }, 500);
  }

  showInitiateClearanceModal = (myReporteeResignation: EmployeeResignationDetail) => {
    this.updateEmployeeExit = {
      ...this.updateEmployeeExit,
      employeeExitId: myReporteeResignation.exitId,
      employeeId: myReporteeResignation.employeeId,
      relievingDate: new Date(moment(myReporteeResignation.relievingDate).add(10, 'hours').format(DatePickerOptions.datePicker.dateTimeFormat)),
      status: 'Exit-Processing'
    }

    setTimeout(() => {
      this.hrClearanceModal.showModal();
    }, 500);
  }

  initiateEmployeeClearanceAlert = () => {
    this.alertData = {
      emoji: "assets/emoji/smile.png",
      header: "Initiate Clearance?",
      content: ["Are you sure you want to initiate clearance."],
      confirmText: null,
      confirmButtonText: "Initiate",
      cancelButtonText: "Cancel",
      onConfirm: this.initiateEmployeeClearance,
      data: null,
    };
    this.subjectService.showSweetAlert(this.alertData, "primary");
  }

  initiateEmployeeClearance = () => {
    this.subjectService.toggleLoading(true);

    if (this.updateEmployeeExit.relievingDate) {
      this.updateEmployeeExit.relievingDate =
        new Date(
          moment(this.updateEmployeeExit.relievingDate)
            .add(10, 'hours')
            .format(this.datePickerOptions.dateTimeFormat)
        );
    }

    this.employeeService.updateEmployeeExit(this.updateEmployeeExit).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.getMyReporteesResignationDetails();
        this.getExitEmployeesAsset();
      }
    }).finally(() => {
      this.hrClearanceModal.hideModal();
      this.subjectService.toggleLoading(false);
    })
  }

  showCompleteClearanceModal = (myReporteeResignation: EmployeeResignationDetail) => {
    this.updateEmployeeExit = {
      ...this.updateEmployeeExit,
      employeeExitId: myReporteeResignation.exitId,
      employeeId: myReporteeResignation.employeeId,
      status: 'Completed'
    }

    setTimeout(() => {
      this.hrCompleteClearanceModal.showModal();
    }, 500);
  }

  completeEmployeeClearanceAlert = () => {
    this.alertData = {
      emoji: "assets/emoji/smile.png",
      header: "Final HR Clearance?",
      content: ["Are you sure you want to complete final HR Clearance."],
      confirmText: null,
      confirmButtonText: "Complete",
      cancelButtonText: "Cancel",
      onConfirm: this.completeEmployeeClearance,
      data: null,
    };
    this.subjectService.showSweetAlert(this.alertData, "primary");
  }

  completeEmployeeClearance = () => {
    this.subjectService.toggleLoading(true);

    this.employeeService.updateEmployeeExit(this.updateEmployeeExit).then((response: BaseResponse) => {
      if (response.isSuccess) {
        this.getMyReporteesResignationDetails();
      }
    }).finally(() => {
      this.hrCompleteClearanceModal.hideModal();
      this.subjectService.toggleLoading(false);
    })
  }

  getExitEmployeesAsset = () => {
    this.subjectService.toggleLoading(true);

    this.employeeService.getAllEmployeeExitWithAssets()
      .then((response: EmployeeExitAssetResponse) => {
        if (response.isSuccess && response.employeeExitAssets && response.employeeExitAssets.length > 0) {
          this.exitAssetsEmployees = response.employeeExitAssets;
        }
      }).finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  showAssetSubmitFormModal = (employeeExitId: number, exitAssetsEmployee: EmployeeResignationDetail) => {
    this.empResignationDetail = exitAssetsEmployee;
    this.employeeExitId = employeeExitId;
    const payload: ExitFormRequest = {
      employeeExitId: employeeExitId
    };

    this.employeeService.getExitEmployeeAssetDetails(payload)
      .then((response: EmployeeExitAssetDetailResponse) => {
        if (response.isSuccess) {
          this.employeeExitAssetDetails = [];
          this.employeeExitAssetDetails = response.employeeExitAssetDetails;
          // && response.employeeExitAssetDetails.length > 0
          // && response.employeeExitAssetDetails;
        }
      })

    setTimeout(() => {
      this.assetSubmitFormModal.showModal();
    }, 500);
  }

  updateExitEmployeeAssetStatus = (employeeExitAssetDetail: EmployeeExitAssetDetail) => {
    this.subjectService.toggleLoading(true);

    var status = 'Approved';
    if (employeeExitAssetDetail.loggedInUserAssetOwner && !employeeExitAssetDetail.isDefaultRMHODAssets) {
      status = 'Completed';
    }
    // if(!employeeExitAssetDetail.isDefaultOwnerAssets && !employeeExitAssetDetail.isDefaultRMHODAssets){
    //   if(employeeExitAssetDetail.loggedInUserAssetOwner && employeeExitAssetDetail.status === 'Pending'){
    //     status = 'Owner-Approved';
    //   }
    // }
    // else {
    //   if(employeeExitAssetDetail.isDefaultOwnerAssets){
    //     status = 'Completed'
    //   }
    // }


    const payload: UpdateEmployeeExitAsset = {
      employeeExitAssetId: employeeExitAssetDetail.employeeAssetId,
      status: status,
      breakageFee: employeeExitAssetDetail.assetBreakageFee,
      comments: employeeExitAssetDetail.comments,
      hodComments: employeeExitAssetDetail.hodComments
    }
    this.employeeService.updateExitEmployeeAssetDetails(payload).then((response: BaseResponse) => {
      if (response.isSuccess) {
        const payload: ExitFormRequest = {
          employeeExitId: this.employeeExitId
        };
        this.employeeService.getExitEmployeeAssetDetails(payload)
          .then((response: EmployeeExitAssetDetailResponse) => {
            if (response.isSuccess && response.employeeExitAssetDetails
              && response.employeeExitAssetDetails.length > 0) {
              this.employeeExitAssetDetails = response.employeeExitAssetDetails;
            }
          })
      }
    }).finally(() => {
      this.subjectService.toggleLoading(false);
    })
  }

  rehireOldEmployee(form: NgForm) {
    if (!form.valid) {
      // Object.keys(form.controls).forEach(field => {
      //   form.hasError()
      // });
    } else {
      console.log('rehire employee ', this.rehireEmployee);
      this.isProcessing = true;
      this.isEmailAlreadyAdded = false;
      this.employeeService.rehireEmployee(this.rehireEmployee)
        .then((response: RehireEmployeeResponse) => {
          if (response.isSuccess) {
            this.toastr.success(
              'Rehire Employee details are added');
              this.rehireEmployeeModal.hideModal();
          }
        })
        .finally(() => {
          this.isProcessing = false;
        });
    }
  }

  hideRehireModal() {
    this.rehireEmployeeModal.hideModal();
  }
}
