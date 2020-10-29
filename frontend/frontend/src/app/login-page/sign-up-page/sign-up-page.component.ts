import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, FormControl } from "@angular/forms";

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['sign-up-page.component.less']
})

export class SignUpPageComponent implements OnInit {

  constructor(private registerFormBuilder: FormBuilder) { }

  registerForm: FormGroup;

  ngOnInit() {
    this.registerForm = this.registerFormBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      typeCaretaker: [''],
      typePetowner: [''],

      //caretaker fields
      caretakerRole: [''],
      //insert dropdown

      //petowner fields
      noOfPets: [''],
      pets: new FormArray([])

    });
  }

  onChangePets(e) {
    const number = e.target.value || 0;
    if (this.pe.length < number) {
        for (let i = this.pe.length; i < number; i++) {
            this.pe.push(this.registerFormBuilder.group({
                name: ['', Validators.required],
                //insert dropdown
                specialReq: ['']
            }));
        }
    } else {
        for (let i = this.pe.length; i >= number; i--) {
            this.pe.removeAt(i);
        }
    }
  }

  get f() { return this.registerForm.controls; }
  get pe() { return this.f.pets as FormArray; }

}
