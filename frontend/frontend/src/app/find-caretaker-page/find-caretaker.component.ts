import { Component, Input, Output, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

export interface Listing {
  name: string;
  address: string;
  relativeLocation: number;
  petCategories: string[];
  price: number;
  rating: number;
  review: number;
}

const DATA: Listing[] = [
  {
    name: 'Priscilla Lim',
    address: 'Bukit Batok, Singapore',
    relativeLocation: 1.2,
    petCategories: ['Cat', 'Dog'],
    price: 17,
    rating: 5,
    review: 3
  }, 
  {
    name: 'Joaey Lim',
    address: 'Bukit Batok, Singapore',
    relativeLocation: 1.4,
    petCategories: ['Cat'],
    price: 15,
    rating: 4,
    review: 11
  },
  {
    name: 'Joel',
    address: 'Bukit Timah, Singapore',
    relativeLocation: 1.2,
    petCategories: ['Cat', 'Dog'],
    price: 17,
    rating: 3,
    review: 8
  }, 
  {
    name: 'John',
    address: 'Buona Vista, Singapore',
    relativeLocation: 1.4,
    petCategories: ['Dog'],
    price: 15,
    rating: 4,
    review: 8
  },
  {
    name: 'Johanna',
    address: 'Tampines, Singapore',
    relativeLocation: 1.2,
    petCategories: ['Cat', 'Dog'],
    price: 17,
    rating: 5,
    review: 6
  }, 
  {
    name: 'Lee Pin',
    address: 'KentRidge, Singapore',
    relativeLocation: 1.4,
    petCategories: ['Dog'],
    price: 12,
    rating: 4,
    review: 7
  },
];

@Component({
  selector: 'app-find-caretaker',
  templateUrl: './find-caretaker.component.html',
  styleUrls: ['./find-caretaker.component.less']
})

export class FindCaretakerComponent implements OnInit {

  listing = DATA;

  searchForm = new FormGroup({
    keyword: new FormControl(''),
    pet: new FormControl(''),
    location: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Listing> = new MatTableDataSource<Listing>(DATA);

  constructor(private changeDetectorRef: ChangeDetectorRef,
     private router: Router) {

  };


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

  onClickLogout() {
    this.router.navigate(['/login']);
  }

  onClickCard() {
    this.router.navigate(['/listing']);
  }
}
