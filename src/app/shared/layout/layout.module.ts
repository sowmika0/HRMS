import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from './../components/components.module';
import { PipesModule } from './../pipes/pipes.module';
import { PluginsModule } from './../plugins/plugins.module';
import { FooterComponent } from './footer/footer.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PluginsModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [
    TopBarComponent,
    MenuBarComponent,
    FooterComponent,
  ],
  entryComponents: [],
  providers: [
  ],
  exports: [
    TopBarComponent,
    MenuBarComponent,
    FooterComponent,

    BrowserModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PluginsModule
  ]
})
export class LayoutModule { }
