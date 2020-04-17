import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRateSiteDialogComponent } from './create-rate-site-dialog.component';

describe('CreateRateSiteDialogComponent', () => {
  let component: CreateRateSiteDialogComponent;
  let fixture: ComponentFixture<CreateRateSiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRateSiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRateSiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
