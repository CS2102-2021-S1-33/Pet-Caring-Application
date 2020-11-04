import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import axios from 'axios'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterLoginPageComponent } from './register-login-page/register-login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component';
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';
import { CaretakerJobsComponent } from './caretaker-jobs-page/caretaker-jobs.component';
import { PetOwnerBidsComponent } from './petowner-bids-page/petowner-bids.component';
import { LeaveReviewComponent } from './petowner-bids-page/leave-review-page/leave-review.component';
import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile-page/profile.component';
import { ApplyLeaveComponent } from './profile-page/apply-leave-page/apply-leave.component';
import { IndicateAvailabilityComponent } from './profile-page/indicate-availability-page/indicate-availability.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { ApproveLeaveComponent } from './admin/approve-leave/approve-leave.component';
import { VerifyCaretakerComponent } from './admin/verify-caretaker/verify-caretaker.component';
import { ViewPetCategoriesComponent } from './admin/view-pet-categories/view-pet-categories.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    RegisterLoginPageComponent,
    SignUpPageComponent,
    AboutPageComponent,
    FindCaretakerComponent,
    IndividualListingComponent,
    AdminHomepageComponent,
    ApproveLeaveComponent,
    VerifyCaretakerComponent,
    ViewPetCategoriesComponent,
    CaretakerJobsComponent,
    PetOwnerBidsComponent,
    ProfileComponent,
    LeaveReviewComponent,
    ApplyLeaveComponent,
    IndicateAvailabilityComponent
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
    BrowserModule, 
    NgxDatatableModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDatepickerModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
