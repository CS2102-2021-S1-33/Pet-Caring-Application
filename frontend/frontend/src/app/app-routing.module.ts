import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
import { SignUpPageComponent } from "./login-page/sign-up-page/sign-up-page.component";
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component'
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';
import { CaretakerJobsComponent } from './caretaker-jobs-page/caretaker-jobs.component';

const routes: Routes = [
  {path: 'login', component: RegisterLoginPageComponent},
  {path:'signup', component: SignUpPageComponent},
  {path: 'find-caretaker', component: FindCaretakerComponent},
  {path: 'individual-listing', component: IndividualListingComponent},
  {path: 'caretaker-jobs', component: CaretakerJobsComponent},
  {path: '', redirectTo: 'find-caretaker', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
