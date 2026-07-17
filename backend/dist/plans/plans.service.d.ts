import { Repository } from 'typeorm';
import { StudyPlan } from '../database/entities/study-plan.entity';
import { Course } from '../database/entities/course.entity';
import { User } from '../database/entities/user.entity';
export declare class PlansService {
    private studyPlanRepository;
    private courseRepository;
    private userRepository;
    constructor(studyPlanRepository: Repository<StudyPlan>, courseRepository: Repository<Course>, userRepository: Repository<User>);
    savePlan(studentId: string, academicYear: number, semester: number, courseCodes: string[]): Promise<StudyPlan>;
}
