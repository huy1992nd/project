import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBankDialogComponent } from './delete-bank-dialog.component';

describe('DeleteBankDialogComponent', () => {
  let component: DeleteBankDialogComponent;
  let fixture: ComponentFixture<DeleteBankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteBankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
