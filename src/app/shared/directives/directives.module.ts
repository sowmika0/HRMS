import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CharacterCountDirective } from './character-count.directive';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';
import { FormValidationDirective } from './form-validation.directive';
import { ScrollSpyDirective } from './scroll-spy.directive';

@NgModule({
  declarations: [
    CharacterCountDirective,
    FormValidationDirective,
    ScrollSpyDirective,
    CopyToClipboardDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CharacterCountDirective,
    FormValidationDirective,
    ScrollSpyDirective,
    CopyToClipboardDirective
  ]
})
export class DirectivesModule { }
