import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../general.service'

export interface Caretaker {
  username: string,
}

@Component({
  selector: 'app-admin-homepage',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.less']
})
export class AdminHomepageComponent implements OnInit {
  Caretaker: Caretaker[] = [];
  underperforming: Caretaker[] = [];

  constructor(private _service: GeneralService) { }

  ngOnInit(): void {

    this._service.adminGetUnderperformingCaretakers().subscribe( res => {
      JSON.stringify(res["result"].map(s => this.underperforming.push({username: s["username"]})));
    
      this.Caretaker = this.underperforming;
    })
  }

}