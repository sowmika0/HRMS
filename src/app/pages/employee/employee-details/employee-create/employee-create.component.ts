import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectOption, SelectOptionResponse } from 'src/app/app.model';
import { CustomModalComponent } from 'src/app/shared/components/custom-modal/custom-modal.component';
import { EmployeeService } from '../../employee.service';
import { CreateEmployeeRequest, CreateEmployeeResponse } from '../employee-details.model';
// import { EmployeeService } from '../employee.service';

@Component({
    selector: 'app-create-employee',
    templateUrl: './employee-create.component.html',
    styleUrls: ['./employee-create.scss']
})
export class EmployeeCreateComponent implements OnInit {
    @Input('createEmployeeModal') createEmployeeModal: CustomModalComponent;

    isProcessing = false;
    isEmailAlreadyAdded = false

    newEmployee: CreateEmployeeRequest = new CreateEmployeeRequest();
    employeeRoles: SelectOption[] = [];

    constructor(
        private router: Router,
        // private subjectService: SubjectService,
        private employeeService: EmployeeService,
        private toaster: ToastrService,
    ) { }

    ngOnInit() {
        // form.reset();
        this.isEmailAlreadyAdded = false;
        this.newEmployee = new CreateEmployeeRequest();
        this.newEmployee.canLogin = false;
        this.getRolesForCompany();
    }

    getRolesForCompany() {
        this.employeeService.getRolesForDropdown()
            .then((response: SelectOptionResponse) => {
                if (response.isSuccess) {
                    this.employeeRoles = response.options;
                }
            });
    }

    hideModal() {
        this.createEmployeeModal.hideModal()
    }

    addNewEmployee(form: NgForm) {
        if (!form.valid) {
            // Object.keys(form.controls).forEach(field => {
            //   form.hasError()
            // });
        } else {
            this.isProcessing = true;
            this.isEmailAlreadyAdded = false;
            this.employeeService.createNewEmployee(this.newEmployee)
                .then((response: CreateEmployeeResponse) => {
                    if (response.isSuccess) {
                        if (response.isCreated) {
                            this.router.navigate(['/employees/' + response.employeeId]);
                            this.toaster.success(
                                'New employee created and you are navigated to the employee details page of the newly created employee.');
                        } else {
                            this.isEmailAlreadyAdded = true;
                        }
                    }
                })
                .finally(() => {
                    this.isProcessing = false;
                });
        }
    }

}