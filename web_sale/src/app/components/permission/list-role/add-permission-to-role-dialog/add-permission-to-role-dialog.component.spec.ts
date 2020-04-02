import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionToRoleDialogComponent } from './add-permission-to-role-dialog.component';

describe('AddPermissionToRoleDialogComponent', () => {
  let component: AddPermissionToRoleDialogComponent;
  let fixture: ComponentFixture<AddPermissionToRoleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPermissionToRoleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermissionToRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
