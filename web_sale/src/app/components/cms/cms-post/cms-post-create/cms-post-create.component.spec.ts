import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPostCreateComponent } from './cms-post-create.component';

describe('CmsPostCreateComponent', () => {
  let component: CmsPostCreateComponent;
  let fixture: ComponentFixture<CmsPostCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPostCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
