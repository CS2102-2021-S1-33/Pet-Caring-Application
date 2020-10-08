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
import { SignUpPageComponent } from './login-page/register-login-page/sign-up-page/sign-up-page.component';
import { AboutPageComponent } from './login-page/register-login-page/about-page/about-page.component';
import { FindCaretakerComponent } from './login-page/find-caretaker/find-caretaker/find-caretaker.component';




@NgModule({
  declarations: [
    AppComponent,
    RegisterLoginPageComponent,
    SignUpPageComponent,
    AboutPageComponent,
    FindCaretakerComponent
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
