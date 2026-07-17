import { Course, EligibilityResult, BlockedCourseInfo, SimulationInput } from '../types';

export function checkEligibility(allCourses: Course[], input: SimulationInput): EligibilityResult {
  const targetSemester = input.currentSemester + 1;
  const candidates = allCourses.filter(c => c.semester === targetSemester);

  const eligible: Course[] = [];
  const blocked: BlockedCourseInfo[] = [];

  for (const course of candidates) {
    const prereqs = course.prerequisites || [];
    
    if (prereqs.length === 0) {
      eligible.push(course);
      continue;
    }

    // Check if any prerequisite is in fCourses (failed)
    const failedPrereqs = prereqs.filter(p => input.fCourses.includes(p));
    if (failedPrereqs.length > 0) {
      blocked.push({ course, blockedBy: failedPrereqs, reason: 'FAILED_PREREQUISITE' });
      continue;
    }

    // Check if any prerequisite is not in passedCourses
    const missingPrereqs = prereqs.filter(p => !input.passedCourses.includes(p));
    if (missingPrereqs.length > 0) {
      blocked.push({ course, blockedBy: missingPrereqs, reason: 'PREREQUISITE_NOT_PASSED' });
      continue;
    }

    eligible.push(course);
  }

  return { targetSemester, eligibleCourses: eligible, blockedCourses: blocked };
}
