import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectIfAuthenticateGuard } from './redirect-if-authenticate.guard';

describe('redirectIfAuthenticateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectIfAuthenticateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
