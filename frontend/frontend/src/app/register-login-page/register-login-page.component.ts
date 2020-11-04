import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { GeneralService } from '../general.service'

@Component({
  selector: 'app-register-login-page',
  templateUrl: './register-login-page.component.html',
  styleUrls: ['./register-login-page.component.less']
})
export class RegisterLoginPageComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private _service: GeneralService) { }

  loginForm = new FormGroup({
    user: new FormControl(),
    userPassword: new FormControl()
  });

  ngOnInit(): void {

  }

  onClickLogin() {
    let username = this.loginForm.get('user').value;
    let password = this.loginForm.get('userPassword').value;

    // this._service.sendLoginRequest(username, password).subscribe(res => {
    //   console.log(res);

    //   this._service.petOwnerAddsPet("ad", "a", "dog").subscribe(d => console.log(d));
    // });

    this._service.axiosLogin(username,password).then(res => {
      console.log(res.data);
      this._service.axiospetOwnerAddsPet("a", "b", "dog");
    });

  }

}
