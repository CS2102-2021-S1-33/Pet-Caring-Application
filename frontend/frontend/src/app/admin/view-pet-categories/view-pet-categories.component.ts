import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GeneralService } from '../../general.service'


export interface PetCategory {
  petCategory: string,
  basePrice: string
}

@Component({
  selector: 'app-view-pet-categories',
  templateUrl: './view-pet-categories.component.html',
  styleUrls: ['./view-pet-categories.component.less']
})
export class ViewPetCategoriesComponent implements OnInit {

  petList: PetCategory[] = [];
  PetCategoriesDataTableSource = [];
  rows: any[] = [];
  selected: any[] = [];
  
  
  constructor(private _service: GeneralService) { }

  addPetCategoryForm = new FormGroup({
    name: new FormControl(''),
    basePrice: new FormControl('')
  });

  ngOnInit(): void {
    this._service.getAllPetCategories().subscribe(res => { (JSON.stringify(res["result"].map(s => {
      if(s["is_deleted"] === false) {
      this.petList.push({petCategory: s["pet_category_name"], basePrice: s["base_price"]})}
    }
      )));
    this.PetCategoriesDataTableSource = this.petList;
    
  });
    console.log(this.petList);
  }


  onAddPetCategory() {
    let name = this.addPetCategoryForm.get('name').value;
    let price = this.addPetCategoryForm.get('basePrice').value;

    this._service.adminAddPetCategory(name,price).subscribe(r => this._service.getAllPetCategories().subscribe(res => { 
      this.petList = [];
      (JSON.stringify(res["result"].forEach(s => this.petList.push({petCategory: s["pet_category_name"], basePrice: s["base_price"]}))));
    this.PetCategoriesDataTableSource = this.petList;
    
  }));
  }

  onSelect(event) {
    console.log('Event: select', event, this.selected);
  }

  onActivate(event) {
    let s:string = "";
    if(event.type === "click") {
     s =  event.row["petCategory"];
     this._service.adminDeletePetCategory(s).subscribe(res => console.log(res));
     this._service.getAllPetCategories().subscribe(res => { (JSON.stringify(res["result"].map(s => {
       if(s["is_deleted"] === false) {
       this.petList.push({petCategory: s["pet_category_name"], basePrice: s["base_price"]})}
     }
       )));
     this.PetCategoriesDataTableSource = this.petList;
     
   });
    }
 
  }

  
}