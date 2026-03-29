import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../common/Services/toast.service';
import { AuthService } from '../../Auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private authService: AuthService,
    private ToastService: ToastService,
  ) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse,
      use_fedcm_for_prompt: true,
      auto_select: false,
    });

    const googleBtnElement = document.getElementById('googleBtn');
    if (googleBtnElement) {
      const isMobile = window.innerWidth < 640;
      google.accounts.id.renderButton(googleBtnElement, {
        theme: 'outline',
        size: 'large',
        width: isMobile ? 320 : 280, // Google only accepts pixel numbers, not percentages
      });
    }
  }

  handleCredentialResponse = (response: any) => {
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (res) => {
        const isSuccess = res.success ?? false;
        if (isSuccess) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.ToastService.success('Google login successful');
          this.router.navigateByUrl(returnUrl);
        } else {
          this.ToastService.error(
            res.error || res.message || 'Google login failed',
          );
        }
      },
      error: () => {
        this.ToastService.error('Server error during Google login');
      },
    });
  };
}
