import { Component, OnInit } from '@angular/core';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-login',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  template: `<asl-google-signin-button
    type="standard"
    size="large"
  ></asl-google-signin-button>`,
})
export class GoogleLoginComponent implements OnInit {
  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    // This observable fires as soon as the user finishes the Google Popup
    this.authService.authState.subscribe((user: any) => {
      if (user) {
        this.loginWithBackend(user.idToken);
      }
    });
  }

  loginWithBackend(idToken: string) {
    // Call your .NET AuthController
    this.http
      .post<any>('https://localhost:7243/api/auth/google-login', { idToken })
      .subscribe({
        next: (res) => {
          if (res.success) {
            // Store tokens in LocalStorage
            localStorage.setItem('accessToken', res.data.token);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.data));

            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => console.error('Backend Login Failed', err),
      });
  }
}
