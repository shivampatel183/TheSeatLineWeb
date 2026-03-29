import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

  constructor(private apiApiService: ApiService) {}

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
      .pipe(tap((response) => this.saveSession(response.data)));
  }

  private saveSession(data: ResponseEntity) {
    if (data) {
      if (data.user) {
        this.currentUser.set(data.user);
      }
      this.isAuthenticated.set(true);
    }
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    window.location.href = '/login';
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
