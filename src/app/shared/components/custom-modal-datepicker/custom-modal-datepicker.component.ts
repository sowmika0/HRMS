import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CustomModalComponent } from '../custom-modal/custom-modal.component';

@Component({
  selector: 'app-custom-modal-datepicker',
  templateUrl: './custom-modal-datepicker.component.html',
  styleUrls: ['./custom-modal-datepicker.component.scss']
})
export class CustomModalDatepickerComponent implements OnInit {
  @ViewChild('modalDatePicker', { static: false }) modalDatePicker: CustomModalComponent;

  @Input('isDateRange') isDateRange: boolean = false;
  @Output('onDateCleared') onDateCleared: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('onDateSelected') onDateSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  showDatePicker() {
    this.modalDatePicker.showModal();
  }

  dateCleared() {
    this.onDateCleared.emit(true);
  }

  dateSelected() {
    this.onDateSelected.emit(true);
    this.modalDatePicker.hideModal();
  }
}
