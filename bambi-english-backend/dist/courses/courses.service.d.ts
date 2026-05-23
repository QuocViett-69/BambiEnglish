import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';
export declare class CoursesService {
    private courseModel;
    constructor(courseModel: Model<CourseDocument>);
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
}
