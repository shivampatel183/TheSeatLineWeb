import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AuthService } from '../../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
})
export class GoogleLoginComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.authService.loginWithGoogle(user.idToken).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => console.error('Google Login Failed', err),
        });
      }
    });
  }
}
