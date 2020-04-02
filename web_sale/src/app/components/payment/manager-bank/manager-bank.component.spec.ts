import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerBankComponent } from './manager-bank.component';

describe('ManagerBankComponent', () => {
  let component: ManagerBankComponent;
  let fixture: ComponentFixture<ManagerBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
