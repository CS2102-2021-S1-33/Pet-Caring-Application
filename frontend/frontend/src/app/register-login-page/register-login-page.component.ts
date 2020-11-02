import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register-login-page',
  templateUrl: './register-login-page.component.html',
  styleUrls: ['./register-login-page.component.less']
})
export class RegisterLoginPageComponent implements OnInit {

  constructor() { }

  loginForm = new FormGroup({
    user: new FormControl(),
    userPassword: new FormControl()
  });

  ngOnInit(): void {


  }

}
