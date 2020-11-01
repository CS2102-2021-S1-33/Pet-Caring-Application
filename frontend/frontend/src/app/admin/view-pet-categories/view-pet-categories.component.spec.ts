import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPetCategoriesComponent } from './view-pet-categories.component';

describe('RegisterLoginPageComponent', () => {
  let component: ViewPetCategoriesComponent;
  let fixture: ComponentFixture<ViewPetCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPetCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPetCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});