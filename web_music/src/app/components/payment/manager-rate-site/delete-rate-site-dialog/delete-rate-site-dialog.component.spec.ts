import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRateSiteDialogComponent } from './delete-rate-site-dialog.component';

describe('DeleteRateSiteDialogComponent', () => {
  let component: DeleteRateSiteDialogComponent;
  let fixture: ComponentFixture<DeleteRateSiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRateSiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRateSiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
