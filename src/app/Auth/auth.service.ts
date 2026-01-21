import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../common/Services/api.services';
import { ApiResponse } from '../common/components/model/authmodel';
import { LoginEntity } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  register(user: any): Observable<ApiResponse<string>> {
    return this.api.post('/Auth/Registration', user);
  }

  login(user: any): Observable<ApiResponse<LoginEntity>> {
    return this.api.post<ApiResponse<LoginEntity>>('/Auth/Login', user);
  }

  validateToken(): Observable<any> {
    return this.api.post('/Auth/validateToken', {});
  }

  validateGithubCode(code: string): Observable<any> {
    return this.api.get(`/Auth/callback?code=${code}`);
  }

  initiateGithubLogin() {
    window.location.href = `${this.api.baseUrl}/GithubAuth/github`;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
