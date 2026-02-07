import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/components/model/authmodel';
import { RegisterEntity } from '../auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class RegisterComponent {
  registerData = new RegisterEntity();
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: (response: ApiResponse<string>) => {
        if (!response.success) {
          this.toastService.error(response.error || 'Registration failed');
          return;
        }
        this.toastService.success('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: () => this.toastService.error('Registration failed'),
    });
  }
}
