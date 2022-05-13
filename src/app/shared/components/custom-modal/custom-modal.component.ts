import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from 'events';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent implements OnInit {

  @Input('title') title = 'Modal Title';
  @Input('subTitle') subTitle = 'Modal Sub Title';
  @Input('modalSize') modalSize = 'md'; // xs, sm, md, lg, xl
  @Input('staticBackdrop') staticBackdrop = true;
  @Input('blurBackdrop') blurBackdrop = true;
  @Input('hideCloseButton') hideCloseButton = false;

  @Output('onClosed') onClosed = new EventEmitter();

  @ViewChild('modalTemplate', { static: false }) modalTemplate;

  modalConfig: ModalOptions;

  constructor(
    private modalService: BsModalService

  ) { }

  ngOnInit() {
    this.modalConfig = {
      animated: true,
      backdrop: this.staticBackdrop ? 'static' : true,
      keyboard: !this.staticBackdrop,
      ignoreBackdropClick: this.staticBackdrop
    };
  }

  showModal() {
    this.modalTemplate.show();
  }

  hideModal() {
    this.onClosed.emit('');
    this.modalTemplate.hide();
  }

  toggleModal() {
    this.modalTemplate.toggle();
  }

}
