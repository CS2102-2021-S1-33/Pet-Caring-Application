import { Component, OnInit } from '@angular/core';

export interface Caretaker {
  name: string,
  username: string,
  caretaker_type: string,
  email: string,
  address: string
}

const PENDING_CARETAKER: Caretaker[] = [
  {
    name: 'Nadia',
    username: 'nadia',
    caretaker_type: 'full time',
    email: 'nadia@poochfriendly.com',
    address: '13 Computing Drive'
  },
]

const CARETAKER_HISTORY: Caretaker[] = [
  {
    name: 'Ray',
    username: 'ray',
    caretaker_type: 'full time',
    email: 'ray@poochfriendly.com',
    address: '12 Computing Drive'
  },
]

@Component({
  selector: 'app-verify-caretaker',
  templateUrl: './verify-caretaker.component.html',
  styleUrls: ['./verify-caretaker.component.less']
})
export class VerifyCaretakerComponent implements OnInit {

  CaretakerApplication = PENDING_CARETAKER
  ApplicationHistory = CARETAKER_HISTORY

  constructor() { }

  ngOnInit(): void {


  }

  onVerifySelect(row) {
    console.log(row)
  }

  onRejectSelect(row) {
    console.log(row)
  }

}