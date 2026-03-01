import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/model/api.model';
import { RegisterEntity } from '../auth.model';
import { HttpErrorResponse } from '@angular/common/http';

type RegisterFieldKey =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'confirmPassword';

interface RegisterFieldConfig {
  key: RegisterFieldKey;
  name: RegisterFieldKey;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  autocomplete: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class RegisterComponent {
  registerData = new RegisterEntity();
  termsAccepted = false;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  readonly registerFields: RegisterFieldConfig[] = [
    {
      key: 'firstName',
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Your Name',
      autocomplete: 'name',
    },
    {
      key: 'lastName',
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Your Last Name',
      autocomplete: 'name',
    },
    {
      key: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'user@example.com',
      autocomplete: 'email',
    },
    {
      key: 'password',
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'SecurePass@123',
      autocomplete: 'new-password',
    },
    {
      key: 'confirmPassword',
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'SecurePass@123',
      autocomplete: 'new-password',
    },
  ];
  readonly marketingBenefits: string[] = [
    'Instant bookings with no waiting',
    'Access exclusive member-only events',
    'Get early bird discounts on upcoming shows',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  getFieldValue(field: RegisterFieldConfig): string {
    return this.registerData[field.key];
  }

  setFieldValue(field: RegisterFieldConfig, value: string): void {
    this.registerData[field.key] = value;
  }

  getInputType(field: RegisterFieldConfig): string {
    if (field.key === 'password') {
      return this.showPassword ? 'text' : 'password';
    }

    if (field.key === 'confirmPassword') {
      return this.showConfirmPassword ? 'text' : 'password';
    }

    return field.type;
  }

  togglePasswordVisibility(field: RegisterFieldKey): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    }

    if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      registerForm.control.markAllAsTouched();
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    const payload: RegisterEntity = {
      ...this.registerData,
      phoneNumber: this.registerData.phoneNumber?.trim() || null,
    };

    this.isSubmitting = true;
    this.authService.register(payload).subscribe({
      next: (response: ApiResponse<string>) => {
        this.isSubmitting = false;
        const isSuccess =
          response.Success ?? response.success ?? response.isSuccess ?? false;
        if (!isSuccess) {
          this.toastService.error(response.message || 'Registration failed');
          return;
        }
        this.toastService.success(
          response.message || 'User registered. Verification email sent.',
        );
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        const apiErrorCode = error.error?.error;

        if (error.status === 400 || apiErrorCode === 'VAL_001') {
          this.toastService.error(
            'Validation failed. Please check your input.',
          );
          return;
        }

        if (error.status === 409 || apiErrorCode === 'AUTH_002') {
          this.toastService.error('Email already registered.');
          return;
        }

        if (error.status === 429) {
          this.toastService.error(
            'Too many attempts. Try again in 15 minutes.',
          );
          return;
        }

        this.toastService.error('Registration failed');
      },
    });
  }
}
