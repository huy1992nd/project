import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRateSiteDialogComponent } from './update-rate-site.component';

describe('UpdateRateSiteDialogComponent', () => {
  let component: UpdateRateSiteDialogComponent;
  let fixture: ComponentFixture<UpdateRateSiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRateSiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRateSiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
