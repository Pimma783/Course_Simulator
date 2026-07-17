import { SimulatorService } from './simulator.service';
export declare class SimulationInputDto {
    passedCourses: string[];
    fCourses: string[];
    currentSemester: number;
}
export declare class SaveSimulationDto {
    failedCourses: string[];
    expectedGraduationSemester: number;
    delaySemesters: number;
    isDismissed: boolean;
}
export declare class SimulatorController {
    private readonly simulatorService;
    constructor(simulatorService: SimulatorService);
    checkEligibility(body: SimulationInputDto): Promise<any>;
    analyzeImpact(body: SimulationInputDto): Promise<any>;
    saveSimulation(req: any, body: SaveSimulationDto): Promise<import("../database/entities/simulation-record.entity").SimulationRecord>;
    getHistory(req: any): Promise<import("../database/entities/simulation-record.entity").SimulationRecord[]>;
    deleteHistory(req: any, id: string): Promise<import("../database/entities/simulation-record.entity").SimulationRecord>;
}
