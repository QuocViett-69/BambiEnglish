import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
    totalCourses: 0,
    activeCourses: 0,
    totalBranches: 0,
    totalTrials: 0,
    newTrials: 0,
    totalRegistrations: 0,
    successRegistrations: 0,
    revenue: 0,
  });
  loading = signal(true);
  recentRegistrations = signal<any[]>([]);
  recentTrials = signal<any[]>([]);

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

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
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatPrice(price: number) {
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
}
