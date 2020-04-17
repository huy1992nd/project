import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsTaxonomyEditComponent } from './cms-taxonomy-edit.component';

describe('CmsTaxonomyEditComponent', () => {
  let component: CmsTaxonomyEditComponent;
  let fixture: ComponentFixture<CmsTaxonomyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsTaxonomyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsTaxonomyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
