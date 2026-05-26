import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /** GET /api/courses — Public: chỉ trả active */
  async findAll(): Promise<Course[]> {
    return this.courseModel.find({ status: 'active' }).exec();
  }

  /** GET /api/courses/admin/all — Admin: trả tất cả (kể cả hidden) */
  async findAllAdmin(): Promise<Course[]> {
    return this.courseModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).exec();
  }

  async create(dto: Partial<Course>): Promise<Course> {
    const course = new this.courseModel(dto);
    return course.save();
  }

  async update(id: string, dto: Partial<Course>): Promise<Course> {
    const course = await this.courseModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!course) throw new NotFoundException(`Không tìm thấy khóa học: ${id}`);
    return course;
  }

  async delete(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Không tìm thấy khóa học: ${id}`);
  }
}
