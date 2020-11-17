import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { GeneralService } from '../general.service'


export interface User {
  name: string;
  email: string;
  username: string;
  accountType: string[];
}

export interface Caretaker {
  petCategories: string[];
  avgRating: number;
  totalReviews: number;
  lastWorked: number;
}

export interface Pet {
  pet_name: string;
  special_requirements: string;
  pet_category: string;
}

export interface Leave {
  leave_start: string;
  leave_end: string;
  application_date: string;
  processed_date: string;
  status: string;
}

export interface Availability {
  avail_start: string;
  avail_end: string;
  application_date: string;
}

const USER_DATA: User[] = [
  {
    name: 'Helen',
    email: 'helen.hello@gmail.com',
    username: 'hellllllen',
    accountType: ['Pet Owner', 'Full-time Caretaker']
  },
]

const PET_DATA: Pet[] = [
  {
    pet_name: 'Maru',
    special_requirements: '',
    pet_category: 'Cat'
  },
  {
    pet_name: 'Nala',
    special_requirements: 'She does not eat chicken.',
    pet_category: 'Dog'
  },
]

const LEAVE_DATA: Leave[] = [
  {
    leave_start: '31/03/2020',
    leave_end: '18/04/2020',
    application_date: '19/03/2020',
    processed_date: '21/03/2020',
    status: 'Approved'
  },
  {
    leave_start: '1/03/2020',
    leave_end: '3/03/2020',
    application_date: '28/02/2020',
    processed_date: '1/03/2020',
    status: 'Rejected'
  },
]


const AVAILABILITY_DATA: Availability[] = [
  {
    avail_start: '1/03/2020',
    avail_end: '4/02/2020',
    application_date: '28/02/2020',
  },
]

const CARETAKER_DATA: Caretaker[] = [
  {
    petCategories: ['Cat', 'Dog'],
    avgRating: 5,
    totalReviews: 3,
    lastWorked: 2
  },
]

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})

export class ProfileComponent implements OnInit {
  user: User[] = [];
  userdetails: User[] = [];
  pets: Pet[] = PET_DATA;
  petdetails: Pet[] = [];
  account_type: string[] = ['PET_OWNER', 'FULL_TIME_CARETAKER'];
  averageCostPerPet: string = "";
  caretaker = CARETAKER_DATA;
  LDataSource = LEAVE_DATA;
  ADataSource = AVAILABILITY_DATA;
  
  bidForm = new FormGroup({
    review: new FormControl(''),
    rating: new FormControl('')
  });

  constructor(private router: Router, private _service: GeneralService) {

  }

  ngOnInit() {

    this._service.getUsersDetails().subscribe(res => {
      let s = (res["result"]);
      this.userdetails.push({name: s["name"], username: s["username"], 
    email: s["email"], accountType: this.account_type});
    console.log(this.userdetails);
    this.user = this.userdetails;
    //this.account_type = s["user_type"];
  })

  this._service.getUserPets().subscribe(res => {
    JSON.stringify(res["result"].map(s => this.petdetails.push({pet_name: s["pet_name"],
    special_requirements: s["special_requirements"], pet_category: s["pet_category_name"]})));
    //this.pets = this.petdetails;
  })

  // if(this.account_type==="PET_OWNER") {
  //   this._service.petOwnerGetCq().subscribe()
  // }

  }

  onDeleteSelect(row) {
    console.log(row); 
  }

  onEditInformationClick(row) {
    console.log(row); //go to sign up page and change info
  }

  onAddAvailabilityClick(row) {
    console.log(row); //go to availability application page
  }

  onAddLeaveClick(row) {
    console.log(row); //go to leave application page
  }

  onClickLogout() {
    this.router.navigate(['/login']);
  }
}
