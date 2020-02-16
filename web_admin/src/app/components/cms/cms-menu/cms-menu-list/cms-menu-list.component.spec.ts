import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMenuListComponent } from './cms-menu-list.component';

describe('CmsMenuListComponent', () => {
  let component: CmsMenuListComponent;
  let fixture: ComponentFixture<CmsMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
