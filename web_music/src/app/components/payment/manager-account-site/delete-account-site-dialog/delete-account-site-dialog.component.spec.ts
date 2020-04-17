import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountSiteDialogComponent } from './delete-account-site-dialog.component';

describe('DeleteAccountSiteDialogComponent', () => {
  let component: DeleteAccountSiteDialogComponent;
  let fixture: ComponentFixture<DeleteAccountSiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAccountSiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountSiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
