import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component';
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


@NgModule({
  declarations: [
    AppComponent,
    RegisterLoginPageComponent,
    AboutPageComponent,
    FindCaretakerComponent,
    IndividualListingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    CdkTableModule,
    MatChipsModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    BrowserModule, 
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDONDMmUqsDzOORDSXOngURXK4tjXPZ9lc' }), 
    RouterModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
