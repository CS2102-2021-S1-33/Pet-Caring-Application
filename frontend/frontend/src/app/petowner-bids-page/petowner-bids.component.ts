import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router'

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
  review: string;
  rating: number;
  acceptedDate: string;
}

export interface PaymentDialog {
  credit: boolean;
  cash: boolean;
}

export interface ReviewDialog {
  review: string;
  rating: number;
}

const PENDING_BID_DATA: Bid[] = [
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
    caretakingPeriod: '04/10/2020 - 07/10/2020',
    phone: '98765432',
    bidDate: '18/9/2020'
  }
];

const PAST_BID_DATA: Bid[] = [

];

const JOB_PAY_DATA: Job[] = [
  {
    name: 'Joel Lim',
    price: 51,
    petCategories: ['Cat'],
    noOfPets: 1,
    caretakingPeriod: '16/9/2020 - 20/9/2020',
    review: null,
    rating: null,
    phone: '98765431',
    acceptedDate: '21/9/2020'
  }
];

const JOB_REVIEW_DATA: Job[] = [

];

const JOB_HISTORY_DATA: Job[] = [

];

@Component({
  selector: 'app-petowner-bids',
  templateUrl: './petowner-bids.component.html',
  styleUrls: ['./petowner-bids.component.less']
})

export class PetOwnerBidsComponent implements OnInit {

  PeBidDataTableSource = PENDING_BID_DATA;
  PaBidDataTableSource = PAST_BID_DATA;
  PJobDataTableSource = JOB_PAY_DATA;
  RJobDataTableSource = JOB_REVIEW_DATA;
  HJobDataTableSource = JOB_HISTORY_DATA;

  cash: boolean;
  credit: boolean;

  review: string;
  rating: number;

  constructor(private router: Router) {

  }
  
  ngOnInit() {

  }

  onReviewSelect(row) {
    console.log(row); 
  }

  onCreditSelect(row) {
    console.log(row); 
  }

  onCashSelect(row) {
    console.log(row); 
  }

  onCancelSelect(row) {
    console.log(row); 
  }

  onClickLogout() {
    this.router.navigate(['/login']);
  }
}