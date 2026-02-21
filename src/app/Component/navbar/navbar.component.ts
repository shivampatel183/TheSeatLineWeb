import { NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnDestroy {
  isMobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  get userName(): string {
    const rawUser = localStorage.getItem('accessToken');
    if (!rawUser) {
      return 'Profile';
    }

    try {
      var UserName = localStorage.getItem('UserName');
      var UserEmail = localStorage.getItem('UserEmail');
      return UserName || UserEmail || 'Profile';
    } catch {
      return 'Profile';
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.setBodyScrollLock(this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.setBodyScrollLock(false);
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMobileMenu();
  }

  logout() {
    this.authService.logout();
    this.closeMobileMenu();
  }

  ngOnDestroy() {
    this.setBodyScrollLock(false);
  }

  private setBodyScrollLock(locked: boolean) {
    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
