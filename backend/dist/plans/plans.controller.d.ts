import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    updatePlan(studentId: string, body: {
        academicYear: number;
        semester: number;
        courses: string[];
    }): Promise<import("../database/entities/study-plan.entity").StudyPlan>;
}
