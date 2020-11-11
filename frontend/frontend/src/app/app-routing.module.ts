import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile-page/profile.component';
import { RegisterLoginPageComponent } from './register-login-page/register-login-page.component';
import { SignUpPageComponent } from "./sign-up-page/sign-up-page.component";
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component'
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';
import { CaretakerJobsComponent } from './caretaker-jobs-page/caretaker-jobs.component';
import { PetOwnerBidsComponent } from './petowner-bids-page/petowner-bids.component';
import { AdminHomepageComponent } from "./admin/admin-homepage/admin-homepage.component"
import { ApproveLeaveComponent } from './admin/approve-leave/approve-leave.component';
import { VerifyCaretakerComponent } from './admin/verify-caretaker/verify-caretaker.component';
import { ViewPetCategoriesComponent } from './admin/view-pet-categories/view-pet-categories.component';

const routes: Routes = [
  {path: 'login', component: RegisterLoginPageComponent},
  {path:'signup', component: SignUpPageComponent},
  {path: 'find', component: FindCaretakerComponent},
  {path: 'listing', component: IndividualListingComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'jobs', component: CaretakerJobsComponent},
  {path: 'bids', component: PetOwnerBidsComponent},
  {path: '', component: IndexComponent},
  {path: 'admin', component: AdminHomepageComponent},
  {path: 'approveleave', component: ApproveLeaveComponent},
  {path: 'verifycaretaker', component: VerifyCaretakerComponent},
  {path: 'viewpetcategories', component: ViewPetCategoriesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
