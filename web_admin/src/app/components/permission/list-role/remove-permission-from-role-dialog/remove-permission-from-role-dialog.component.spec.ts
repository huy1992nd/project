import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePermissionFromRoleDialogComponent } from './remove-permission-from-role-dialog.component';

describe('RemovePermissionFromRoleDialogComponent', () => {
  let component: RemovePermissionFromRoleDialogComponent;
  let fixture: ComponentFixture<RemovePermissionFromRoleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePermissionFromRoleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePermissionFromRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
