import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFeeSiteComponent } from './manager-fee-site.component';

describe('ManagerFeeSiteComponent', () => {
  let component: ManagerFeeSiteComponent;
  let fixture: ComponentFixture<ManagerFeeSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerFeeSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerFeeSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
