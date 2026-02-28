export interface City {
  id: number;
  name: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
