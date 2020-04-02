import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPageListComponent } from './cms-page-list.component';

describe('CmsPageListComponent', () => {
  let component: CmsPageListComponent;
  let fixture: ComponentFixture<CmsPageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
