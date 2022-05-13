import {
  AccordionModule,
  AlertModule,
  BsDatepickerModule,
  BsDropdownModule,
  ButtonsModule,
  CarouselModule,
  CollapseModule,
  ModalModule,
  PaginationModule,
  PopoverModule,
  ProgressbarModule,
  SortableModule,
  TabsModule,
  TooltipModule,
} from 'ngx-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { GALLERY_CONFIG, GalleryModule } from '@ngx-gallery/core';

import { CommonModule } from '@angular/common';
import { CustomFormsModule } from 'ngx-custom-validators';
import { CustomNotificationComponent } from './../components/custom-notification/custom-notification.component';
import { DataTablesModule } from 'angular-datatables';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgChartjsModule } from 'ng-chartjs';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { QuillModule } from 'ngx-quill';
import { SmoothScrollModule } from 'ngx-scrollbar/smooth-scroll';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ToastrModule } from 'ngx-toastr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// import { AngularDraggableModule } from 'angular2-draggable';
// import { ClipboardModule } from 'ngx-clipboard';
// import { HighlightModule } from 'ngx-highlightjs';
// import { MonacoEditorModule } from 'ngx-monaco-editor';
// import { NgxPageScrollModule } from 'ngx-page-scroll';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CustomFormsModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      extendedTimeOut: 1000,
      positionClass: 'toast-top-center',
      toastClass: 'ks-toast',
      titleClass: 'ks-toast-title',
      messageClass: 'ks-toast-message',
      iconClasses: {
        error: 'ks-toast-error',
        info: 'ks-toast-info',
        success: 'ks-toast-success',
        warning: 'ks-toast-warning'
      }
    }),
    SweetAlert2Module.forRoot(),
    BsDatepickerModule.forRoot(),
    DropzoneModule,
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    NgScrollbarModule,
    CollapseModule.forRoot(),
    // HighlightModule,
    // ClipboardModule,
    // NgxPageScrollModule,
    QuillModule.forRoot(),
    SortableModule.forRoot(),
    // MonacoEditorModule.forRoot(),
    // AngularDraggableModule,
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    PopoverModule.forRoot(),
    SmoothScrollModule,
    NgxDropzoneModule,
    GalleryModule,
    NgxFilesizeModule,
    DataTablesModule,
    TimepickerModule.forRoot(),
    NgxOrgChartModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgChartjsModule.registerPlugin(),
  ],
  entryComponents: [
    CustomNotificationComponent
  ],
  exports: [
    CustomFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    SweetAlert2Module,
    DropzoneModule,
    TooltipModule,
    ButtonsModule,
    AlertModule,
    BsDropdownModule,
    ModalModule,
    TabsModule,
    AccordionModule,
    NgScrollbarModule,
    CollapseModule,
    // HighlightModule,
    // ClipboardModule,
    // NgxPageScrollModule,
    QuillModule,
    // MonacoEditorModule,
    SortableModule,
    // AngularDraggableModule,
    CarouselModule,
    PaginationModule,
    ProgressbarModule,
    SmoothScrollModule,
    PopoverModule,
    NgxDropzoneModule,
    GalleryModule,
    NgxFilesizeModule,
    DataTablesModule,
    TimepickerModule,
    NgxOrgChartModule,
    CalendarModule,
    NgChartjsModule,
  ],
  providers: [
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: true,
        imageSize: 'contain',
        loadingMode: 'indeterminate'
      }
    }
  ]
})
export class PluginsModule { }
