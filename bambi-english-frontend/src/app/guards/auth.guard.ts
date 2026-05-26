import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuth = localStorage.getItem('bambi_admin_auth') === 'true';
  if (!isAuth) {
    router.navigate(['/admin/login']);
    return false;
  }
  return true;
};
