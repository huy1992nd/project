import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsTaxonomyListComponent } from './cms-taxonomy-list.component';

describe('CmsTaxonomyListComponent', () => {
  let component: CmsTaxonomyListComponent;
  let fixture: ComponentFixture<CmsTaxonomyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsTaxonomyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsTaxonomyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
