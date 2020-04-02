import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePermissionDialogComponent } from './update-permission-dialog.component';

describe('UpdatePermissionDialogComponent', () => {
  let component: UpdatePermissionDialogComponent;
  let fixture: ComponentFixture<UpdatePermissionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePermissionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
