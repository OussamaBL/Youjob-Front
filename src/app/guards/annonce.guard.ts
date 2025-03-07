import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const annonceGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserData().pipe(
    map(user => {
      const isAuthenticated = authService.isAuthenticated();
      const isAuthorized = user && (user.role === 'BUSINESS' || user.role === 'CUSTOMER');

      if (!isAuthenticated || !isAuthorized) {
        router.navigate(['/profile']); // Redirect unauthorized users
        return false;
      }
      return true;
    })
  );
};
