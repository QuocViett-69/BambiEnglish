import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { CourseDocument } from '../courses/course.schema';
export declare class SeedService implements OnApplicationBootstrap {
    private courseModel;
    private readonly logger;
    constructor(courseModel: Model<CourseDocument>);
    onApplicationBootstrap(): Promise<void>;
    private seedCourses;
}
