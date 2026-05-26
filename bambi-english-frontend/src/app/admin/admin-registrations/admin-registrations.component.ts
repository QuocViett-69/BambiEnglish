import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-registrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-registrations.component.html',
})
export class AdminRegistrationsComponent implements OnInit {
  registrations = signal<any[]>([]);
  filtered = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';
  statusFilter = 'ALL';

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.http.get<any[]>(`${this.api}/registrations/all`).subscribe({
      next: (data) => {
        this.registrations.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters() {
    let data = this.registrations();
    if (this.statusFilter !== 'ALL') {
      data = data.filter(r => r.paymentStatus === this.statusFilter);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      data = data.filter(r =>
        r.studentName?.toLowerCase().includes(q) ||
        r.parentPhone?.includes(q) ||
        r.orderId?.toLowerCase().includes(q) ||
        r.courseId?.title?.toLowerCase().includes(q)
      );
    }
    this.filtered.set(data);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onStatusFilter(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  get totalRevenue(): number {
    return this.registrations()
      .filter(r => r.paymentStatus === 'SUCCESS')
      .reduce((sum, r) => sum + (r.courseId?.price ?? 0), 0);
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  formatPriceFull(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  formatDate(date: string) {
    if (!date) return '–';
    return new Date(date).toLocaleString('vi-VN');
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
      default:        return 'Chờ thanh toán';
    }
  }

  methodLabel(method: string) {
    return method === 'momo' ? 'MoMo' : method === 'vnpay' ? 'VNPay' : method;
  }

  exportCSV() {
    const rows = [
      ['Ngày ĐK', 'Học viên', 'SĐT Phụ huynh', 'Khóa học', 'Học phí', 'PT Thanh toán', 'Trạng thái', 'Mã giao dịch'],
      ...this.filtered().map(r => [
        r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : '',
        r.studentName ?? '',
        r.parentPhone ?? '',
        r.courseId?.title ?? '',
        r.courseId?.price ?? 0,
        this.methodLabel(r.paymentMethod),
        this.statusLabel(r.paymentStatus),
        r.momoTransId ?? r.vnpayTransId ?? r.orderId ?? '',
      ]),
    ];
    const csv = rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `don-dang-ky-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportPDF() {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    const rows = this.filtered().map((r, i) => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px 12px;color:#666;font-size:12px;">${i + 1}</td>
        <td style="padding:8px 12px;">
          <strong>${r.studentName ?? ''}</strong><br>
          <span style="font-size:11px;color:#888;">${r.parentPhone ?? ''}</span>
        </td>
        <td style="padding:8px 12px;font-size:12px;">${r.courseId?.title ?? '–'}</td>
        <td style="padding:8px 12px;font-weight:bold;color:#ff6b35;">${this.formatPriceFull(r.courseId?.price ?? 0)}</td>
        <td style="padding:8px 12px;">
          <span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:bold;background:${r.paymentStatus === 'SUCCESS' ? '#dcfce7' : r.paymentStatus === 'FAILED' ? '#fee2e2' : '#fef9c3'};color:${r.paymentStatus === 'SUCCESS' ? '#15803d' : r.paymentStatus === 'FAILED' ? '#b91c1c' : '#a16207'}">
            ${this.statusLabel(r.paymentStatus)}
          </span>
        </td>
        <td style="padding:8px 12px;font-size:11px;color:#888;">${r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}</td>
      </tr>`);
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="UTF-8"><title>Báo cáo đơn đăng ký</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
        h1 { color: #ff6b35; font-size: 22px; margin-bottom: 4px; }
        p { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f9fafb; }
        th { padding: 10px 12px; text-align: left; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: .05em; }
        @media print { body { padding: 0; } }
      </style></head><body>
      <h1>🐼 Bambi English — Báo cáo Đăng ký</h1>
      <p>Xuất ngày: ${new Date().toLocaleString('vi-VN')} — Tổng: ${this.filtered().length} đơn</p>
      <table>
        <thead><tr><th>#</th><th>Học viên</th><th>Khóa học</th><th>Học phí</th><th>Trạng thái</th><th>Ngày ĐK</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
      <script>window.print(); window.close();<\/script>
      </body></html>`);
    printWindow.document.close();
  }
}
