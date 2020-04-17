import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPostEditComponent } from './cms-post-edit.component';

describe('CmsPostEditComponent', () => {
  let component: CmsPostEditComponent;
  let fixture: ComponentFixture<CmsPostEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPostEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPostEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
