import { CommonModule } from '@angular/common';
import { MainMoodMeterComponent } from './main-mood-meter.component';
import { MoodMeterDetailComponent } from './mood-meter-detail/mood-meter-detail.component';
import { MoodMeterService } from './mood-meter.service';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MoodMeterDetailComponent, MainMoodMeterComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    MoodMeterService
  ]
})
export class MoodMeterModule { }
