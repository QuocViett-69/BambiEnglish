import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<import("./course.schema").Course[]>;
    findOne(id: string): Promise<import("./course.schema").Course | null>;
}
