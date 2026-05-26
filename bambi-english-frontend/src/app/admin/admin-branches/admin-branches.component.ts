import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-branches.component.html',
})
export class AdminBranchesComponent implements OnInit {
  branches = signal<any[]>([]);
  filtered = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';

  // Pagination
  currentPage = signal(1);
  readonly pageSize = 9;
  get totalPages() { return Math.ceil(this.filtered().length / this.pageSize); }
  get pagedBranches() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }
  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) this.currentPage.set(p);
  }

  // Branch modal
  isModalOpen = false;
  editingBranch: any = null;

  // Review list modal
  isReviewModalOpen = false;
  reviewBranch: any = null;

  // Review form modal
  isReviewFormOpen = false;
  editingReview: any = null;
  editingReviewIndex = -1;
  savingReview = signal(false);

  private api = 'http://localhost:3000/api';

  constructor(
    private branchService: BranchService,
    private http: HttpClient,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() { this.loadBranches(); }

  loadBranches() {
    this.loading.set(true);
    this.branchService.getAll().subscribe({
      next: (data) => {
        this.branches.set(data);
        this.applySearch();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(q: string) {
    this.searchQuery = q;
    this.currentPage.set(1);
    this.applySearch();
  }

  applySearch() {
    const q = this.searchQuery.trim().toLowerCase();
    this.filtered.set(q
      ? this.branches().filter(b =>
          b.name?.toLowerCase().includes(q) ||
          b.address?.toLowerCase().includes(q))
      : this.branches()
    );
  }

  // ─── Branch CRUD ────────────────────────────────────────────────────────────
  openModal(branch?: any) {
    this.editingBranch = branch
      ? { ...branch }
      : { name: '', address: '', phone: '', openingHours: '08:00 – 21:00', mapLink: '', imageUrl: '' };
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; this.editingBranch = null; }

  saveBranch() {
    if (this.editingBranch._id) {
      this.branchService.update(this.editingBranch._id, this.editingBranch).subscribe({
        next: () => { this.closeModal(); this.loadBranches(); this.toast.success('Cập nhật cơ sở thành công!'); },
        error: () => this.toast.error('Không thể cập nhật cơ sở'),
      });
    } else {
      this.branchService.create(this.editingBranch).subscribe({
        next: () => { this.closeModal(); this.loadBranches(); this.toast.success('Thêm cơ sở mới thành công!'); },
        error: () => this.toast.error('Không thể thêm cơ sở'),
      });
    }
  }

  async deleteBranch(id: string, name: string) {
    const ok = await this.confirm.open({
      title: 'Xóa cơ sở',
      message: `Bạn có chắc muốn xóa "${name}"? Tất cả đánh giá sẽ bị xóa theo.`,
      confirmText: 'Xóa',
    });
    if (!ok) return;
    this.branchService.delete(id).subscribe({
      next: () => { this.loadBranches(); this.toast.success('Đã xóa cơ sở!'); },
      error: () => this.toast.error('Không thể xóa cơ sở'),
    });
  }

  // ─── Review List Modal ──────────────────────────────────────────────────────
  openReviewModal(branch: any) {
    this.reviewBranch = this.branches().find(b => b._id === branch._id) ?? branch;
    this.isReviewModalOpen = true;
  }

  closeReviewModal() { this.isReviewModalOpen = false; this.reviewBranch = null; }

  // ─── Review Form ─────────────────────────────────────────────────────────────
  openAddReview() {
    this.editingReview = { author: '', rating: 5, comment: '', date: new Date().toISOString().slice(0, 10), avatar: '' };
    this.editingReviewIndex = -1;
    this.isReviewFormOpen = true;
  }

  openEditReview(review: any, index: number) {
    this.editingReview = { ...review };
    this.editingReviewIndex = index;
    this.isReviewFormOpen = true;
  }

  closeReviewForm() { this.isReviewFormOpen = false; this.editingReview = null; this.editingReviewIndex = -1; }

  saveReview() {
    if (!this.reviewBranch) return;
    this.savingReview.set(true);
    const branchId = this.reviewBranch._id;
    const req$ = this.editingReviewIndex === -1
      ? this.http.post<any>(`${this.api}/branches/${branchId}/reviews`, this.editingReview)
      : this.http.patch<any>(`${this.api}/branches/${branchId}/reviews/${this.editingReviewIndex}`, this.editingReview);

    req$.subscribe({
      next: (updated) => {
        this.branches.update(list => list.map(b => b._id === branchId ? updated : b));
        this.reviewBranch = updated;
        this.savingReview.set(false);
        this.closeReviewForm();
        this.toast.success(this.editingReviewIndex === -1 ? 'Đã thêm đánh giá!' : 'Đã cập nhật đánh giá!');
      },
      error: () => { this.savingReview.set(false); this.toast.error('Không thể lưu đánh giá'); },
    });
  }

  async deleteReview(index: number) {
    const ok = await this.confirm.open({
      title: 'Xóa đánh giá',
      message: 'Bạn có chắc muốn xóa đánh giá này?',
      confirmText: 'Xóa',
    });
    if (!ok) return;
    const branchId = this.reviewBranch._id;
    this.http.delete<any>(`${this.api}/branches/${branchId}/reviews/${index}`).subscribe({
      next: (updated) => {
        this.branches.update(list => list.map(b => b._id === branchId ? updated : b));
        this.reviewBranch = updated;
        this.toast.success('Đã xóa đánh giá!');
      },
      error: () => this.toast.error('Không thể xóa đánh giá'),
    });
  }

  setRating(star: number) { if (this.editingReview) this.editingReview.rating = star; }

  // ─── Rating helpers ─────────────────────────────────────────────────────────
  getAverageRating(reviews: any[]): number {
    if (!reviews?.length) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }

  getStars(rating: number): number[] { return [1, 2, 3, 4, 5]; }
  isFullStar(i: number, r: number) { return i <= Math.floor(r); }
  isHalfStar(i: number, r: number) { return i === Math.ceil(r) && r % 1 >= 0.5; }
}
