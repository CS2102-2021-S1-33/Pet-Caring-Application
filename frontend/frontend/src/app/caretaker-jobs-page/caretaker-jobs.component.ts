import { Component, Input, Output, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';


export interface Bid {
  name: string;
  price: number;
  noOfPets: number;
  petCategories: string[];
  caretakingStart: string;
  caretakingEnd: string;
  phone: string;
  bidDate: string;
}

export interface Job {
  name: string;
  price: number;
  noOfPets: number;
  petCategories: string[];
  caretakingStart: string;
  caretakingEnd: string;
  phone: string;
  acceptedDate: string;
}

const BID_DATA: Bid[] = [
  {
    name: 'Priscilla Lim',
    price: 51,
    petCategories: ['Cat', 'Dog'],
    noOfPets: 2,
    caretakingStart: '27/9/2020',
    caretakingEnd: '29/9/2020',
    phone: '98765432',
    bidDate: '18/9/2020'
  }
];

const JOB_DATA: Job[] = [
  {
    name: 'Joel Lim',
    price: 51,
    petCategories: ['Cat'],
    noOfPets: 1,
    caretakingStart: '24/9/2020',
    caretakingEnd: '27/9/2020',
    phone: '98765431',
    acceptedDate: '21/9/2020'
  }
];

@Component({
  selector: 'app-caretaker-jobs',
  templateUrl: './caretaker-jobs.component.html',
  styleUrls: ['./caretaker-jobs.component.less']
})

export class CaretakerJobsComponent implements OnInit {

  searchForm = new FormGroup({
    keyword: new FormControl(''),
    pet: new FormControl(''),
    location: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  bidDataSource = new MatTableDataSource<Bid>(BID_DATA);
  bidTableDataSource = BID_DATA;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  };

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.bidDataSource.paginator = this.paginator;
    this.obs = this.bidDataSource.connect();
  }

  ngOnDestroy() {
    if (this.bidDataSource) { 
      this.bidDataSource.disconnect(); 
    }
  }
}
