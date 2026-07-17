import { User } from './user.entity';
import { Course } from './course.entity';
export declare class StudyPlan {
    id: string;
    student: User;
    academicYear: number;
    semester: number;
    selectedCourses: Course[];
}
