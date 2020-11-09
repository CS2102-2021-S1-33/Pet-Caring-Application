import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface Review {
  name: string;
  rating: number;
  date: string;
  review: string;
  recurring: boolean;
}

const DATA: Review[] = [
  {
    name: 'Helen',
    rating: 4,
    date: '5/9/2020',
    review: `Would highly recommend everyone to engage in their services. There’s no 
    issues at all and my cat came back safe and sound. Thanks Priscilla for your help!`,
    recurring: true
  },
  {
    name: 'Joel',
    rating: 5,
    date: '5/9/2020',
    review: `A* for personal pet care. I am truly a happy customer. Definitely recommended 
    to anyone.`,
    recurring: false
  },
  {
    name: 'Ahmad',
    rating: 5,
    date: '7/9/2020',
    review: `Priscilla is very accommodating. She’s very reliable and gives frequent updates. 
    Makes the whole trip very stress-free knowing that Bubu is in capable hands.`,
    recurring: true
  }
]

@Component({
  selector: 'app-individual-listing',
  templateUrl: './individual-listing.component.html',
  styleUrls: ['./individual-listing.component.less']
})

export class IndividualListingComponent implements OnInit, OnDestroy {
  name = "Priscilla";
  petCategories = "Cats, rabbits, dog"
  avgRating = "4.5"
  totalReviews = "30"
  minPrice = "17"

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Review> = new MatTableDataSource<Review>(DATA);

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
  
  bidForm = new FormGroup({
    //pet: new FormControl(''),
    //startDate: new FormControl(''),
    //endDate: new FormControl(''),
    phone: new FormControl(''),
    price: new FormControl('')
  });

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  ngOnDestroy() {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }
}
