import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-courses.component.html',
})
export class AdminCoursesComponent implements OnInit {
  courses = signal<Course[]>([]);
  filtered = signal<Course[]>([]);
  loading = signal(true);
  searchQuery = '';
  statusFilter = 'ALL';

  isModalOpen = false;
  editingCourse: any = null;

  constructor(
    private courseService: CourseService,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() { this.loadCourses(); }

  loadCourses() {
    this.loading.set(true);
    this.courseService.getAllAdmin().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters() {
    let data = this.courses();
    if (this.statusFilter !== 'ALL') {
      data = data.filter(c => c.status === this.statusFilter);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      data = data.filter(c =>
        (c.title ?? '').toLowerCase().includes(q) ||
        ((c as any).shortDescription ?? '').toLowerCase().includes(q)
      );
    }
    this.filtered.set(data);
  }

  onSearch(q: string) { this.searchQuery = q; this.applyFilters(); }
  onStatusFilter(s: string) { this.statusFilter = s; this.applyFilters(); }

  get countByStatus() {
    return {
      all: this.courses().length,
      active: this.courses().filter(c => c.status === 'active').length,
      hidden: this.courses().filter(c => c.status === 'hidden').length,
    };
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  openModal(course?: Course) {
    this.editingCourse = course
      ? { ...course }
      : { title: '', shortDescription: '', price: 0, imageUrl: '', status: 'active' };
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; this.editingCourse = null; }

  saveCourse() {
    const { _id, ...dto } = this.editingCourse;
    if (_id) {
      this.courseService.update(_id, dto).subscribe({
        next: () => { this.closeModal(); this.loadCourses(); this.toast.success('Cập nhật khóa học thành công!'); },
        error: (err) => this.toast.error('Lỗi: ' + (err?.error?.message ?? 'Không thể cập nhật')),
      });
    } else {
      this.courseService.create(dto).subscribe({
        next: () => { this.closeModal(); this.loadCourses(); this.toast.success('Thêm khóa học mới thành công!'); },
        error: (err) => this.toast.error('Lỗi: ' + (err?.error?.message ?? 'Không thể tạo khóa học')),
      });
    }
  }

  async deleteCourse(id: string, title: string) {
    const ok = await this.confirm.open({
      title: 'Xóa khóa học',
      message: `Bạn có chắc muốn xóa "${title}"? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa',
      danger: true,
    });
    if (!ok) return;
    this.courseService.delete(id).subscribe({
      next: () => { this.loadCourses(); this.toast.success('Đã xóa khóa học!'); },
      error: (err) => this.toast.error('Lỗi xóa: ' + (err?.error?.message ?? '')),
    });
  }

  toggleStatus(course: Course) {
    const newStatus = course.status === 'active' ? 'hidden' : 'active';
    const label = newStatus === 'active' ? 'hiển thị' : 'ẩn';
    this.courseService.update((course as any)._id, { status: newStatus }).subscribe({
      next: () => { this.loadCourses(); this.toast.info(`Đã ${label} khóa học`); },
      error: (err) => this.toast.error('Lỗi: ' + (err?.error?.message ?? '')),
    });
  }
}
