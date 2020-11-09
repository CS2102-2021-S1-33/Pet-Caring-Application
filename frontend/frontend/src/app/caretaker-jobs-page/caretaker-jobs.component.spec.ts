import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretakerJobsComponent } from './caretaker-jobs.component';

describe('CaretakerJobsComponent', () => {
  let component: CaretakerJobsComponent;
  let fixture: ComponentFixture<CaretakerJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaretakerJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaretakerJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
