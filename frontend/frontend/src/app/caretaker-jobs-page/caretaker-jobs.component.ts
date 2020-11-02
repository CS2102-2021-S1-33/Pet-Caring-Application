import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface Bid {
  name: string;
  price: number;
  noOfPets: number;
  petCategories: string[];
  caretakingPeriod: string;
  phone: string;
  bidDate: string;
}

export interface Job {
  name: string;
  price: number;
  noOfPets: number;
  petCategories: string[];
  caretakingPeriod: string;
  phone: string;
  acceptedDate: string;
}

const BID_DATA: Bid[] = [
  {
    name: 'Priscilla Lim',
    price: 51,
    petCategories: ['Cat', ' Dog'],
    noOfPets: 2,
    caretakingPeriod: '24/9/2020 - 27/9/2020',
    phone: '98765432',
    bidDate: '18/9/2020'
  },
  {
    name: 'Priscilla Lim',
    price: 51,
    petCategories: ['Cat', ' Dog'],
    noOfPets: 2,
    caretakingPeriod: '24/9/2020 - 27/9/2020',
    phone: '98765432',
    bidDate: '18/9/2020'
  }
];

const UPCOMING_JOB_DATA: Job[] = [
  {
    name: 'Joel Lim',
    price: 51,
    petCategories: ['Cat'],
    noOfPets: 1,
    caretakingPeriod: '24/9/2020 - 27/9/2020',
    phone: '98765431',
    acceptedDate: '21/9/2020'
  }
];

const PAST_JOB_DATA: Job[] = [

];

@Component({
  selector: 'app-caretaker-jobs',
  templateUrl: './caretaker-jobs.component.html',
  styleUrls: ['./caretaker-jobs.component.less']
})

export class CaretakerJobsComponent implements OnInit {

  BidDataTableSource = BID_DATA;
  UJobDataTableSource = UPCOMING_JOB_DATA;
  PJobDataTableSource = PAST_JOB_DATA;

  constructor() {
  };

  ngOnInit() {

  }

  onRejectSelect(row) {
    console.log(row); 
  }

  onAcceptSelect(row) {
    console.log(row); 
  }
}
