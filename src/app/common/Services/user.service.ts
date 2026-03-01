import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.services';
import { ApiResponse } from '../model/api.model';
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
    return this.apiService.get<User>('/Auth/profile');
  }

  // Update user profile
  updateUserProfile(
    data: UpdateUserProfileRequest,
  ): Observable<ApiResponse<User>> {
    return this.apiService.put<User>('/Auth/profile', data);
  }


}
