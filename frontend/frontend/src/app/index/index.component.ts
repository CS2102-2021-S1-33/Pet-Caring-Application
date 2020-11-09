import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})

export class IndexComponent implements OnInit {
    constructor() {}

    searchForm = new FormGroup({
        address: new FormControl()
      });

    ngOnInit(): void {

    }
}