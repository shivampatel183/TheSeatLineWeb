import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../Auth/auth.service';
import {
  CSRF_HEADER_NAME,
  CSRF_HEADER_VALUE,
  isApiRequestUrl,
  isUnsafeApiMethod,
} from '../common/config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!isApiRequestUrl(req.url)) {
      return next.handle(req);
    }

    let authReq = req.withCredentials ? req : req.clone({
      withCredentials: true,
    });

    if (
      isUnsafeApiMethod(authReq.method) &&
      authReq.headers.get(CSRF_HEADER_NAME) !== CSRF_HEADER_VALUE
    ) {
      authReq = authReq.clone({
        setHeaders: {
          [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          authReq.url.includes('/Auth/logout')
        ) {
          return throwError(() => error);
        }

        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('AuthInterceptor: 401 Error detected on API call:', authReq.url);
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // Don't try to refresh token if the request is already a refresh token request
    if (request.url.includes('/Auth/refresh-token')) {
      console.error('Refresh token request failed, logging out...');
      this.isRefreshing = false;
      this.refreshTokenSubject.next(false);
      this.authService.forceLogout(
        'Refresh token request failed',
        !this.authService.isInitializing(),
      );
      return throwError(
        () => new Error('Session expired. Please login again.'),
      );
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      console.log('AuthInterceptor: Attempting to refresh access token via cookies...');
      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          const isSuccess = res?.success ?? res?.Success ?? false;
          if (isSuccess) {
            console.log('AuthInterceptor: Session refreshed successfully via cookies, retrying request...');
            this.refreshTokenSubject.next(true);

            const retriedReq = request.clone({
              withCredentials: true,
            });
            return next.handle(retriedReq);
          } else {
            console.error('AuthInterceptor: Token refresh failed in Interceptor!', res);
            this.refreshTokenSubject.next(false);
            this.authService.forceLogout(
              'Token refresh failed in Interceptor',
              !this.authService.isInitializing(),
            );
            return throwError(() => new Error('Token refresh failed'));
          }
        }),
        catchError((err) => {
          console.error('AuthInterceptor: Error during token refresh in Interceptor:', err);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(false);
          this.authService.forceLogout(
            'Exception during refresh in Interceptor',
            !this.authService.isInitializing(),
          );
          return throwError(() => err);
        }),
      );
    } else {
      // Wait for token refresh to complete
      console.log('Token refresh already in progress, waiting...');
      return this.refreshTokenSubject.pipe(
        filter((refreshSucceeded) => refreshSucceeded !== null),
        take(1),
        switchMap((refreshSucceeded) => {
          if (!refreshSucceeded) {
            return throwError(() => new Error('Token refresh failed'));
          }

          console.log('Retrying queued request after cookie refresh');
          const retriedReq = request.clone({
            withCredentials: true,
          });
          return next.handle(retriedReq);
        }),
      );
    }
  }
}

