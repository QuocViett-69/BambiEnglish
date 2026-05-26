import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-admin-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-branches.component.html',
})
export class AdminBranchesComponent implements OnInit {
  branches = signal<any[]>([]);
  loading = signal(true);

  isModalOpen = false;
  editingBranch: any = null;

  isReviewModalOpen = false;
  reviewBranch: any = null;

  constructor(private branchService: BranchService) {}

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.loading.set(true);
    this.branchService.getAll().subscribe({
      next: (data) => { this.branches.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

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
      this.branchService.delete(id).subscribe(() => {
        this.loadBranches();
      });
    }
  }

  openReviewModal(branch: any) {
    this.reviewBranch = branch;
    this.isReviewModalOpen = true;
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.reviewBranch = null;
  }

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
