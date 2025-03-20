import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {map} from "rxjs/operators";

export const handymanGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserData().pipe(
    map(user => {
      const isAuthenticated = authService.isAuthenticated();
      const isAuthorized = user && (user.role === 'HANDYMAN');

      if (!isAuthenticated || !isAuthorized) {
        router.navigate(['/profile']); // Redirect unauthorized users
        return false;
      }
      return true;
    })
  );
};
