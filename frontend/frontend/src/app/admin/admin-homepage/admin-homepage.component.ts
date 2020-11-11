import { Component, OnInit } from '@angular/core';

export interface Caretaker {
  username: string,
}

const UNDERPERFORMING: Caretaker[] = [
  {
    username: 'Alice'
  },
  {
    username: 'Bob'
  },
  {
    username: 'Charli'
  }
]

@Component({
  selector: 'app-admin-homepage',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.less']
})
export class AdminHomepageComponent implements OnInit {
  Caretaker = UNDERPERFORMING

  constructor() { }

  ngOnInit(): void {


  }

}