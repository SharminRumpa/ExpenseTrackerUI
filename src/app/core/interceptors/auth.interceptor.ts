import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      // Only auto-logout for 401s on requests that WERE authenticated —
      // avoids logging out someone who just typed a wrong login password (also 401, but from /auth/login itself)
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

      if (err.status === 401 && token && !isAuthEndpoint) {
        authService.logout();
      }

      return throwError(() => err);
    })
  );
};