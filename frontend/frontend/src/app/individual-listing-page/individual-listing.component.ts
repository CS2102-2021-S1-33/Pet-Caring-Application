import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-individual-listing',
  templateUrl: './individual-listing.component.html',
  styleUrls: ['./individual-listing.component.less']
})

export class IndividualListingComponent implements OnInit {

  constructor() { }
  
  bidForm = new FormGroup({
    //pet: new FormControl(''),
    //startDate: new FormControl(''),
    //endDate: new FormControl(''),
    phone: new FormControl(''),
    price: new FormControl('')
  });

  ngOnInit(): void {
  }

}
