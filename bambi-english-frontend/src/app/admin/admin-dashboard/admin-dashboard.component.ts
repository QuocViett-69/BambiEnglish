import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  stats = signal({
    totalCourses: 0, activeCourses: 0, totalBranches: 0,
    totalTrials: 0, newTrials: 0, totalRegistrations: 0,
    successRegistrations: 0, revenue: 0,
  });
  loading = signal(true);
  recentRegistrations = signal<any[]>([]);
  recentTrials = signal<any[]>([]);

  // Chart data
  monthlyRevenue = signal<{ label: string; value: number; }[]>([]);
  paymentStatusData = signal<{ success: number; pending: number; failed: number; }>({ success: 0, pending: 0, failed: 0 });
  maxMonthlyRevenue = signal(1);

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    forkJoin({
      courses: this.http.get<any[]>(`${this.api}/courses/admin/all`),
      branches: this.http.get<any[]>(`${this.api}/branches`),
      trials: this.http.get<any[]>(`${this.api}/trials`),
      registrations: this.http.get<any[]>(`${this.api}/registrations/all`),
    }).subscribe({
      next: ({ courses, branches, trials, registrations }) => {
        const successRegs = registrations.filter(r => r.paymentStatus === 'SUCCESS');
        const revenue = successRegs.reduce((sum, r) => sum + (r.courseId?.price ?? 0), 0);
        this.stats.set({
          totalCourses: courses.length,
          activeCourses: courses.filter(c => c.status === 'active').length,
          totalBranches: branches.length,
          totalTrials: trials.length,
          newTrials: trials.filter((t: any) => t.status === 'Mới').length,
          totalRegistrations: registrations.length,
          successRegistrations: successRegs.length,
          revenue,
        });
        this.recentRegistrations.set(registrations.slice(0, 5));
        this.recentTrials.set(trials.slice(0, 5));
        this._buildCharts(registrations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private _buildCharts(registrations: any[]) {
    // Monthly revenue — last 6 months
    const now = new Date();
    const months: { label: string; value: number; }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `T${d.getMonth() + 1}`;
      const value = registrations
        .filter(r => r.paymentStatus === 'SUCCESS' && r.createdAt?.startsWith(key))
        .reduce((sum, r) => sum + (r.courseId?.price ?? 0), 0);
      months.push({ label, value });
    }
    this.monthlyRevenue.set(months);
    this.maxMonthlyRevenue.set(Math.max(...months.map(m => m.value), 1));

    // Payment status donut data
    this.paymentStatusData.set({
      success: registrations.filter(r => r.paymentStatus === 'SUCCESS').length,
      pending: registrations.filter(r => r.paymentStatus === 'PENDING').length,
      failed:  registrations.filter(r => r.paymentStatus === 'FAILED').length,
    });
  }

  get successRate(): number {
    const { success, pending, failed } = this.paymentStatusData();
    const total = success + pending + failed;
    return total === 0 ? 0 : Math.round((success / total) * 100);
  }

  barHeight(value: number): number {
    return Math.round((value / this.maxMonthlyRevenue()) * 100);
  }

  formatPrice(price: number) {
    if (price >= 1_000_000) return (price / 1_000_000).toFixed(1) + 'M';
    if (price >= 1_000) return (price / 1_000).toFixed(0) + 'K';
    return price.toString();
  }

  formatPriceFull(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('vi-VN');
  }

  statusClass(status: string) {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-700';
      case 'FAILED':  return 'bg-red-100 text-red-700';
      default:        return 'bg-yellow-100 text-yellow-700';
    }
  }

  statusLabel(status: string) {
    switch (status) {
      case 'SUCCESS': return 'Thành công';
      case 'FAILED':  return 'Thất bại';
      default:        return 'Chờ TT';
    }
  }

  logout() {
    localStorage.removeItem('bambi_admin_auth');
    localStorage.removeItem('bambi_admin_user');
    this.router.navigate(['/admin/login']);
  }
}
