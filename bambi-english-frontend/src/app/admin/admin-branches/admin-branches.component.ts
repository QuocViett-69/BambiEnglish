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
    this.editingBranch = branch ? { ...branch } : { name: '', address: '', phone: '', openingHours: '08:00 - 21:00', mapLink: '' };
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
}
