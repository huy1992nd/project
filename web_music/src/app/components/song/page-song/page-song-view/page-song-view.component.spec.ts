import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSongViewComponent } from './page-song-view.component';

describe('PageSongViewComponent', () => {
  let component: PageSongViewComponent;
  let fixture: ComponentFixture<PageSongViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSongViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSongViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
