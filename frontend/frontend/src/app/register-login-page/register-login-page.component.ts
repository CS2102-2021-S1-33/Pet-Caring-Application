import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { GeneralService } from '../general.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-register-login-page',
  templateUrl: './register-login-page.component.html',
  styleUrls: ['./register-login-page.component.less']
})
export class RegisterLoginPageComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private _service: GeneralService,
    private router: Router, private snackbar: MatSnackBar) { }

  loginForm = new FormGroup({
    user: new FormControl(),
    userPassword: new FormControl()
  });

  ngOnInit(): void {
    this.isLoggedIn = false;
  }

  onClickLogin() {
    let username = this.loginForm.get('user').value;
    let password = this.loginForm.get('userPassword').value;

    this._service.sendLoginRequest(username, password).subscribe(res => {
      console.log(res);   
      if(this.isLoggedIn = (JSON.stringify(res["isSuccess"]) === "true")) {
        console.log(this.isLoggedIn);
        this.router.navigate(['/find']);
      }
    }, err => { console.log(err);
    let errormsg = "Please use a valid username and password";
    this.snackbar.open(errormsg, null, { duration: 3000});});
  }

  public getLoginStatus():boolean  {
    return this.isLoggedIn;
  }

  public setLogout() {
    this.isLoggedIn = false;
  }

  onClickAdminLogin() {
    let username = this.loginForm.get('user').value;
    let password = this.loginForm.get('userPassword').value;

    this._service.sendAdminLoginRequest(username, password).subscribe(res => {
      console.log(res);   
      if(this.isLoggedIn = (JSON.stringify(res["isSuccess"]) === "true")) {
        console.log(this.isLoggedIn);
        this.router.navigate(['/admin']);
      }
    }, err => { console.log(err);
    let errormsg = "Please use a valid username and password";
    this.snackbar.open(errormsg, null, { duration: 3000});});
  }
}
