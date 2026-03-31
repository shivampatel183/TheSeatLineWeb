import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, take, tap } from 'rxjs';
import {
  LoginEntity,
  RegisterEntity,
  ResponseEntity,
} from './auth.model';
import { ApiResponse } from '../common/model/api.model';
import { ApiService } from '../common/Services/api.services';

type AuthState = 'initializing' | 'authenticated' | 'anonymous';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser = signal<ResponseEntity['user'] | null>(null);
  public authState = signal<AuthState>('initializing');
  private router = inject(Router);
  private initSessionRequest$: Observable<boolean> | null = null;

  constructor(private apiApiService: ApiService) {}

  initializeSession(): Observable<boolean> {
    const currentState = this.authState();

    if (currentState === 'authenticated') {
      return of(true);
    }

    if (currentState === 'anonymous') {
      return of(false);
    }

    if (this.initSessionRequest$) {
      return this.initSessionRequest$;
    }

    this.initSessionRequest$ = this.apiApiService
      .get<ResponseEntity['user']>(`/Auth/profile`)
      .pipe(
        map((response) => {
          const isSuccess = response.success ?? response.Success ?? false;

          if (isSuccess && response.data) {
            this.setAuthenticatedUser(response.data);
            return true;
          }

          this.clearSession();
          return false;
        }),
        catchError(() => {
          this.clearSession();
          return of(false);
        }),
        finalize(() => {
          this.initSessionRequest$ = null;
        }),
        shareReplay(1),
      );

    return this.initSessionRequest$;
  }

  login(data: LoginEntity): Observable<ApiResponse<ResponseEntity>> {
    return this.apiApiService
      .post<ResponseEntity>(`/Auth/login`, data)
      .pipe(tap((response) => this.saveSession(response.data)));
  }

  register(data: RegisterEntity): Observable<ApiResponse<string>> {
    return this.apiApiService.post<string>(`/Auth/register`, data);
  }

  // Google Login
  loginWithGoogle(idToken: string): Observable<ApiResponse<ResponseEntity>> {
    return this.apiApiService
      .post<ResponseEntity>(`/Auth/google-login`, { idToken })
      .pipe(tap((response) => this.saveSession(response.data)));
  }

  // Refresh Token
  refreshToken(): Observable<ApiResponse<ResponseEntity>> {
    const payload = {};
    return this.apiApiService.post<ResponseEntity>(`/Auth/refresh-token`, payload);
  }

  private saveSession(data: ResponseEntity) {
    if (!data) {
      return;
    }

    if (data.user) {
      this.setAuthenticatedUser(data.user);
    } else {
      this.authState.set('authenticated');
    }
  }

  private setAuthenticatedUser(user: ResponseEntity['user']) {
    this.currentUser.set(user);
    this.authState.set('authenticated');
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearSession() {
    this.currentUser.set(null);
    this.authState.set('anonymous');
    localStorage.removeItem('currentUser');
  }

  forceLogout(reason: string = 'User request', redirectToLogin = true) {
    console.log(`AuthService: logging out. Reason: ${reason}`);
    this.clearSession();

    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  logout(reason: string = 'User request', redirectToLogin = true) {
    this.apiApiService
      .post<null>(`/Auth/logout`, {})
      .pipe(
        take(1),
        catchError((error) => {
          console.error('AuthService: server logout failed.', error);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.forceLogout(reason, redirectToLogin);
      });
  }

  isLoggedIn(): boolean {
    return this.authState() === 'authenticated';
  }

  isInitializing(): boolean {
    return this.authState() === 'initializing';
  }
}
