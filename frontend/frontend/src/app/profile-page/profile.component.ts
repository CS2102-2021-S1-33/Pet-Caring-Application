import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

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
    avgRating: 4,
    totalReviews: 180,
    lastWorked: 2
  },
]

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})

export class ProfileComponent implements OnInit {
  user = USER_DATA;
  pets = PET_DATA;

  caretaker = CARETAKER_DATA;
  LDataSource = LEAVE_DATA;
  ADataSource = AVAILABILITY_DATA;
  
  bidForm = new FormGroup({
    review: new FormControl(''),
    rating: new FormControl('')
  });

  ngOnInit() {

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
}
