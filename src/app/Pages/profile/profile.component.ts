import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../common/Services/user.service';
import { AuthService } from '../../Auth/auth.service';
import { ToastService } from '../../common/Services/toast.service';
import {
  User,
  UpdateUserProfileRequest,
  ChangePasswordRequest,
} from '../../common/model/master.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isEditMode = false;
  isChangingPassword = false;
  isLoading = false;

  editData: UpdateUserProfileRequest = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  };

  passwordData: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user = response.data;
          this.populateEditData();
        } else {
          this.toast.error('Failed to load profile');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Error loading profile');
        this.isLoading = false;
      },
    });
  }

  populateEditData(): void {
    if (this.user) {
      this.editData = {
        fullName: this.user.fullName,
        phone: this.user.phone || '',
        address: this.user.address || '',
        city: this.user.city || '',
        state: this.user.state || '',
        zipCode: this.user.zipCode || '',
      };
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.populateEditData();
    }
  }

  saveProfile(): void {
    this.isLoading = true;
    this.userService.updateUserProfile(this.editData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user = response.data;
          this.isEditMode = false;
          this.toast.success('Profile updated successfully');
          localStorage.setItem('UserName', this.user.fullName);
        } else {
          this.toast.error('Failed to update profile');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Error updating profile');
        this.isLoading = false;
      },
    });
  }

  togglePasswordChange(): void {
    this.isChangingPassword = !this.isChangingPassword;
    if (!this.isChangingPassword) {
      this.resetPasswordForm();
    }
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toast.error('Passwords do not match');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.toast.error('Password must be at least 6 characters');
      return;
    }

    this.isLoading = true;
    this.userService.changePassword(this.passwordData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success('Password changed successfully');
          this.isChangingPassword = false;
          this.resetPasswordForm();
        } else {
          this.toast.error(response.error || 'Failed to change password');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Error changing password');
        this.isLoading = false;
      },
    });
  }

  resetPasswordForm(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  logout(): void {
    this.authService.logout();
  }

  getInitials(): string {
    if (!this.user) return 'U';
    const names = this.user.fullName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return this.user.fullName.substring(0, 2);
  }
}
