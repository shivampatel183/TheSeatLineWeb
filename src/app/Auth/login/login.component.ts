import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/components/model/authmodel';
import { LoginEntity, UserMainEntity } from '../auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = new UserMainEntity();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response: ApiResponse<LoginEntity>) => {
        if (!response.success) {
          this.toast.error(response.error || 'Login failed');
          return;
        } else {
          this.toast.success(
            response.message || 'Login Successful! Redirecting...'
          );
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('UserName', response.data.displayName);
          localStorage.setItem('UserEmail', response.data.email);
          localStorage.setItem('AvatarUrl', response.data.avatarUrl);
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.toast.error('Server error. Please try again later.');
      },
    });
  }

  connectGithub() {
    this.authService.initiateGithubLogin();
  }
}
