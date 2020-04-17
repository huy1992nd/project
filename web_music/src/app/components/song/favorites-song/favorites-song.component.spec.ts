import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesSongComponent } from './favorites-song.component';

describe('FavoritesSongComponent', () => {
  let component: FavoritesSongComponent;
  let fixture: ComponentFixture<FavoritesSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
