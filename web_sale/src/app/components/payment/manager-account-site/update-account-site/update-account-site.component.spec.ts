import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountSiteComponent } from './update-account-site.component';

describe('UpdateAccountSiteComponent', () => {
  let component: UpdateAccountSiteComponent;
  let fixture: ComponentFixture<UpdateAccountSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAccountSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAccountSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
