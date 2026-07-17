import { User } from './user.entity';
import { Course } from './course.entity';
export declare class FailedCourse {
    id: string;
    student: User;
    course: Course;
    isResolved: boolean;
}
