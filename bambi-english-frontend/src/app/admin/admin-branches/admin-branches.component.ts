import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-branches.component.html',
})
export class AdminBranchesComponent implements OnInit {
  branches = signal<any[]>([]);
  loading = signal(true);

  // Branch modal
  isModalOpen = false;
  editingBranch: any = null;

  // Review list modal (view + manage)
  isReviewModalOpen = false;
  reviewBranch: any = null;

  // Review form modal (add / edit)
  isReviewFormOpen = false;
  editingReview: any = null;
  editingReviewIndex: number = -1;
  savingReview = signal(false);

  private api = 'http://localhost:3000/api';

  constructor(private branchService: BranchService, private http: HttpClient) {}

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.loading.set(true);
    this.branchService.getAll().subscribe({
      next: (data) => { this.branches.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  // ─── Branch CRUD ────────────────────────────────────────────────────────────
  openModal(branch?: any) {
    this.editingBranch = branch
      ? { ...branch }
      : { name: '', address: '', phone: '', openingHours: '08:00 – 21:00', mapLink: '', imageUrl: '' };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingBranch = null;
  }

  saveBranch() {
    if (this.editingBranch._id) {
      this.branchService.update(this.editingBranch._id, this.editingBranch).subscribe(() => {
        this.closeModal();
        this.loadBranches();
      });
    } else {
      this.branchService.create(this.editingBranch).subscribe(() => {
        this.closeModal();
        this.loadBranches();
      });
    }
  }

  deleteBranch(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa cơ sở này?')) {
      this.branchService.delete(id).subscribe(() => this.loadBranches());
    }
  }

  // ─── Review List Modal ──────────────────────────────────────────────────────
  openReviewModal(branch: any) {
    // Đồng bộ lại dữ liệu branch mới nhất từ danh sách
    this.reviewBranch = this.branches().find(b => b._id === branch._id) ?? branch;
    this.isReviewModalOpen = true;
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.reviewBranch = null;
  }

  // ─── Review Form (Add / Edit) ───────────────────────────────────────────────
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

  closeReviewForm() {
    this.isReviewFormOpen = false;
    this.editingReview = null;
    this.editingReviewIndex = -1;
  }

  saveReview() {
    if (!this.reviewBranch) return;
    this.savingReview.set(true);
    const branchId = this.reviewBranch._id;

    const request$ = this.editingReviewIndex === -1
      ? this.http.post<any>(`${this.api}/branches/${branchId}/reviews`, this.editingReview)
      : this.http.patch<any>(`${this.api}/branches/${branchId}/reviews/${this.editingReviewIndex}`, this.editingReview);

    request$.subscribe({
      next: (updatedBranch) => {
        // Cập nhật local state
        this.branches.update(list =>
          list.map(b => b._id === branchId ? updatedBranch : b)
        );
        this.reviewBranch = updatedBranch;
        this.savingReview.set(false);
        this.closeReviewForm();
      },
      error: () => this.savingReview.set(false),
    });
  }

  deleteReview(index: number) {
    if (!confirm('Xóa đánh giá này?')) return;
    const branchId = this.reviewBranch._id;
    this.http.delete<any>(`${this.api}/branches/${branchId}/reviews/${index}`).subscribe({
      next: (updatedBranch) => {
        this.branches.update(list =>
          list.map(b => b._id === branchId ? updatedBranch : b)
        );
        this.reviewBranch = updatedBranch;
      },
    });
  }

  setRating(star: number) {
    if (this.editingReview) this.editingReview.rating = star;
  }

  // ─── Rating helpers ─────────────────────────────────────────────────────────
  getAverageRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  isFullStar(index: number, rating: number): boolean {
    return index <= Math.floor(rating);
  }

  isHalfStar(index: number, rating: number): boolean {
    return index === Math.ceil(rating) && rating % 1 >= 0.5;
  }
}
