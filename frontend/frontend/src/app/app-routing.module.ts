import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { FindCaretakerComponent } from './login-page/find-caretaker/find-caretaker/find-caretaker.component';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';
import { SignUpPageComponent} from "./login-page/register-login-page/sign-up-page/sign-up-page.component";
import { AdminHomepageComponent } from "./admin/admin-homepage/admin-homepage.component"
import { ApproveLeaveComponent } from './admin/approve-leave/approve-leave.component';
import { VerifyCaretakerComponent } from './admin/verify-caretaker/verify-caretaker.component';
import { ViewPetCategoriesComponent } from './admin/view-pet-categories/view-pet-categories.component';


const routes: Routes = [
  {path: 'login', component: RegisterLoginPageComponent},
  {path:'signup', component: SignUpPageComponent},
  {path: 'find-caretaker', component: FindCaretakerComponent},
  {path: '', component: IndexComponent},
  {path: 'admin', component: AdminHomepageComponent},
  {path: 'admin/approve-leave', component: ApproveLeaveComponent},
  {path: 'admin/verify-caretaker', component: VerifyCaretakerComponent},
  {path: 'admin/view-pet-categories', component: ViewPetCategoriesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
