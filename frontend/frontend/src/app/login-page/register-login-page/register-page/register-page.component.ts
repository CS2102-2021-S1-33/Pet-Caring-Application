import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.less']
})
export class RegisterPageComponent implements OnInit {

  exForm = new FormGroup({
    ex1: new FormControl('', Validators.required),
    ex2: new FormControl('w', Validators.required)
  })

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  //login as admin uses same form as above

  getCaretakerAvailability = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required)
  });

  caretakerAddsAvailability = new FormGroup({
    availabilityStart: new FormControl('', Validators.required),
    availabilityEnd: new FormControl('', Validators.required),
    petCategory: new FormControl('', Validators.required),
    dailyPrice: new FormControl('', Validators.required)
  });

  ownerSelectsBid = new FormGroup({
    petName: new FormControl('', Validators.required),
    bidStart: new FormControl('', Validators.required),
    bidEnd: new FormControl('', Validators.required),
    caretaker: new FormControl('', Validators.required),
    availStart: new FormControl('', Validators.required),
    availEnd: new FormControl('', Validators.required),
    bidPrice: new FormControl('', Validators.required)
  });

  writeReview = new FormGroup({
    petName: new FormControl('', Validators.required),
    bidStart: new FormControl('', Validators.required),
    bidEnd: new FormControl('', Validators.required),
    caretaker: new FormControl('', Validators.required),
    availStart: new FormControl('', Validators.required),
    availEnd: new FormControl('', Validators.required),
    rating: new FormControl('', Validators.required),
    review: new FormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

}
