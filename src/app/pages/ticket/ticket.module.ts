import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { LayoutModule } from '../../shared/layout/layout.module';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketComponent } from './ticket.component';
import { TicketService } from './ticket.service';

@NgModule({
  declarations: [TicketListComponent, TicketDetailsComponent, TicketComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule
  ],
  providers: [
    TicketService
  ]
})
export class TicketModule { }
