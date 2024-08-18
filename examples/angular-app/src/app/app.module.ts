import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import {
  BreakpointObserverDirective,
} from '@breakpoint-observer/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChildComponent } from './Child.component';

@NgModule({
  declarations: [AppComponent, ChildComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BreakpointObserverDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
