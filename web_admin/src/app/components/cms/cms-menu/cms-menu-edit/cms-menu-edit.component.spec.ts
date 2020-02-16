import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMenuEditComponent } from './cms-menu-edit.component';

describe('CmsMenuEditComponent', () => {
  let component: CmsMenuEditComponent;
  let fixture: ComponentFixture<CmsMenuEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMenuEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
