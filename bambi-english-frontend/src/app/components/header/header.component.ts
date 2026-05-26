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
    { label: 'Trang chủ',    route: '/',               icon: 'home' },
    { label: 'Địa điểm',     route: '/dia-diem',        icon: 'location_on' },
    { label: 'Thông tin',    route: '/thong-tin',       icon: 'info' },
    { label: 'CSVC',         route: '/co-so-vat-chat',  icon: 'school' },
    { label: 'Đăng ký',      route: '/lien-he',         icon: 'assignment' },
  ];

  mobileMenuOpen = false;
  toggleMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
}
