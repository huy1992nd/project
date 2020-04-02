import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemExpansionComponent } from './user-item-expansion.component';

describe('UserItemExpansionComponent', () => {
  let component: UserItemExpansionComponent;
  let fixture: ComponentFixture<UserItemExpansionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserItemExpansionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserItemExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
