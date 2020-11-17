import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../general.service';

export interface Caretaker {
  name: string,
  username: string,
  caretakerType: string,
  email: string,
}

@Component({
  selector: 'app-verify-caretaker',
  templateUrl: './verify-caretaker.component.html',
  styleUrls: ['./verify-caretaker.component.less']
})
export class VerifyCaretakerComponent implements OnInit {

  CaretakerApplication:Caretaker[] = []
  ApplicationHistory:Caretaker[] = []
  caretakerList:Caretaker[] = [];
  partTimeCaretakerList: Caretaker[] = [];

  constructor(private _service: GeneralService) { }

  ngOnInit(): void {

    this._service.adminGetAllUsers().subscribe(res => {
      JSON.stringify(res["result"].map(s => {
        if( s["is_deleted"] === false && (s["user_type"] === "PART_TIME_CARETAKER" || s["user_type"] === "FULL_TIME_CARETAKER")) {
          this.caretakerList.push({username: s["username"], caretakerType: s["user_type"], name: s["name"], email: s["email"]});
        }
        if(s["is_deleted"] === false && s["user_type"] === "PART_TIME_CARETAKER") {
          this.partTimeCaretakerList.push({username: s["username"], caretakerType: s["user_type"], name: s["name"], email: s["email"]});
        }
    }));

    console.log(this.partTimeCaretakerList);
    this.CaretakerApplication = this.partTimeCaretakerList;
    this.ApplicationHistory = this.caretakerList;
    });
  }

  onVerifySelect(row) {
    console.log(row)
  }

  onRejectSelect(row) {
    console.log(row)
  }

}