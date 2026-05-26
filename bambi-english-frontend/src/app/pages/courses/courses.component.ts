import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses = signal<Course[]>([]);
  loading = signal(true);
  
  // Mocks for filtering UI
  selectedAge = signal<string>('all');
  
  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getAll().subscribe({
      next: (data) => { this.courses.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', currency: 'VND',
    }).format(price);
  }
}
