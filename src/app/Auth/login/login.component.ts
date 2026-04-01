import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/model/api.model';
import { LoginEntity, ResponseEntity } from '../auth.model';
import { GoogleLoginComponent } from '../../Component/google-login/google-login.component';

type LoginFieldKey = 'email' | 'password';

interface LoginFieldConfig {
  key: LoginFieldKey;
  name: LoginFieldKey;
  label: string;
  type: 'email' | 'password';
  placeholder: string;
  autocomplete: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleLoginComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = new LoginEntity();
  isSubmitting = false;
  showPassword = false;
  returnUrl: string = '/';
  readonly accountBenefits: string[] = [
    'Track bookings, invoices, and event history in one place.',
    'Keep your city preferences and alerts synced across devices.',
    'Check out faster with your saved account details.',
  ];
  readonly loginFields: LoginFieldConfig[] = [
    {
      key: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@example.com',
      autocomplete: 'email',
    },
    {
      key: 'password',
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '********',
      autocomplete: 'current-password',
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  getFieldValue(field: LoginFieldConfig): string {
    return this.loginData[field.key];
  }

  setFieldValue(field: LoginFieldConfig, value: string): void {
    this.loginData[field.key] = value;
  }

  getInputType(field: LoginFieldConfig): string {
    if (field.key === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return field.type;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      loginForm.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.loginData).subscribe({
      next: (response: ApiResponse<ResponseEntity>) => {
        this.isSubmitting = false;
        const isSuccess = response.success ?? false;
        if (!isSuccess) {
          this.toast.error(response.message || 'Login failed');
          return;
        } else {
          this.toast.success(
            response.message || 'Login Successful! Redirecting...',
          );
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.toast.error('Server error. Please try again later.');
      },
    });
  }
}
