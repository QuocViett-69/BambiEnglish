import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-courses.component.html',
})
export class AdminCoursesComponent implements OnInit {
  courses = signal<Course[]>([]);
  loading = signal(true);
  
  isModalOpen = false;
  editingCourse: any = null;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    // Admin lấy tất cả (kể cả hidden)
    this.courseService.getAllAdmin().subscribe({
      next: (data) => { this.courses.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
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

  closeModal() {
    this.isModalOpen = false;
    this.editingCourse = null;
  }

  saveCourse() {
    const { _id, ...dto } = this.editingCourse;
    if (_id) {
      // Cập nhật
      this.courseService.update(_id, dto).subscribe({
        next: () => { this.closeModal(); this.loadCourses(); },
        error: (err) => alert('Lỗi cập nhật: ' + (err?.error?.message ?? err.message))
      });
    } else {
      // Tạo mới
      this.courseService.create(dto).subscribe({
        next: () => { this.closeModal(); this.loadCourses(); },
        error: (err) => alert('Lỗi tạo khóa học: ' + (err?.error?.message ?? err.message))
      });
    }
  }

  deleteCourse(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      this.courseService.delete(id).subscribe({
        next: () => this.loadCourses(),
        error: (err) => alert('Lỗi xóa: ' + (err?.error?.message ?? err.message))
      });
    }
  }

  toggleStatus(course: Course) {
    const newStatus = course.status === 'active' ? 'hidden' : 'active';
    this.courseService.update((course as any)._id, { status: newStatus }).subscribe({
      next: () => this.loadCourses(),
      error: (err) => alert('Lỗi cập nhật trạng thái: ' + (err?.error?.message ?? err.message))
    });
  }
}
