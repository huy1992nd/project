import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongHeaderComponent } from './song-header.component';

describe('SongHeaderComponent', () => {
  let component: SongHeaderComponent;
  let fixture: ComponentFixture<SongHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
