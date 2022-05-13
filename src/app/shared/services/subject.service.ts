import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ShowSweetAlertValue, SweetAlertOption, SweetAlertValue } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  showSweetAlertSubject = new Subject<any>();
  toggleLoadingSubject = new Subject();
  toggleOffCanvasSubject = new Subject();
  scrollSpySubject = new Subject();
  scrollToTopSubject = new Subject();
  uploadingSubject = new Subject();

  swalOptions: SweetAlertOption = {
    reverseButtons: true,
    buttonsStyling: false,
    confirmButtonClass: 'btn btn-danger btn-medium swal-button',
    cancelButtonClass: 'btn btn-dark btn-outline btn-medium swal-button',
    showCancelButton: true,
    showConfirmButton: true
  };

  constructor() { }

  sendUploadingStatus(completed: number) {
    this.uploadingSubject.next(completed);
  }

  scrollToTop() {
    this.scrollToTopSubject.next(true);
  }

  sendScrollspySubject(sectionId: string) {
    this.scrollSpySubject.next(sectionId);
  }

  toggleLoading(isLoading: boolean) {
    this.toggleLoadingSubject.next(isLoading);
  }

  showSweetAlert(alertData: SweetAlertValue, confirmButtonType: string) {
    this.swalOptions.confirmButtonClass =
      'btn btn-' + confirmButtonType + ' btn-medium swal-button';
    this.swalOptions.showCancelButton =
      alertData.showCancelButton === undefined ||
        alertData.showCancelButton === null
        ? true
        : alertData.showCancelButton;
    this.swalOptions.allowEscapeKey =
      alertData.allowEscapeKey !== null ? alertData.allowEscapeKey : true;
    this.swalOptions.allowOutsideClick =
      alertData.allowOutsideClick !== null ? alertData.allowOutsideClick : true;

    const sweetAlertValue: ShowSweetAlertValue = {
      alertData: alertData,
      swalOptions: this.swalOptions
    };
    this.showSweetAlertSubject.next(sweetAlertValue);
  }

  showOffCanvas() {
    this.toggleOffCanvasSubject.next(true);
  }

  hideOffCanvas() {
    this.toggleOffCanvasSubject.next(false);
  }

}
