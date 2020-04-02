import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBankDialogComponent } from './update-bank-dialog.component';

describe('UpdateBankDialogComponent', () => {
  let component: UpdateBankDialogComponent;
  let fixture: ComponentFixture<UpdateBankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
