import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { PluginsModule } from '../plugins/plugins.module';
import { ServicesModule } from '../services/services.module';
import { DirectivesModule } from './../directives/directives.module';
import { CustomComingSoonComponent } from './custom-coming-soon/custom-coming-soon.component';
import { CustomLoaderComponent } from './custom-loader/custom-loader.component';
import { CustomModalDatepickerComponent } from './custom-modal-datepicker/custom-modal-datepicker.component';
import { CustomModalComponent } from './custom-modal/custom-modal.component';
import { CustomNotificationComponent } from './custom-notification/custom-notification.component';
import { CustomOffcanvasComponent } from './custom-offcanvas/custom-offcanvas.component';
import { CustomSweetalertComponent } from './custom-sweetalert/custom-sweetalert.component';
import { CustomValidationComponent } from './custom-validation/custom-validation.component';

@NgModule({
  declarations: [
    CustomModalComponent,
    CustomSweetalertComponent,
    CustomLoaderComponent,
    CustomOffcanvasComponent,
    CustomValidationComponent,
    CustomModalDatepickerComponent,
    CustomNotificationComponent,
    CustomComingSoonComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PluginsModule,
    DirectivesModule,
    ServicesModule
  ],
  entryComponents: [
    CustomNotificationComponent
  ],
  exports: [
    CustomModalComponent,
    CustomSweetalertComponent,
    CustomLoaderComponent,
    CustomOffcanvasComponent,
    CustomValidationComponent,
    CustomModalDatepickerComponent,
    CustomComingSoonComponent,
  ],
  providers: [
  ]
})
export class ComponentsModule { }
