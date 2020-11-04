import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, FormControl } from "@angular/forms";


@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.less']
})

export class ApplyLeaveComponent implements OnInit {

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