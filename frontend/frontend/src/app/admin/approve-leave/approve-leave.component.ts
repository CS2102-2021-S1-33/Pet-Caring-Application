import { Component, OnInit } from '@angular/core';

export interface Leave {
  name: string,
  username: string,
  leave_start: Date,
  leave_end: Date,
  approved_on: Date
}

const PENDING_LEAVE: Leave[] = [
  {
    name: 'Ray',
    username: 'ray',
    leave_start: new Date(),
    leave_end: new Date(),
    approved_on: null
  }
]

const LEAVE_HISTORY: Leave[] = [
  {
    name: 'Laurent',
    username: 'laurent',
    leave_start: new Date(),
    leave_end: new Date(),
    approved_on: new Date()
  }
]

@Component({
  selector: 'app-approve-leave',
  templateUrl: './approve-leave.component.html',
  styleUrls: ['./approve-leave.component.less']
})
export class ApproveLeaveComponent implements OnInit {
  PendingLeave = PENDING_LEAVE
  LeaveHistory = LEAVE_HISTORY

  constructor() { }

  ngOnInit(): void {


  }

  onApproveSelect(row) {
    console.log(row);
  }

  onRejectSelect(row) {
    console.log(row);
  }

}