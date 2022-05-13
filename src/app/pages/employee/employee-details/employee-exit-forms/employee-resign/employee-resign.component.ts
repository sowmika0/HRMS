import { Component, Input } from "@angular/core";

import { CustomModalComponent } from "./../../../../../shared/components/custom-modal/custom-modal.component";
import {
    EmployeeResignationDetail,
} from "./../../employee-details.model";
import { DatePickerOptions } from 'src/app/app.constants';
import * as moment from "moment";

@Component({
    selector: "app-employee-resign",
    templateUrl: "./employee-resign.component.html",
    // styleUrls: ["./hod-feedback.component.scss"],
})
export class EmployeeResignComponent {
    @Input("empResignationDetail") employeeExit: EmployeeResignationDetail = new EmployeeResignationDetail();
    @Input("feedbackModal") feedbackModal: CustomModalComponent;

    printedDate = moment(new Date()).format(DatePickerOptions.datePicker.dateTimeFormat);

    constructor(
    ) { }

    printPage() {
        window.print();
    }


}
