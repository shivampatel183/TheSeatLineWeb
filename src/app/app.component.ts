import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './common/components/toast/toast.component';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { FooterComponent } from './Component/footer/footer.component';
import { AuthService } from './Auth/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastComponent,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'TheSeatLineWeb';

  constructor(public router: Router, private authService: AuthService) {}

  get isAuthRoute(): boolean {
    return (
      this.router.url.startsWith('/login') ||
      this.router.url.startsWith('/register')
    );
  }

  ngOnInit() {
    // Restore access token into session on load
    this.authService.initSession().subscribe();

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const existingVisitorCity = localStorage.getItem('visitorCity');
    if (existingVisitorCity) {
      return;
    }

    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.city === 'string' && data.city.trim().length > 0) {
          localStorage.setItem('visitorCity', data.city.trim());
        }
      })
      .catch(() => {
        // Ignore geolocation fetch errors and continue with manual city selection.
      });
  }
}
