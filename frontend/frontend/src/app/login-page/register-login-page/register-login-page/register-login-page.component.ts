import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormField } from "@angular/material/form-field";

@Component({
  selector: 'app-register-login-page',
  templateUrl: './register-login-page.component.html',
  styleUrls: ['./register-login-page.component.less']
})
export class RegisterLoginPageComponent implements OnInit {


  showLoginPage = true;

  constructor(private registerFormBuilder: FormBuilder) { }

  loginForm = new FormGroup({
    user: new FormControl(),
    userPassword: new FormControl()
  });

  registerForm = this.registerFormBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    userName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  })

  ngOnInit(): void {

    
  }


}
