import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPermissionByRoleComponent } from './list-permission-by-role.component';

describe('ListPermissionByRoleComponent', () => {
  let component: ListPermissionByRoleComponent;
  let fixture: ComponentFixture<ListPermissionByRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPermissionByRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPermissionByRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
