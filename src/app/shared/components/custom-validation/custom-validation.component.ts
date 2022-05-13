import { Component, Input, OnInit } from '@angular/core';

import { CustomValidationError } from './custom-validation.model';

@Component({
  selector: 'app-custom-validation',
  templateUrl: './custom-validation.component.html',
  styleUrls: ['./custom-validation.component.scss']
})
export class CustomValidationComponent implements OnInit {

  @Input('model') model: any;

  @Input('min') min: string;
  @Input('max') max: string;
  @Input('url') url: string;
  @Input('email') email: string;
  @Input('digits') digits: string;
  @Input('number') number: string;
  @Input('equalTo') equalTo: string;
  @Input('pattern') pattern: string;
  @Input('required') required: string;
  @Input('minLength') minLength: string;
  @Input('maxLength') maxLength: string;
  @Input('creditCard') creditCard: string;
  @Input('rangeLength') rangeLength: string;

  validationsToShow: CustomValidationError[] = [];
  defaultValidations: CustomValidationError[] = [];
  allValidations = [
    'min',
    'max',
    'url',
    'email',
    'digits',
    'number',
    'equalTo',
    'pattern',
    'required',
    'minLength',
    'maxLength',
    'creditCard',
    'rangeLength',
  ];

  constructor() { }

  ngOnInit() {
    this.defaultValidations.push(
      { validationType: 'min', validationErrorMessage: this.min },
      { validationType: 'max', validationErrorMessage: this.max },
      { validationType: 'url', validationErrorMessage: this.url },
      { validationType: 'email', validationErrorMessage: this.email },
      { validationType: 'digits', validationErrorMessage: this.digits },
      { validationType: 'number', validationErrorMessage: this.number },
      { validationType: 'equalTo', validationErrorMessage: this.equalTo },
      { validationType: 'pattern', validationErrorMessage: this.pattern },
      { validationType: 'required', validationErrorMessage: this.required },
      { validationType: 'minLength', validationErrorMessage: this.minLength },
      { validationType: 'maxLength', validationErrorMessage: this.maxLength },
      { validationType: 'creditCard', validationErrorMessage: this.creditCard },
      { validationType: 'rangeLength', validationErrorMessage: this.rangeLength }
    );
  }

  ngDoCheck() {
    this.setValidations();
  }

  setValidations() {
    this.validationsToShow = [];
    this.defaultValidations.map(v => {
      if (this.model && this.model.errors && this.model.errors.hasOwnProperty(v.validationType)) {
        this.validationsToShow.push(v);
      }
    });
  }

}
