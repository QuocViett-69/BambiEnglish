import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { CourseDocument } from '../courses/course.schema';
import { BranchDocument } from '../branches/branch.schema';
export declare class SeedService implements OnApplicationBootstrap {
    private courseModel;
    private branchModel;
    private readonly logger;
    constructor(courseModel: Model<CourseDocument>, branchModel: Model<BranchDocument>);
    onApplicationBootstrap(): Promise<void>;
    private seedCourses;
    private seedBranches;
}
