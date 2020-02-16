import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPostListComponent } from './cms-post-list.component';

describe('CmsPostListComponent', () => {
  let component: CmsPostListComponent;
  let fixture: ComponentFixture<CmsPostListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPostListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
