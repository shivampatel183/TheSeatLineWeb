import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../common/Services/toast.service';
import { AuthService } from '../../Auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-google-login',
  standalone: true,
  templateUrl: './google-login.component.html',
})
export class GoogleLoginComponent implements OnInit {
  [x: string]: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private ToastService: ToastService,
  ) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      // 2. Use the environment variable here
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse,
    });

    const googleBtnElement = document.getElementById('googleBtn');
    if (googleBtnElement) {
      const isMobile = window.innerWidth < 640;
      google.accounts.id.renderButton(googleBtnElement, {
        theme: 'outline',
        size: isMobile ? 'large' : 'large',
        width: isMobile ? '100%' : '280',
      });
    }
  }

  handleCredentialResponse = (response: any) => {
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (res) => {
        if (res.success) {
          this.ToastService.success('Google login successful');
          this.router.navigate(['/']);
        } else {
          this.ToastService.error(res.error || 'Google login failed');
        }
      },
      error: () => {
        this.ToastService.error('Server error during Google login');
      },
    });
  };
}
