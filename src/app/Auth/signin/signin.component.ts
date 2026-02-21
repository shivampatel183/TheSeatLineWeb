import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/components/model/authmodel';
import { RegisterEntity } from '../auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class RegisterComponent {
  registerData = new RegisterEntity();
  isSubmitting = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.registerData).subscribe({
      next: (response: ApiResponse<string>) => {
        this.isSubmitting = false;
        if (!response.success) {
          this.toastService.error(response.error || 'Registration failed');
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
          this.toastService.error('Validation failed. Please check your input.');
          return;
        }

        if (error.status === 409 || apiErrorCode === 'AUTH_002') {
          this.toastService.error('Email already registered.');
          return;
        }

        if (error.status === 429) {
          this.toastService.error('Too many attempts. Try again in 15 minutes.');
          return;
        }

        this.toastService.error('Registration failed');
      },
    });
  }
}
