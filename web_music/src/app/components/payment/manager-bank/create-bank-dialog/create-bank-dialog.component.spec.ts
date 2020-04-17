import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBankDialogComponent } from './create-bank-dialog.component';

describe('CreateBankDialogComponent', () => {
  let component: CreateBankDialogComponent;
  let fixture: ComponentFixture<CreateBankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
