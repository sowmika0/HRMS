import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SwalPartialTargets } from '@sweetalert2/ngx-sweetalert2';
import { ShowSweetAlertValue, SweetAlertOption, SweetAlertValue } from 'src/app/app.model';
import swal from 'sweetalert2';

import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-custom-sweetalert',
  templateUrl: './custom-sweetalert.component.html',
  styleUrls: ['./custom-sweetalert.component.scss']
})
export class CustomSweetalertComponent implements OnInit {
  @ViewChild('sweetAlert', { static: false }) private sweetAlert: SwalComponent;

  alertTypedText = '';
  alertData: SweetAlertValue = new SweetAlertValue();

  swalOptions: SweetAlertOption = {
    reverseButtons: true,
    buttonsStyling: false,
    confirmButtonClass: 'btn btn-danger btn-medium swal-button',
    cancelButtonClass: 'btn btn-dark btn-medium swal-button',
    showCancelButton: true,
    showConfirmButton: true,
    allowEnterKey: true,
    allowEscapeKey: true,
    allowOutsideClick: false,
    focusCancel: true,
    focusConfirm: false
  }

  constructor(
    public readonly swalTargets: SwalPartialTargets,
    private subjectService: SubjectService
  ) {
    this.alertData = {
      emoji: 'assets/emoji/smile.png',
      header: '',
      content: [''],
      confirmText: null,
      confirmButtonText: 'Okay',
      cancelButtonText: 'Cancel',
      onConfirm: null,
      data: null,
      showCancelButton: true,
      onBeforeOpen: null
    };
  }

  ngOnInit() {
    this.subscribeToSweetAlerts();
  }

  subscribeToSweetAlerts() {
    this.subjectService.showSweetAlertSubject.subscribe(
      (sweetAlertData: ShowSweetAlertValue) => {
        this.alertTypedText = '';
        sweetAlertData.alertData.onBeforeOpen = this.checkDeletionConfirmationText;
        this.alertData = sweetAlertData.alertData;
        this.alertData.showCancelButton =
          this.alertData.showCancelButton === undefined ||
            this.alertData.showCancelButton === null
            ? true
            : this.alertData.showCancelButton;

        this.sweetAlert.options = sweetAlertData.swalOptions;
        this.sweetAlert.show();
      }
    );
  }

  checkDeletionConfirmationText() {
    const buttonFn =
      this.alertData.confirmText !== '' && this.alertData.confirmText !== null
        ? this.alertTypedText.trim() === this.alertData.confirmText.trim()
          ? swal.enableConfirmButton
          : swal.disableConfirmButton
        : swal.enableConfirmButton;

    buttonFn();
  }

  callSweetAlertConfirmCallback($event: any) {
    if (this.alertData.onConfirm !== null) {
      this.alertData.onConfirm(this.alertData.data);
    }
  }

}
