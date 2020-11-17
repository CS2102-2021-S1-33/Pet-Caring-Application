import { Component, OnInit } from '@angular/core';

export interface Leave {
  name: string,
  username: string,
  leaveStart: string,
  leaveEnd: string,
  approvedOn: string
}

const PENDING_LEAVE: Leave[] = [
  {
    name: 'Ray',
    username: 'ray',
    leaveStart: "27-11-2020",
    leaveEnd: "01-12-2020",
    approvedOn: null
  },
  {
    name: 'Sal',
    username: 'sal2',
    leaveStart: "22-12-2020",
    leaveEnd: "01-01-2021",
    approvedOn: null
  },
  {
    name: 'Ned',
    username: 'Ned21',
    leaveStart: "29-11-2020",
    leaveEnd: "01-12-2020",
    approvedOn: null
  },
  {
    name: 'Relyk',
    username: 'Relyks',
    leaveStart: "12-12-2020",
    leaveEnd: "18-12-2020",
    approvedOn: null
  }
]

const LEAVE_HISTORY: Leave[] = [
  {
    name: 'Laurent',
    username: 'laurent',
    leaveStart: "23-09-2020",
    leaveEnd: "27-09-2020",
    approvedOn: "12-09-2020"
  },
  {
    name: 'Tyson',
    username: 'Tenz',
    leaveStart: "02-10-2020",
    leaveEnd: "04-10-2020",
    approvedOn: "19-09-2020"
  },
  {
    name: 'Shin',
    username: 'Shin123',
    leaveStart: "12-10-2020",
    leaveEnd: "17-10-2020",
    approvedOn: "30-09-2020"
  },
  {
    name: 'Mitch',
    username: 'Mitch2',
    leaveStart: "23-10-2020",
    leaveEnd: "27-10-2020",
    approvedOn: "30-09-2020"
  },
  {
    name: 'Subroz',
    username: 'Subroza',
    leaveStart: "25-10-2020",
    leaveEnd: "27-10-2020",
    approvedOn: "30-09-2020"
  },
  {
    name: 'Wardell',
    username: 'notWardell',
    leaveStart: "28-10-2020",
    leaveEnd: "31-10-2020",
    approvedOn: "01-10-2020"
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