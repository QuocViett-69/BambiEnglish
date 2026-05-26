import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  isSidebarOpen = true;
  newTrialsCount = signal(0);

  constructor(
    public toast: ToastService,
    public confirm: ConfirmService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadBadge();
    // Refresh badge mỗi 60 giây
    setInterval(() => this.loadBadge(), 60_000);
  }

  loadBadge() {
    this.http.get<any[]>('http://localhost:3000/api/trials').subscribe({
      next: (data) => {
        const count = data.filter(t => t.status === 'Mới').length;
        this.newTrialsCount.set(count);
      },
      error: () => {},
    });
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }

  logout() {
    localStorage.removeItem('bambi_admin_auth');
    localStorage.removeItem('bambi_admin_user');
    this.router.navigate(['/admin/login']);
  }
}
