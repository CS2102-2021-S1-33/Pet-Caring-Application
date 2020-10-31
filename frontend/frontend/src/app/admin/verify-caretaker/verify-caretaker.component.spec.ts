import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCaretakerComponent } from './verify-caretaker.component';

describe('RegisterLoginPageComponent', () => {
  let component: VerifyCaretakerComponent;
  let fixture: ComponentFixture<VerifyCaretakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyCaretakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCaretakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});