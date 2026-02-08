import { NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  get userName(): string {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return 'Profile';
    }

    try {
      const parsedUser = JSON.parse(rawUser) as { fullName?: string; email?: string };
      return parsedUser.fullName || parsedUser.email || 'Profile';
    } catch {
      return 'Profile';
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
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
}
