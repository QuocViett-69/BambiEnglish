import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  navItems = [
    { label: 'Trang chủ',    route: '/',               icon: '🏠' },
    { label: 'Địa điểm',     route: '/dia-diem',        icon: '📍' },
    { label: 'Thông tin',    route: '/thong-tin',       icon: 'ℹ️' },
    { label: 'CSVC',         route: '/co-so-vat-chat',  icon: '🎓' },
    { label: 'Đăng ký',      route: '/dang-ky',         icon: '📋' },
  ];

  mobileMenuOpen = false;
  toggleMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
}
