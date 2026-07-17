import { Repository } from 'typeorm';
import { CoursesService } from '../courses/courses.service';
import { SimulationRecord } from '../database/entities/simulation-record.entity';
interface Course {
    courseCode: string;
    courseName: string;
    semester: number;
    prerequisites: string[];
    totalCredits: number;
}
interface BlockedCourseInfo {
    course: Course;
    blockedBy: string[];
    reason: 'FAILED_PREREQUISITE' | 'PREREQUISITE_NOT_PASSED';
}
interface EligibilityResult {
    targetSemester: number;
    eligibleCourses: Course[];
    blockedCourses: BlockedCourseInfo[];
}
interface CascadeChain {
    triggerCourse: string;
    chain: string[];
}
interface RetakePlan {
    courseCode: string;
    courseName: string;
    failedSemester: number;
    retakeSemester: number;
}
interface ImpactResult {
    delaySemesters: number;
    finalBlockedSemester: number;
    affectedCourses: Course[];
    cascadeChains: CascadeChain[];
    retakePlans: RetakePlan[];
    expectedGraduationSemester: number;
    isDismissed: boolean;
    lowCreditSemesters: {
        semester: number;
        totalCredits: number;
        originalCredits: number;
    }[];
}
export declare class SimulatorService {
    private readonly coursesService;
    private readonly simulationRecordRepo;
    constructor(coursesService: CoursesService, simulationRecordRepo: Repository<SimulationRecord>);
    private buildDependentsMap;
    private computeMaxDepth;
    private collectAffectedCourses;
    private calculateRetakeSemester;
    checkEligibility(input: {
        passedCourses: string[];
        fCourses: string[];
        currentSemester: number;
    }): Promise<EligibilityResult>;
    computeImpact(input: {
        passedCourses: string[];
        fCourses: string[];
        currentSemester: number;
    }): Promise<ImpactResult>;
    saveSimulationRecord(userId: string, data: {
        failedCourses: string[];
        expectedGraduationSemester: number;
        delaySemesters: number;
        isDismissed: boolean;
    }): Promise<SimulationRecord>;
    getSimulationRecordsByUser(userId: string): Promise<SimulationRecord[]>;
    deleteSimulationRecord(recordId: string, userId: string): Promise<SimulationRecord>;
}
export {};
