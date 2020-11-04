import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicateAvailabilityComponent } from './indicate-availability.component';

describe('IndicateAvailabilityComponent', () => {
  let component: IndicateAvailabilityComponent;

  let fixture: ComponentFixture<IndicateAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicateAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicateAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
