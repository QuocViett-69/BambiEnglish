import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<import("./course.schema").Course[]>;
    findAllAdmin(): Promise<import("./course.schema").Course[]>;
    findOne(id: string): Promise<import("./course.schema").Course | null>;
    create(body: any): Promise<import("./course.schema").Course>;
    update(id: string, body: any): Promise<import("./course.schema").Course>;
    delete(id: string): Promise<void>;
}
