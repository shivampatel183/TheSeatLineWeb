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
    return this.apiService.get<ApiResponse<User>>('/Auth/profile');
  }

  // Update user profile
  updateUserProfile(
    data: UpdateUserProfileRequest,
  ): Observable<ApiResponse<User>> {
    return this.apiService.put<ApiResponse<User>>('/Auth/profile', data);
  }


}
