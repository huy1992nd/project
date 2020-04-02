import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMenuNodeListComponent } from './cms-menu-node-list.component';

describe('CmsMenuNodeListComponent', () => {
  let component: CmsMenuNodeListComponent;
  let fixture: ComponentFixture<CmsMenuNodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMenuNodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMenuNodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
