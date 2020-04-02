import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPostComponent } from './cms-post.component';

describe('CmsPostComponent', () => {
  let component: CmsPostComponent;
  let fixture: ComponentFixture<CmsPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
