import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSongComponent } from './dashboard-song.component';

describe('DashboardSongComponent', () => {
  let component: DashboardSongComponent;
  let fixture: ComponentFixture<DashboardSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
