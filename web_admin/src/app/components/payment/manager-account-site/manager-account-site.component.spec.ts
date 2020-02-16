import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAccountSiteComponent } from './manager-account-site.component';

describe('ManagerAccountSiteComponent', () => {
  let component: ManagerAccountSiteComponent;
  let fixture: ComponentFixture<ManagerAccountSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerAccountSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAccountSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
