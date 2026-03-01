import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseUrl = 'https://localhost:7243/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<ApiResponse<T>>(url, { headers: this.getHeaders() });
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url, {
      headers: this.getHeaders(),
    });
  }
}
