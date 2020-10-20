import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-find-caretaker',
  templateUrl: './find-caretaker.component.html',
  styleUrls: ['./find-caretaker.component.less']
})

export class FindCaretakerComponent implements OnInit {

  constructor() { }

  searchForm = new FormGroup({
    keyword: new FormControl(''),
    pet: new FormControl(''),
    location: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  ngOnInit(): void {
  }

}
