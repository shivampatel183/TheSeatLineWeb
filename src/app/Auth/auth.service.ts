import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  LoginEntity,
  RegisterEntity,
  GoogleLoginEntity,
  ResponseEntity,
} from './auth.model';
import { ApiResponse } from '../common/components/model/authmodel';
import { ApiService } from '../common/Services/api.services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiApiService: ApiService) {}

  login(data: LoginEntity): Observable<ApiResponse<ResponseEntity>> {
    return this.apiApiService
      .post<ApiResponse<ResponseEntity>>(`/Auth/login`, data)
      .pipe(tap((response) => this.saveTokens(response.data)));
  }

  register(data: RegisterEntity): Observable<ApiResponse<string>> {
    return this.apiApiService.post<ApiResponse<string>>(`/Auth/register`, data);
  }

  // Google Login
  loginWithGoogle(idToken: string): Observable<ApiResponse<ResponseEntity>> {
    return this.apiApiService
      .post<ApiResponse<ResponseEntity>>(`/Auth/google-login`, { idToken })
      .pipe(tap((response) => this.saveTokens(response.data)));
  }

  // Refresh Token
  refreshToken(): Observable<ApiResponse<ResponseEntity>> {
    const payload = {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
    return this.apiApiService
      .post<ApiResponse<ResponseEntity>>(`/refresh-token`, payload)
      .pipe(tap((response) => this.saveTokens(response.data)));
  }

  private saveTokens(data: ResponseEntity) {
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
