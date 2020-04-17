import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMenuComponent } from './cms-menu.component';

describe('CmsMenuComponent', () => {
  let component: CmsMenuComponent;
  let fixture: ComponentFixture<CmsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
