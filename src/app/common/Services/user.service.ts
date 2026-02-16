import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.services';
import { ApiResponse } from '../components/model/authmodel';
import {
  User,
  UpdateUserProfileRequest,
  ChangePasswordRequest,
} from '../model/master.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  // Get current user profile
  getUserProfile(): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>('/User/profile');
  }

  // Update user profile
  updateUserProfile(
    data: UpdateUserProfileRequest,
  ): Observable<ApiResponse<User>> {
    return this.apiService.put<ApiResponse<User>>('/User/profile', data);
  }

  // Change password
  changePassword(
    data: ChangePasswordRequest,
  ): Observable<ApiResponse<string>> {
    return this.apiService.post<ApiResponse<string>>(
      '/User/change-password',
      data,
    );
  }

  // Upload profile image
  uploadProfileImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post<ApiResponse<string>>(
      '/User/upload-profile-image',
      formData,
    );
  }
}
