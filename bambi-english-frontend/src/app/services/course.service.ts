import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course.model';

import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  private mockCourses: Course[] = [
    {
      _id: 'starters',
      title: 'Pre-A1 Starters',
      shortDescription: 'Làm quen với tiếng Anh qua các chủ đề quen thuộc, chuẩn bị cho kỳ thi Starters của Cambridge.',
      price: 1500000,
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop',
      status: 'active'
    },
    {
      _id: 'movers',
      title: 'A1 Movers',
      shortDescription: 'Nâng cao từ vựng và ngữ pháp cơ bản, tự tin giao tiếp các tình huống hàng ngày.',
      price: 1600000,
      imageUrl: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=600&auto=format&fit=crop',
      status: 'active'
    },
    {
      _id: 'flyers',
      title: 'A2 Flyers',
      shortDescription: 'Hoàn thiện 4 kỹ năng Nghe - Nói - Đọc - Viết, bước đệm vững chắc lên cấp Trung học.',
      price: 1700000,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=600&auto=format&fit=crop',
      status: 'active'
    },
    {
      _id: 'ket',
      title: 'A2 Key (KET)',
      shortDescription: 'Chứng chỉ tiếng Anh tổng quát, giúp học viên giao tiếp trong những tình huống đơn giản.',
      price: 1900000,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
      status: 'active'
    },
    {
      _id: 'pet',
      title: 'B1 Preliminary (PET)',
      shortDescription: 'Sử dụng tiếng Anh linh hoạt trong học tập, công việc và du lịch.',
      price: 2100000,
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop',
      status: 'active'
    },
    {
      _id: 'ielts',
      title: 'IELTS Foundation',
      shortDescription: 'Chuẩn bị nền tảng học thuật vững chắc cho kỳ thi IELTS quốc tế.',
      price: 2500000,
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
      status: 'active'
    }
  ];

  /** Public: chỉ active */
  getAll(): Observable<Course[]> {
    return of(this.mockCourses);
  }

  /** Admin: tất cả kể cả hidden */
  getAllAdmin(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/admin/all`);
  }

  getById(id: string): Observable<Course> {
    const course = this.mockCourses.find(c => c._id === id);
    return of(course as Course);
  }

  create(dto: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, dto);
  }

  update(id: string, dto: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.baseUrl}/courses/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${id}`);
  }
}
