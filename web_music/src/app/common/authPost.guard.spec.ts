import { TestBed, async, inject } from '@angular/core/testing';

import { AuthPostGuard } from './authPost.guard';

describe('AuthPostGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthPostGuard]
    });
  });

  it('should ...', inject([AuthPostGuard], (guard: AuthPostGuard) => {
    expect(guard).toBeTruthy();
  }));
});
