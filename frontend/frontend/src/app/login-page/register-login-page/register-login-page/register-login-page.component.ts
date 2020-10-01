import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-login-page',
  templateUrl: './register-login-page.component.html',
  styleUrls: ['./register-login-page.component.less']
})
export class RegisterLoginPageComponent implements OnInit {


  showLoginPage = true;

  constructor() { }

  ngOnInit(): void {
  }

}
