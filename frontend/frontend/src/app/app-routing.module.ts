import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
import { FindCaretakerComponent } from './find-caretaker-page/find-caretaker.component'
import { IndividualListingComponent } from './individual-listing-page/individual-listing.component';
import { CaretakerJobsComponent } from './caretaker-jobs-page/caretaker-jobs.component';
import { AuthGuardService as AuthGuard} from "./auth-guard.service"
const routes: Routes = [
  {path: 'login', component: RegisterLoginPageComponent},
  {path: 'find', component: FindCaretakerComponent, canActivate: [AuthGuard]},
  {path: 'listing', component: IndividualListingComponent, canActivate: [AuthGuard]},
  {path: 'jobs', component: CaretakerJobsComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
