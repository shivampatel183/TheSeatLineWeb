import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  constructor(private http: HttpClient) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const oldToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      // Call your backend refresh endpoint
      return this.http
        .post<any>('https://localhost:7243/api/auth/refresh-token', {
          accessToken: oldToken,
          refreshToken: refreshToken,
        })
        .pipe(
          switchMap((res: any) => {
            this.isRefreshing = false;

            localStorage.setItem('accessToken', res.data.token);
            localStorage.setItem('refreshToken', res.data.refreshToken);

            this.refreshTokenSubject.next(res.data.token);
            return next.handle(this.addToken(request, res.data.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            // Logout if refresh fails
            localStorage.clear();
            window.location.href = '/login';
            return throwError(() => err);
          }),
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        }),
      );
    }
  }
}
