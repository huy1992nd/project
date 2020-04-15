import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeSongComponent } from './like-song.component';

describe('LikeSongComponent', () => {
  let component: LikeSongComponent;
  let fixture: ComponentFixture<LikeSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
