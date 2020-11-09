import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../general.service'
@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.less']
})
export class AboutPageComponent implements OnInit {

  constructor(private _service: GeneralService) { }

  ngOnInit(): void {
    
  }
  
}
