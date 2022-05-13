import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmployeeActionRequest, EmployeeCard, EmployeeCardResponse } from '../employee-details.model';

import { AppService } from 'src/app/app.service';
import { EmployeeService } from '../../employee.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service';
import { OrgChartNode } from 'src/app/app.model';
import { RoleSettingsService } from 'src/app/shared/services/role-settings.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ToastrService } from 'ngx-toastr';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  styleUrls: ['./employee-hierarchy.component.scss']
})
export class EmployeeHierarchyComponent implements OnInit {

  icon = '';
  isHr = false;
  employeeId = '';
  topNode: OrgChartNode;
  loggedInEmp: OrgChartNode;
  employees: EmployeeCard[] = [];

  loggedInUserScreen = true;
  haveAccess: boolean = false;
  role = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService,
    private appService: AppService,
    private roleSettingsService: RoleSettingsService
  ) {
    this.activatedRoute.data.subscribe((routeData) => {
      this.loggedInUserScreen = routeData && routeData.reportees ? false : true;
    });
  }

  ngOnInit() {
    this.role = this.employeeService.getCurrentUserRole();
    this.employeeId = this.employeeService.getEmployeeId();
    this.icon = this.employeeService.getSectionTypeIcon('hierarchy');
    const loggedInEmployeeInfo = this.localStorageService.getLoggedInUserInfo();
    this.isHr = loggedInEmployeeInfo.role === 'HR';
    this.getEmployeeOrgChart();
  }

  findAccess(data: EmployeeCardResponse) {
    const empAccess = data.empAccess;
    const hrAccess = data.hrAccess;
    const mgAccess = data.mgAccess;
    this.haveAccess = this.roleSettingsService.findAccess(this.role, hrAccess, empAccess, mgAccess, this.loggedInUserScreen);
  }

  getEmployeeOrgChart() {
    this.subjectService.toggleLoading(true);
    const payload: EmployeeActionRequest = {
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeOrgChart(payload)
      .then((response: EmployeeCardResponse) => {
        if (response.isSuccess) {
          this.employees = response.employees;
          this.findAccess(response);
          this.topNode = this.parseEmployeesToNodes(this.employees[0], null);
        }
      })
      .finally(() => {
        this.subjectService.toggleLoading(false);
      })
  }

  parseEmployeesToNodes(emp: EmployeeCard, allowClick?: boolean) {
    allowClick = allowClick ? allowClick : this.employeeId === emp.employeeId || this.isHr;
    const node: OrgChartNode = {
      name: emp.name,
      cssClass: allowClick ? emp.employeeId : '' + ' ' + this.employeeId === emp.employeeId ? 'org-current-emp' : '',
      title: emp.designation + ',    ' + emp.department,
      image: emp.image ? this.appService.fileBaseUrl.replace('/hrms', '') + emp.image : 'assets/avatar/avatar.svg',
      childs: []
    };
    if (emp.children) {
      emp.children.map(e => {
        const child = this.parseEmployeesToNodes(e, allowClick);
        node.childs.push(child);
      });
    }
    if (node.cssClass === this.employeeId) {
      this.loggedInEmp = node;
    }
    return node;
  }

  onEmployeeClick(node: OrgChartNode) {
    if (node.cssClass && node.cssClass !== ' ') {
      if (this.employeeId === node.cssClass.split(' ')[0]) {
        this.router.navigate(['/my-profile/']);
      } else {
        // this.router.navigate(['/employees/' + node.cssClass.split(' ')[0] + '/hierarchy']);
      }
    }
  }
  public convetToPDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 277;
      var pageHeight = 295;
      console.log(canvas.height, canvas.width, imgWidth);
      var imgHeight = (canvas.height * imgWidth / canvas.width);
      var heightLeft = imgHeight;
      console.log(imgWidth, imgHeight);

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a3');
      var position = 10;
      pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
}
