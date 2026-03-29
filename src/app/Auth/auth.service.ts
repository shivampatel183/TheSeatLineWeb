import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import {
  LoginEntity,
  RegisterEntity,
  GoogleLoginEntity,
  ResponseEntity,
} from './auth.model';
import { ApiResponse } from '../common/model/api.model';
import { ApiService } from '../common/Services/api.services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Using Signals for non-persistent session state
  public currentUser = signal<ResponseEntity['user'] | null>(null);
  public isAuthenticated = signal<boolean>(false);
  public accessToken = signal<string | null>(null);
  private router = inject(Router);

  constructor(private apiApiService: ApiService) {
    this.restoreSession();
  }

  private restoreSession() {
    console.log('AuthService: Running synchronous restoreSession...');
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('AuthService: Synchronous restore found user:', user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } else {
        console.log('AuthService: No user found in localStorage during sync restore.');
      }
    } catch (e) {
      console.error('AuthService: Error during sync restoreSession:', e);
    }
  }

  initSession(): Observable<any> {
    console.log('AuthService: Starting async initSession (refresh)...');
    if (this.isAuthenticated()) {
      console.log('AuthService: Session exists, starting background refresh...');
      return this.refreshToken().pipe(
        tap(res => console.log('AuthService: Async refresh successful:', res)),
        catchError((err) => {
          console.error('AuthService: Async refresh failed!', err);
          this.logout('Refresh failure in initSession');
          return of(null);
        })
      );
    }
    console.log('AuthService: No session to refresh.');
    return of(null);
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
    // Relying on HTTPOnly cookies, no payload needed conceptually but matching signature
    const payload = {}; 
    return this.apiApiService
      .post<ResponseEntity>(`/Auth/refresh-token`, payload)
      .pipe(tap((response) => {
         if (response.success && response.data) {
           this.accessToken.set(response.data.accessToken);
         }
      }));
  }

  private saveSession(data: ResponseEntity) {
    if (data) {
      if (data.accessToken) {
        this.accessToken.set(data.accessToken);
      }
      if (data.user) {
        this.currentUser.set(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }
      this.isAuthenticated.set(true);
    }
  }

  logout(reason: string = 'User request') {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
