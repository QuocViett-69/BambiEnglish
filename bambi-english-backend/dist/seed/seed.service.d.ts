import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { CourseDocument } from '../courses/course.schema';
import { BranchDocument } from '../branches/branch.schema';
import { RegistrationDocument } from '../registrations/registration.schema';
import { TrialDocument } from '../trials/trial.schema';
export declare class SeedService implements OnApplicationBootstrap {
    private courseModel;
    private branchModel;
    private registrationModel;
    private trialModel;
    private readonly logger;
    constructor(courseModel: Model<CourseDocument>, branchModel: Model<BranchDocument>, registrationModel: Model<RegistrationDocument>, trialModel: Model<TrialDocument>);
    onApplicationBootstrap(): Promise<void>;
    private seedRegistrations;
    private seedTrials;
    private seedCourses;
    private seedBranches;
}
