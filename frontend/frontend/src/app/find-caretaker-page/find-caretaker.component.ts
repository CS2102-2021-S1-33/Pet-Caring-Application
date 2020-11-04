import { Component, Input, Output, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

export interface Listing {
  name: string;
  petCategories: string[];
  price: number;
  rating: number;
  review: number;
}

const DATA: Listing[] = [
  {
    name: 'Priscilla Lim',
    petCategories: ['Cat', 'Dog'],
    price: 17,
    rating: 4,
    review: 82
  }, 
  {
    name: 'Joel Lim',
    petCategories: ['Cat'],
    price: 15,
    rating: 4,
    review: 89
  },
  {
    name: 'Priscilla Lim',
    petCategories: ['Cat', 'Dog'],
    price: 17,
    rating: 4,
    review: 82
  }, 
  {
    name: 'Joel Lim',
    petCategories: ['Cat'],
    price: 15,
    rating: 4,
    review: 89
  },
  {
    name: 'Priscilla Lim',
    petCategories: ['Cat', 'Dog'],
    price: 17,
    rating: 4,
    review: 82
  }, 
  {
    name: 'Joel Lim',
    petCategories: ['Cat'],
    price: 15,
    rating: 4,
    review: 89
  },
];

@Component({
  selector: 'app-find-caretaker',
  templateUrl: './find-caretaker.component.html',
  styleUrls: ['./find-caretaker.component.less']
})

export class FindCaretakerComponent implements OnInit {

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

  constructor(private changeDetectorRef: ChangeDetectorRef) {

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
}
