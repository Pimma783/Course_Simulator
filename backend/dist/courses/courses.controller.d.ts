import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    getAllCourses(): Promise<import("../database/entities/course.entity").Course[]>;
    seedCourses(): Promise<{
        message: string;
    }>;
}
