import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { RegisterLoginPageComponent } from './login-page/register-login-page/register-login-page/register-login-page.component'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public rlc: RegisterLoginPageComponent,
     public router: Router) { }


  canActivate(): boolean {
    if(!this.rlc.getLoginStatus) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
  
}


