import { NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isNavbarVisible = true;
  private lastScrollTop = 0;
  private readonly scrollDelta = 10;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.lastScrollTop = this.getScrollTop();
  }

  get userName(): string {
    const user = this.authService.currentUser();
    if (!user) {
      return 'Profile';
    }
    return user.firstName || user.email || 'Profile';
  }


  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isNavbarVisible = true;
    }
    this.setBodyScrollLock(this.isMobileMenuOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.setBodyScrollLock(false);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isMobileMenuOpen) {
      return;
    }

    const currentScrollTop = this.getScrollTop();
    const scrollDifference = currentScrollTop - this.lastScrollTop;

    if (currentScrollTop <= 0) {
      this.isNavbarVisible = true;
      this.lastScrollTop = 0;
      return;
    }

    if (Math.abs(scrollDifference) < this.scrollDelta) {
      return;
    }

    this.isNavbarVisible = scrollDifference < 0;
    this.lastScrollTop = currentScrollTop;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  private setBodyScrollLock(locked: boolean): void {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  private getScrollTop(): number {
    return Math.max(window.scrollY || document.documentElement.scrollTop || 0, 0);
  }
}

