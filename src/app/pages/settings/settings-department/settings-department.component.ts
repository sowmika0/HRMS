import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableParameters } from 'src/app/app.constants';
import { SelectOption, SweetAlertValue } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { SubjectService } from 'src/app/shared/services/subject.service';

import { CompanysettingsResponse, Department, Designation } from '../settings.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-department',
  templateUrl: './settings-department.component.html',
  styleUrls: ['./settings-department.component.scss']
})
export class SettingsDepartmentComponent implements OnInit {

  @Input('icon') icon: string = 'fas fa-battery-empty';
  @Input('departments') departments: Department[] = [];
  
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('departmentModal', { static: false }) departmentModal: CustomModalComponent;
  @ViewChild('designationModal', { static: false }) designationModal: CustomModalComponent;

  tempId = 0;
  isUpdating = false;
  designationRefId = 0;
  isProcessing = false;
  isDepartmentAdded = false;
  isDesignationAdded = false;
  isDesignationUpdating = false;
  dtTrigger = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  activeDepartments: Department[] = [];
  activeDesignations: Designation[] = [];
  department: Department = new Department();
  selectableDesignations: SelectOption[] = [];
  designation: Designation = new Designation();
  alertData: SweetAlertValue = new SweetAlertValue();

  constructor(
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.icon = this.settingsService.getSectionTypeIcon('departments');
    this.departments = this.settingsService.getCompanySettingsValue().departments;
    if (!this.departments) {
      this.departments = [];
    }
    this.setActiveDepartments();
    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 3
        },
      ]
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private delete = (item: Department) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveDepartments();
    this.updateCompanySettings('delete')
  }

  private deleteDesignation = (item: Designation) => {
    item.isActive = false;
    item.employeesCount = 0;
    this.setActiveDesignations();
    this.organizeReportingTo();
  }

  updateCompanySettings(type: string) {
    this.isProcessing = true;
    this.settingsService.updateCompanySettings('Departments', this.departments)
      .then((response: CompanysettingsResponse) => {
        if (response.isSuccess) {
          if (type === 'edit') {
            this.toaster.success('Updated company department details successfully.');
          } else {
            this.toaster.success('Company department deleted successfully.');
          }

          this.settingsService.setCompanySettingsValue(response);
          this.departments = response.departments;
          this.setActiveDepartments();
          
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        }
      })
      .finally(() => { this.isProcessing = false; });
  }

  add(form: NgForm) {
    this.isDepartmentAdded = false;
    form.reset();
    this.isUpdating = false;
    this.department = new Department();
    this.department.designations = [];
    this.setActiveDesignations();
    this.departmentModal.showModal();
  }

  addDesignation(form: NgForm) {
    this.isDesignationAdded = false;
    form.reset();
    this.isDesignationUpdating = false;
    this.designation = new Designation();
    this.setSelectableDesignations();
    this.designationModal.showModal();
  }

  edit(item: Department) {
    this.isDepartmentAdded = false;
    this.isUpdating = true;
    this.department = Object.assign({}, item);
    // this.setActiveDesignations();
    this.organizeReportingTo();
    this.departmentModal.showModal();
  }

  editDesignation(item: Designation) {
    this.isDesignationAdded = false;
    this.isDesignationUpdating = true;
    this.designation = Object.assign({}, item);
    this.setSelectableDesignations(item);
    this.designationModal.showModal();
  }

  addOrUpdate() {
    const department = Object.assign({}, this.department);

    const activeOthers = this.activeDepartments.filter(a =>
      department.departmentId
        ? a.departmentId !== department.departmentId
        : a.tempId
          ? a.tempId !== department.tempId
          : true);

    this.isDepartmentAdded = activeOthers.find(a => a.name.trim().toLowerCase() === department.name.trim().toLowerCase())
      ? true
      : false;
    if (!this.isDepartmentAdded) {
      if (!this.isUpdating) {
        department.isActive = true;
        department.employeesCount = 0;
        department.tempId = ++this.tempId;
        this.departments.push(department);
        this.setActiveDepartments();
      } else {
        if (department.departmentId) {
          const addedDepartment = this.departments.find(l => l.departmentId === department.departmentId);
          if (addedDepartment) {
            addedDepartment.name = department.name;
            addedDepartment.description = department.description;
            addedDepartment.designations = department.designations;
            addedDepartment.activeDesignationsCount = addedDepartment.designations.filter(s => s.isActive).length;
          }
        } else {
          const addedDepartment = this.departments.find(l => l.departmentId === department.departmentId);
          if (addedDepartment) {
            addedDepartment.name = department.name;
            addedDepartment.description = department.description;
            addedDepartment.designations = department.designations;
            addedDepartment.activeDesignationsCount = addedDepartment.designations.filter(s => s.isActive).length;
          }
        }
      }
      this.updateCompanySettings('edit');
      this.departmentModal.hideModal();
    }

  }

  addOrUpdateDesignation() {
    if (!this.department.designations) {
      this.department.designations = [];
    }

    const designation = Object.assign({}, this.designation);

    const activeOthers = this.activeDesignations.filter(a =>
      designation.designationId
        ? a.designationId !== designation.designationId
        : a.tempId
          ? a.tempId !== designation.tempId
          : true);

    this.isDesignationAdded = activeOthers.find(a => a.name === designation.name)
      ? true
      : false;
    if (!this.isDesignationAdded) {
      if (!this.isDesignationUpdating) {
        designation.isActive = true;
        designation.employeesCount = 0;
        designation.refId = ++this.designationRefId;
        designation.tempId = designation.refId;
        this.department.designations.push(designation);
        this.setActiveDesignations();
        this.department.activeDesignationsCount += 1;
      } else {
        if (designation.designationId) {
          const addedDesignation = this.department.designations
            .find(l => l.designationId === designation.designationId);
          if (addedDesignation) {
            addedDesignation.name = designation.name;
            addedDesignation.description = designation.description;
            addedDesignation.reportingTo = designation.reportingTo;
            addedDesignation.reportingToSelection = designation.reportingToSelection;
          }
        } else {
          const addedDesignation = this.department.designations
            .find(l => l.tempId === designation.tempId);
          if (addedDesignation) {
            addedDesignation.name = designation.name;
            addedDesignation.description = designation.description;
            addedDesignation.reportingTo = designation.reportingTo;
            addedDesignation.reportingToSelection = designation.reportingToSelection;
          }
        }
      }

      this.setSelectableDesignations();
      this.designationModal.hideModal();
    }
  }

  setSelectableDesignations(item?: Designation) {
    this.setActiveDesignations();

    this.selectableDesignations = [];
    this.activeDesignations
      .map(d => {
        if (!item || ((!d.designationId || d.designationId !== item.designationId) && (!d.refId || d.refId !== item.refId))) {
          const option: SelectOption = {
            label: d.name,
            value: '' + (d.designationId ? d.designationId : d.refId)
          };
          this.selectableDesignations.push(option);
        }
      });

    this.organizeReportingTo();
  }

  organizeReportingTo() {
    this.activeDesignations.map(d => {
      if (d.reportingTo) {
        const reportingTo = this.activeDesignations.find(s => (s.designationId ? s.designationId : '' + s.refId) === d.reportingTo);
        if (reportingTo) {
          d.reportingToSelection = {
            label: reportingTo.name,
            value: d.reportingTo
          };
        } else {
          d.reportingTo = '';
          d.reportingToSelection = null;
        }
      }
    });
  }

  onReportingToChange(reportingTo: SelectOption) {
    if (reportingTo) {
      this.designation.reportingTo = reportingTo.value;
    } else {
      this.designation.reportingTo = '';
    }
  }

  setActiveDepartments() {
    this.departments = this.departments.filter(i => i.departmentId || (!i.departmentId && i.isActive));
    this.activeDepartments = this.departments.filter(i => i.isActive);
    // this.activeDepartments.map(t => {
    //   t.activeDesignationsCount = t.designations.filter(s => s.isActive).length;
    // })
  }

  setActiveDesignations() {
    this.department.designations =
      this.department.designations.filter(i => i.designationId || (!i.designationId && i.isActive));
    this.activeDesignations = this.department.designations.filter(i => i.isActive);
  }

  deleteAlert(item: Department) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Department?',
      content: [
        'When you delete a department, it will be removed from the list of all the departments and this action cannot be undone.',
        'Please click the save department button in the bottom to save the changes made.'
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.delete,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }

  deleteDesignationAlert(item: Designation) {
    this.alertData = {
      emoji: 'assets/emoji/sad.png',
      header: 'Delete Designation?',
      content: [
        'When you delete a designation, it will be removed from the list of all the designations for the department and this action cannot be undone.',
      ],
      confirmText: null,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Dont Delete',
      onConfirm: this.deleteDesignation,
      data: item
    };
    this.subjectService.showSweetAlert(this.alertData, 'danger');
  }
}
