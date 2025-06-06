import { CanActivateFn ,Router} from '@angular/router';
import {AuthService} from "../services/auth/auth.service";
import {inject} from "@angular/core";
export const redirectIfAuthenticateGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
