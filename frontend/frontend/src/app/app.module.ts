import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from "@angular/material/slider";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider"


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
import { SignUpPageComponent } from './login-page/sign-up-page/sign-up-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component';
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterLoginPageComponent,
    SignUpPageComponent,
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
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
