import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit {
  branches = signal<any[]>([]);
  filtered = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';

  isReviewModalOpen = false;
  reviewBranch: any = null;

  constructor(private branchService: BranchService) {}

  ngOnInit() {
    this.branchService.getAll().subscribe({
      next: (data) => {
        this.branches.set(data);
        this.filtered.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filtered.set(this.branches());
    } else {
      this.filtered.set(
        this.branches().filter(
          (b) =>
            b.name?.toLowerCase().includes(q) ||
            b.address?.toLowerCase().includes(q)
        )
      );
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

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isFullStar(index: number, rating: number): boolean {
    return index <= Math.floor(rating);
  }

  isHalfStar(index: number, rating: number): boolean {
    return index === Math.ceil(rating) && rating % 1 >= 0.5;
  }
}
