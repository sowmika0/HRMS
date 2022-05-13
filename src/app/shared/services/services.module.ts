import { ColorService } from './color-service';
import { CommonModule } from '@angular/common';
import { CustomNotificationService } from './custom-notification.service';
import { CustomToastrService } from './toastr.service';
import { DatatableService } from './datatable.service';
import { EncryptionService } from './encryption-service';
import { HttpService } from './http-service';
import { LocalStorageService } from './local-storage-service';
import { MiscService } from './misc.service';
import { NgModule } from '@angular/core';
import { NumberService } from './number.service';
import { ObjectToUrlService } from './obj-to-url-service';
import { PluginsModule } from './../plugins/plugins.module';
import { RoleSettingsService } from './role-settings.service';
import { ScrollTopService } from './scroll-top.servics';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PluginsModule,
  ],

  providers: [
    ColorService,
    EncryptionService,
    HttpService,
    LocalStorageService,
    ObjectToUrlService,
    NumberService,
    DatatableService,
    CustomNotificationService,
    CustomToastrService,
    ScrollTopService,
    MiscService,
    RoleSettingsService
  ],
})
export class ServicesModule { }
