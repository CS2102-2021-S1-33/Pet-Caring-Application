import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, FormControl } from "@angular/forms";


@Component({
  selector: 'app-indicate-availability',
  templateUrl: './indicate-availability.component.html',
  styleUrls: ['./indicate-availability.component.less']
})

export class IndicateAvailabilityComponent implements OnInit {

  applyForm: FormGroup;

  constructor(private reviewFormBuilder: FormBuilder) {

  }
  
  ngOnInit() {
    this.applyForm = this.reviewFormBuilder.group({
      startDate: ['', Validators.required], 
      endDate: ['', Validators.required],
    });
  }
}