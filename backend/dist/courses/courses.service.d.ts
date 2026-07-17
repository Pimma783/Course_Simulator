import { Repository } from 'typeorm';
import { Course } from '../database/entities/course.entity';
export declare class CoursesService {
    private courseRepository;
    constructor(courseRepository: Repository<Course>);
    findAll(): Promise<Course[]>;
    seedCourses(): Promise<void>;
}
