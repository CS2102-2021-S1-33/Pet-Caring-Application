import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-homepage',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.less']
})
export class AdminHomepageComponent implements OnInit {

  constructor() { }

  length = 100;
  pageSize = 10;

  ngOnInit(): void {


  }

}