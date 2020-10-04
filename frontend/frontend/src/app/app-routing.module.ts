import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component';


const routes: Routes = [
  {path: 'login', component: RegisterLoginPageComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
