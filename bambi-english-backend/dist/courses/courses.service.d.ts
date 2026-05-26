import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';
export declare class CoursesService {
    private courseModel;
    constructor(courseModel: Model<CourseDocument>);
    findAll(): Promise<Course[]>;
    findAllAdmin(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    create(dto: Partial<Course>): Promise<Course>;
    update(id: string, dto: Partial<Course>): Promise<Course>;
    delete(id: string): Promise<void>;
}
