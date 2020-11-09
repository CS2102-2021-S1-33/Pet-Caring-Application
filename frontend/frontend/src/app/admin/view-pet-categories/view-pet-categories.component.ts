import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-view-pet-categories',
  templateUrl: './view-pet-categories.component.html',
  styleUrls: ['./view-pet-categories.component.less']
})
export class ViewPetCategoriesComponent implements OnInit {

  constructor() { }

  length = 100;
  pageSize = 10;

  addPetCategoryForm = new FormGroup({
    name: new FormControl(),
    basePrice: new FormControl()
  });

  ngOnInit(): void {


  }

}