import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountSiteDialogComponent } from './create-account-site-dialog.component';

describe('CreateAccountSiteDialogComponent', () => {
  let component: CreateAccountSiteDialogComponent;
  let fixture: ComponentFixture<CreateAccountSiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountSiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountSiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
