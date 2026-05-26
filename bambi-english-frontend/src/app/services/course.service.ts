import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /** Public: chỉ active */
  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  /** Admin: tất cả kể cả hidden */
  getAllAdmin(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/admin/all`);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${id}`);
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
