import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


export interface PetCategory {
  name: string,
  basePrice: number
}

const CATEGORY_DATA: PetCategory[] = [
  {
    name: 'Cat',
    basePrice: 200
  },
]

@Component({
  selector: 'app-view-pet-categories',
  templateUrl: './view-pet-categories.component.html',
  styleUrls: ['./view-pet-categories.component.less']
})
export class ViewPetCategoriesComponent implements OnInit {

  PetCategoriesDataTableSource = CATEGORY_DATA
  
  constructor() { }

  addPetCategoryForm = new FormGroup({
    name: new FormControl(),
    basePrice: new FormControl()
  });

  ngOnInit(): void {


  }

}