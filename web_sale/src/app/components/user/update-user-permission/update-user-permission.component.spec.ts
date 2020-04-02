import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserPermissionComponent } from './update-user-permission.component';

describe('UpdateUserPermissionComponent', () => {
  let component: UpdateUserPermissionComponent;
  let fixture: ComponentFixture<UpdateUserPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
