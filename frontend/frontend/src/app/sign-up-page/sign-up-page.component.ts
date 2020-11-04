import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, FormControl } from "@angular/forms";

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['sign-up-page.component.less']
})

export class SignUpPageComponent implements OnInit {

  constructor(private registerFormBuilder: FormBuilder) { }

  registerForm: FormGroup;

  caretakerChecked: boolean;
  petOwnerChecked: boolean;

  ngOnInit() {
    this.caretakerChecked = false;
    this.petOwnerChecked = false;

    this.registerForm = this.registerFormBuilder.group({
      // IF IT'S COMING FROM EDIT PROFILE, DO POPULATE these fields
      name: ['', Validators.required], 
      email: ['', Validators.required],
      address: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],

      accountType: new FormGroup({
        typePetowner: new FormControl(false),
        typeCaretaker: new FormControl(false),
      }, requireCheckboxesToBeCheckedValidator()),

      //caretaker fields
      caretakerRole: [''],
      petCategories: ['', Validators.required],

      //petowner fields
      noOfPets: [''],
      pets: new FormArray([])

    });
  }

  cEventCheck(event){
    console.log(event.target.checked);
    this.caretakerChecked = event.target.checked;
  }

  poEventCheck(event){
    console.log(event.target.checked);
    this.petOwnerChecked = event.target.checked;
  }

  onChangePets(e) {
    const number = e.target.value || 0;
    if (this.pe.length < number) {
        for (let i = this.pe.length; i < number; i++) {
            this.pe.push(this.registerFormBuilder.group({
                petName: ['', Validators.required],
                petCategory: ['', Validators.required],
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

export function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate (formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked ++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }

    return null;
  };
}
