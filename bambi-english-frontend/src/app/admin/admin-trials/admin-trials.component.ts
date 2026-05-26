import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrialService } from '../../services/trial.service';

@Component({
  selector: 'app-admin-trials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-trials.component.html',
})
export class AdminTrialsComponent implements OnInit {
  trials = signal<any[]>([]);
  filtered = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';
  statusFilter = 'ALL';

  isModalOpen = false;
  editingTrial: any = null;

  constructor(private trialService: TrialService) {}

  ngOnInit() {
    this.loadTrials();
  }

  loadTrials() {
    this.loading.set(true);
    this.trialService.getAll().subscribe({
      next: (data) => {
        this.trials.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters() {
    let data = this.trials();
    if (this.statusFilter !== 'ALL') {
      data = data.filter(t => t.status === this.statusFilter);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      data = data.filter(t =>
        t.parentName?.toLowerCase().includes(q) ||
        t.phone?.includes(q) ||
        t.studentName?.toLowerCase().includes(q)
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

  get countByStatus() {
    return {
      all: this.trials().length,
      new: this.trials().filter(t => t.status === 'Mới').length,
      contacted: this.trials().filter(t => t.status === 'Đã liên hệ').length,
      done: this.trials().filter(t => t.status === 'Đã xong').length,
    };
  }

  openModal(trial: any) {
    this.editingTrial = { ...trial };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingTrial = null;
  }

  saveTrial() {
    this.trialService.update(this.editingTrial._id, {
      status: this.editingTrial.status,
      note: this.editingTrial.note
    }).subscribe(() => {
      this.closeModal();
      this.loadTrials();
    });
  }

  exportCSV() {
    const rows = [
      ['Ngày ĐK', 'Phụ huynh', 'Học viên', 'Tuổi', 'Số điện thoại', 'Email', 'Trạng thái', 'Ghi chú'],
      ...this.filtered().map(t => [
        t.createdAt ? new Date(t.createdAt).toLocaleDateString('vi-VN') : '',
        t.parentName ?? '',
        t.studentName ?? '',
        t.studentAge ?? '',
        t.phone ?? '',
        t.email ?? '',
        t.status ?? '',
        t.note ?? '',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dang-ky-hoc-thu-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
