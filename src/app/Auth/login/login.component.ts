import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/components/model/authmodel';
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
    private toast: ToastService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/']);
    }
  }

  getFieldValue(field: LoginFieldConfig): string {
    return this.loginData[field.key];
  }

  setFieldValue(field: LoginFieldConfig, value: string): void {
    this.loginData[field.key] = value;
  }

  onLogin() {
    debugger;
    this.authService.login(this.loginData).subscribe({
      next: (response: ApiResponse<ResponseEntity>) => {
        if (!response.success) {
          this.toast.error(response.error || 'Login failed');
          return;
        } else {
          this.toast.success(
            response.message || 'Login Successful! Redirecting...',
          );
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.toast.error('Server error. Please try again later.');
      },
    });
  }
}
