import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRolePermissionComponent } from './manager-role-permission.component';

describe('ManagerRolePermissionComponent', () => {
  let component: ManagerRolePermissionComponent;
  let fixture: ComponentFixture<ManagerRolePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerRolePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
