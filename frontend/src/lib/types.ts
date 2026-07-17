export interface Course {
  courseCode: string;
  courseName: string;
  semester: number;
  prerequisites: string[];
  totalCredits?: number;
  creditsBreakdown?: string;
}

export type CourseStatus = 'passed' | 'failed' | undefined;

export interface SimulationInput {
  passedCourses: string[];
  fCourses: string[];
  currentSemester: number;
}

export interface BlockedCourseInfo {
  course: Course;
  blockedBy: string[];
  reason: 'FAILED_PREREQUISITE' | 'PREREQUISITE_NOT_PASSED';
}

export interface EligibilityResult {
  targetSemester: number;
  eligibleCourses: Course[];
  blockedCourses: BlockedCourseInfo[];
}

export interface CascadeChain {
  triggerCourse: string;
  chain: string[];
}

export interface RetakePlan {
  courseCode: string;
  courseName: string;
  failedSemester: number;
  retakeSemester: number;
}

export interface ImpactResult {
  delaySemesters: number;
  finalBlockedSemester: number;
  affectedCourses: Course[];
  cascadeChains: CascadeChain[];
  retakePlans: RetakePlan[];
  expectedGraduationSemester: number;
  isDismissed: boolean;
  lowCreditSemesters: { semester: number; totalCredits: number; originalCredits: number }[];
}
