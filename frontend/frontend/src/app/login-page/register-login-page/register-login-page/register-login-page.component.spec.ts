import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLoginPageComponent } from './register-login-page.component';

describe('RegisterLoginPageComponent', () => {
  let component: RegisterLoginPageComponent;
  let fixture: ComponentFixture<RegisterLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
