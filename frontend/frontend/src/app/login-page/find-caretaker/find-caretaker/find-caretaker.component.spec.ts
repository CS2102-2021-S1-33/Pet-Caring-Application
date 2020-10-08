import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCaretakerComponent } from './find-caretaker.component';

describe('FindCaretakerComponent', () => {
  let component: FindCaretakerComponent;
  let fixture: ComponentFixture<FindCaretakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindCaretakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindCaretakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
