import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
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

  get fullName(): string {
    if (!this.user) return 'User';
    return `${this.user.firstName} ${this.user.lastName}`.trim() || 'User';
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        if (response.Success && response.data) {
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
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber || '',
        dateOfBirth: this.toDateInputValue(this.user.dateOfBirth),
      };
    }
  }

  private toDateInputValue(dateString?: string): string {
    if (!dateString) {
      return '';
    }

    // If API sends ISO datetime (e.g., 2026-02-10T00:00:00), keep only date part for <input type="date">.
    const isoDateMatch = dateString.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoDateMatch) {
      return isoDateMatch[0];
    }

    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return parsed.toISOString().split('T')[0];
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.populateEditData();
    }
  }

  saveProfile(profileForm: NgForm): void {
    if (profileForm.invalid) {
      profileForm.control.markAllAsTouched();
      return;
    }

    const payload: UpdateUserProfileRequest = {
      firstName: this.editData.firstName.trim(),
      lastName: this.editData.lastName.trim(),
      dateOfBirth: this.editData.dateOfBirth || undefined,
      phoneNumber: this.editData.phoneNumber?.trim() || undefined,
    };

    this.isLoading = true;
    this.userService.updateUserProfile(payload).subscribe({
      next: (response) => {
        if (response.Success && response.data) {
          this.user = response.data;
          this.isEditMode = false;
          this.toast.success('Profile updated successfully');
          localStorage.setItem(
            'UserName',
            `${this.user.firstName} ${this.user.lastName}`.trim(),
          );
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

  logout(): void {
    this.authService.logout();
  }

  getInitials(): string {
    if (!this.user) return 'U';
    const first = this.user.firstName?.[0] || '';
    const last = this.user.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }
}
