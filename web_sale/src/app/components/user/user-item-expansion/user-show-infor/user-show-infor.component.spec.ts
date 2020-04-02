import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShowInforComponent } from './user-show-infor.component';

describe('UserShowInforComponent', () => {
  let component: UserShowInforComponent;
  let fixture: ComponentFixture<UserShowInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserShowInforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserShowInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
