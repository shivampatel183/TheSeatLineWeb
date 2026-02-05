import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginEntity, RegisterEntity, GoogleLoginEntity } from './auth.model';
import { ApiResponse } from '../common/components/model/authmodel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7243/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<ApiResponse<LoginEntity>> {
    return this.http
      .post<ApiResponse<LoginEntity>>(`${this.apiUrl}/login`, data)
      .pipe(tap((response) => this.saveTokens(response.data)));
  }

  register(data: RegisterEntity): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, data);
  }

  // Google Login
  loginWithGoogle(idToken: string): Observable<ApiResponse<LoginEntity>> {
    return this.http
      .post<
        ApiResponse<LoginEntity>
      >(`${this.apiUrl}/google-login`, { idToken })
      .pipe(tap((response) => this.saveTokens(response.data)));
  }

  // Refresh Token
  refreshToken(): Observable<ApiResponse<LoginEntity>> {
    const payload = {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
    return this.http
      .post<ApiResponse<LoginEntity>>(`${this.apiUrl}/refresh-token`, payload)
      .pipe(tap((response) => this.saveTokens(response.data)));
  }

  // Helper to Save Tokens
  private saveTokens(data: LoginEntity) {
    if (data) {
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: data.email,
          fullName: data.fullName,
        }),
      );
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
