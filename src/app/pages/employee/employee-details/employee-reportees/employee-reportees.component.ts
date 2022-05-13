import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeActionRequest, EmployeeListResponse } from '../employee-details.model';

import { DataTableParameters } from 'src/app/app.constants';
import { EmployeeService } from '../../employee.service';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-reportees',
  templateUrl: './employee-reportees.component.html',
  styleUrls: ['./employee-reportees.component.scss']
})
export class EmployeeReporteesComponent implements OnInit {

  icon = '';
  employeeId = '';
  isProcessing = false;
  employees: Employee[] = [];
  dtOptions: DataTables.Settings = {};

  loggedInUserScreen = true;
  haveAccess: boolean = false;
  role = '';

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
    this.employeeId = this.employeeService.getEmployeeId();
    this.icon = this.employeeService.getSectionTypeIcon('reportees');

    this.dtOptions = Object.assign(DataTableParameters.dataTableOptions, {
      columnDefs: [
        {
          orderable: false,
          targets: 0
        },
        {
          orderable: false,
          targets: 9
        }
      ]
    });
    this.getAllEmployees();
  }

  view(employee: Employee) {
    this.router.navigate(['/employees/' + employee.employeeId]);
  }

  findAccess(data: EmployeeListResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getAllEmployees() {
    this.employees = [];
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.subjectService.toggleLoading(true);
    this.employeeService.getEmployeeReportees(payload)
      .then((response: EmployeeListResponse) => {
        if (response.isSuccess) {
          this.findAccess(response);
          this.employees = response.employees;
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

}
