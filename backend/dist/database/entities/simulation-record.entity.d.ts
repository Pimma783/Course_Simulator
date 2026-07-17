import { User } from './user.entity';
export declare class SimulationRecord {
    id: string;
    student: User;
    failedCourses: string[];
    expectedGraduationSemester: number;
    delaySemesters: number;
    isDismissed: boolean;
    createdAt: Date;
}
