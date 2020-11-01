import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
<<<<<<< HEAD
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
=======
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';

>>>>>>> origin/fe-landing-page

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
<<<<<<< HEAD
import { SignUpPageComponent } from './login-page/sign-up-page/sign-up-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component';
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';
=======
import { SignUpPageComponent } from './login-page/register-login-page/sign-up-page/sign-up-page.component';
import { AboutPageComponent } from './login-page/register-login-page/about-page/about-page.component';
import { FindCaretakerComponent } from './login-page/find-caretaker/find-caretaker/find-caretaker.component';
import { IndexComponent } from './index/index.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { ApproveLeaveComponent } from './admin/approve-leave/approve-leave.component';
import { VerifyCaretakerComponent } from './admin/verify-caretaker/verify-caretaker.component';
import { ViewPetCategoriesComponent } from './admin/view-pet-categories/view-pet-categories.component';

>>>>>>> origin/fe-landing-page

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    RegisterLoginPageComponent,
    SignUpPageComponent,
    AboutPageComponent,
    FindCaretakerComponent,
<<<<<<< HEAD
    IndividualListingComponent,
=======
    AdminHomepageComponent,
    ApproveLeaveComponent,
    VerifyCaretakerComponent,
    ViewPetCategoriesComponent
>>>>>>> origin/fe-landing-page
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatDividerModule,
<<<<<<< HEAD
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
=======
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
>>>>>>> origin/fe-landing-page
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
