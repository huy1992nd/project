import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFeeSiteComponent } from './update-fee-site.component';

describe('UpdateFeeSiteComponent', () => {
  let component: UpdateFeeSiteComponent;
  let fixture: ComponentFixture<UpdateFeeSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFeeSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFeeSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
