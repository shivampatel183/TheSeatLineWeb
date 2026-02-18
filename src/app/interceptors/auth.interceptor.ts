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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = localStorage.getItem('accessToken');

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('401 Error detected, attempting token refresh...');
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
      this.authService.logout();
      return throwError(() => new Error('Session expired. Please login again.'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.error('No refresh token available, logging out...');
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => new Error('No refresh token available'));
      }

      console.log('Attempting to refresh access token...');
      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          if (res.success && res.data && res.data.token) {
            console.log('Token refreshed successfully, retrying request...');
            this.refreshTokenSubject.next(res.data.token);
            return next.handle(this.addTokenHeader(request, res.data.token));
          } else {
            console.error('Token refresh failed, logging out...');
            this.authService.logout();
            return throwError(() => new Error('Token refresh failed'));
          }
        }),
        catchError((err) => {
          console.error('Error during token refresh:', err);
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        }),
      );
    } else {
      // Wait for token refresh to complete
      console.log('Token refresh already in progress, waiting...');
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          console.log('Using refreshed token for queued request');
          return next.handle(this.addTokenHeader(request, jwt));
        }),
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
