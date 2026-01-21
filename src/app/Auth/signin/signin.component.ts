import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../common/components/toast/toast.component';
import { ToastService } from '../../common/Services/toast.service';
import { ApiResponse } from '../../common/components/model/authmodel';
import { UserMainEntity } from '../auth.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, ToastComponent],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class RegisterComponent {
  registerData = new UserMainEntity();
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
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
      error: (err) => this.toastService.error('Registration failed'),
    });
  }
}
