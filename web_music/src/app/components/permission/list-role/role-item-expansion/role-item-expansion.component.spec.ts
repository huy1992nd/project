import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleItemExpansionComponent } from './role-item-expansion.component';

describe('RoleItemExpansionComponent', () => {
  let component: RoleItemExpansionComponent;
  let fixture: ComponentFixture<RoleItemExpansionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleItemExpansionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleItemExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
