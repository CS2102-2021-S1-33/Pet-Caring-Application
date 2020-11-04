import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, FormControl } from "@angular/forms";

export interface Job {
  name: string;
  price: number;
  noOfPets: number;
  petCategories: string[];
  caretakingPeriod: string;
  phone: string;
  review: string;
  rating: number;
  acceptedDate: string;
}

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.less']
})

export class LeaveReviewComponent implements OnInit {

  reviewForm: FormGroup;

  constructor(private reviewFormBuilder: FormBuilder) {

  }
  
  ngOnInit() {
    this.reviewForm = this.reviewFormBuilder.group({
      rating: ['', Validators.required], 
      review: ['', Validators.required],
    });
  }
}