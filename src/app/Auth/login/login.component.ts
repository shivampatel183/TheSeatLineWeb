import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/components/model/authmodel';
import { LoginEntity } from '../auth.model';
import { GoogleLoginComponent } from '../../Component/google-login/google-login.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleLoginComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = new LoginEntity();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/']);
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
            response.message || 'Login Successful! Redirecting...',
          );
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('UserName', response.data.fullName);
          localStorage.setItem('UserEmail', response.data.email);
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.toast.error('Server error. Please try again later.');
      },
    });
  }
}
