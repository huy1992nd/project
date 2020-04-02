import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRateSiteComponent } from './manager-rate-site.component';

describe('ManagerRateSiteComponent', () => {
  let component: ManagerRateSiteComponent;
  let fixture: ComponentFixture<ManagerRateSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerRateSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerRateSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




