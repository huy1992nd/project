import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsTaxonomyComponent } from './cms-taxonomy.component';

describe('CmsTaxonomyComponent', () => {
  let component: CmsTaxonomyComponent;
  let fixture: ComponentFixture<CmsTaxonomyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsTaxonomyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
