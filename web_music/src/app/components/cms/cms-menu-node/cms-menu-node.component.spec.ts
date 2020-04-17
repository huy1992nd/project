import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMenuNodeComponent } from './cms-menu-node.component';

describe('CmsMenuNodeComponent', () => {
  let component: CmsMenuNodeComponent;
  let fixture: ComponentFixture<CmsMenuNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMenuNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMenuNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
