import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from "@angular/material/slider";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
import { SignUpPageComponent } from './login-page/register-login-page/sign-up-page/sign-up-page.component';
import { AboutPageComponent } from './login-page/register-login-page/about-page/about-page.component';
import { FindCaretakerComponent } from './login-page/find-caretaker/find-caretaker/find-caretaker.component';
import { IndexComponent } from './index/index.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { ApproveLeaveComponent } from './admin/approve-leave/approve-leave.component';
import { VerifyCaretakerComponent } from './admin/verify-caretaker/verify-caretaker.component';
import { ViewPetCategoriesComponent } from './admin/view-pet-categories/view-pet-categories.component';




@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    RegisterLoginPageComponent,
    SignUpPageComponent,
    AboutPageComponent,
    FindCaretakerComponent,
    AdminHomepageComponent,
    ApproveLeaveComponent,
    VerifyCaretakerComponent,
    ViewPetCategoriesComponent
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
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
