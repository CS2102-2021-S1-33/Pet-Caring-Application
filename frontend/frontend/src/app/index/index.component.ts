import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export interface Category {
    name: string
}

const CATEGORIES: Category[] = [
    {name: 'Cat'}, {name: 'Dog'}, {name: 'Bird'}
]

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})

export class IndexComponent implements OnInit {
    categories = CATEGORIES
    
    constructor() {}

    searchForm = new FormGroup({
        address: new FormControl()
      });

    ngOnInit(): void {

    }
}