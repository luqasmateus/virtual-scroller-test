import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { MobileCalendarStrategy } from '../ScrollStrategies/calendar';
import { CustomVirtualScrollDirective } from '../ScrollStrategies/directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ScrollingModule
  ],
  declarations: [HomePage, CustomVirtualScrollDirective],
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: MobileCalendarStrategy,
  }]
})
export class HomePageModule { }
