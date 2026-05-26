import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = signal('');
  loading = signal(false);

  // Credentials (hardcoded — thay bằng API thật khi cần)
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'bambi2024';

  constructor(private router: Router) {}

  login() {
    this.error.set('');
    if (!this.username || !this.password) {
      this.error.set('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    this.loading.set(true);
    // Simulate network delay
    setTimeout(() => {
      if (this.username === this.ADMIN_USER && this.password === this.ADMIN_PASS) {
        localStorage.setItem('bambi_admin_auth', 'true');
        localStorage.setItem('bambi_admin_user', this.username);
        this.router.navigate(['/admin']);
      } else {
        this.error.set('Tên đăng nhập hoặc mật khẩu không đúng.');
        this.loading.set(false);
      }
    }, 600);
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.login();
  }
}
