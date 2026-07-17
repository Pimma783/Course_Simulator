import { Course, ImpactResult, CascadeChain, RetakePlan, SimulationInput } from '../types';

function buildDependentsMap(allCourses: Course[]): Map<string, Course[]> {
  const dependentsMap = new Map<string, Course[]>();
  for (const course of allCourses) {
    for (const prereq of (course.prerequisites || [])) {
      if (!dependentsMap.has(prereq)) {
        dependentsMap.set(prereq, []);
      }
      dependentsMap.get(prereq)!.push(course);
    }
  }
  return dependentsMap;
}

function computeMaxDepth(
  code: string,
  dependentsMap: Map<string, Course[]>,
  memo: Map<string, number>,
  visiting: Set<string>
): number {
  if (memo.has(code)) return memo.get(code)!;
  if (visiting.has(code)) return 0;
  
  visiting.add(code);
  const dependents = dependentsMap.get(code) || [];
  let maxChildDepth = 0;
  
  for (const dep of dependents) {
    const childDepth = 1 + computeMaxDepth(dep.courseCode, dependentsMap, memo, visiting);
    if (childDepth > maxChildDepth) {
      maxChildDepth = childDepth;
    }
  }
  
  visiting.delete(code);
  memo.set(code, maxChildDepth);
  return maxChildDepth;
}

function collectAffectedCourses(
  startCode: string,
  dependentsMap: Map<string, Course[]>
): string[] {
  const visited = new Set<string>([startCode]);
  const queue = [startCode];
  const affected: string[] = [];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const dependents = dependentsMap.get(current) || [];
    for (const dep of dependents) {
      if (!visited.has(dep.courseCode)) {
        visited.add(dep.courseCode);
        affected.push(dep.courseCode);
        queue.push(dep.courseCode);
      }
    }
  }
  return affected;
}

function calculateRetakeSemester(originalSemester: number, currentSemester: number): number {
  const parity = originalSemester % 2;
  let retakeSem = currentSemester + 1;
  if (retakeSem % 2 !== parity) {
    retakeSem += 1;
  }
  return retakeSem;
}

export function computeImpact(rawCourses: Course[], input: SimulationInput): ImpactResult {
  const allCourses: Course[] = rawCourses.map(c => {
    let credits = c.totalCredits;
    if (credits === null || credits === undefined || credits === 0) {
      if (c.creditsBreakdown) {
        const parsed = parseInt(c.creditsBreakdown.split('-')[0]);
        if (!isNaN(parsed)) credits = parsed;
      }
    }
    return {
      ...c,
      totalCredits: credits || 0,
    };
  });

  const courseMap = new Map<string, Course>();
  for (const c of allCourses) {
    courseMap.set(c.courseCode, c);
  }

  const dependentsMap = buildDependentsMap(allCourses);
  const depthMemo = new Map<string, number>();
  const visiting = new Set<string>();

  const affectedSet = new Set<string>();
  const chains: CascadeChain[] = [];
  const retakePlans: RetakePlan[] = [];

  let maxChainDepth = 0;

  for (const failedCode of input.fCourses) {
    const depth = computeMaxDepth(failedCode, dependentsMap, depthMemo, visiting);
    if (depth > maxChainDepth) maxChainDepth = depth;

    const chainCodes = collectAffectedCourses(failedCode, dependentsMap);
    for (const code of chainCodes) {
      affectedSet.add(code);
    }
    chains.push({ triggerCourse: failedCode, chain: chainCodes });

    const failedCourse = courseMap.get(failedCode);
    if (failedCourse) {
      const retakeSem = calculateRetakeSemester(failedCourse.semester, input.currentSemester);
      retakePlans.push({
        courseCode: failedCourse.courseCode,
        courseName: failedCourse.courseName,
        failedSemester: failedCourse.semester,
        retakeSemester: retakeSem,
      });
    }
  }

  const affectedCourses = allCourses.filter(c => affectedSet.has(c.courseCode));
  
  let finalBlockedSemester = input.currentSemester;
  for (const c of affectedCourses) {
    if (c.semester > finalBlockedSemester) {
      finalBlockedSemester = c.semester;
    }
  }

  const earliestAvailable = new Map<string, number>();
  for (const rp of retakePlans) {
    earliestAvailable.set(rp.courseCode, rp.retakeSemester);
  }

  const computeEarliest = (code: string, stack: Set<string>): number => {
    if (earliestAvailable.has(code)) return earliestAvailable.get(code)!;
    if (stack.has(code)) return input.currentSemester; 

    stack.add(code);
    const course = courseMap.get(code);
    if (!course) {
      stack.delete(code);
      return input.currentSemester;
    }

    let latestPrereq = 0;
    for (const prereq of (course.prerequisites || [])) {
      if (input.fCourses.includes(prereq) || affectedSet.has(prereq)) {
        const prereqAvail = computeEarliest(prereq, stack);
        if (prereqAvail > latestPrereq) latestPrereq = prereqAvail;
      }
    }

    let earliest = latestPrereq + 1;
    const parity = course.semester % 2;
    if (earliest % 2 !== parity) {
      earliest += 1;
    }

    earliestAvailable.set(code, earliest);
    stack.delete(code);
    return earliest;
  };

  let maxEarliestSemester = input.currentSemester;
  for (const code of affectedSet) {
    const earliest = computeEarliest(code, new Set<string>());
    if (earliest > maxEarliestSemester) maxEarliestSemester = earliest;
  }
  for (const rp of retakePlans) {
    if (rp.retakeSemester > maxEarliestSemester) {
      maxEarliestSemester = rp.retakeSemester;
    }
  }

  const normalGraduationSemester = 8;
  const delaySemesters = input.fCourses.length > 0
    ? Math.max(0, maxEarliestSemester - normalGraduationSemester)
    : 0;
  const expectedGraduationSemester = normalGraduationSemester + delaySemesters;
  const isDismissed = expectedGraduationSemester > 16;

  const schedule = new Map<number, Course[]>();
  const maxSem = Math.max(8, expectedGraduationSemester);
  for (let s = 1; s <= maxSem; s++) {
    schedule.set(s, []);
  }

  for (const c of allCourses) {
    if (input.passedCourses.includes(c.courseCode)) {
      schedule.get(c.semester)?.push(c);
    } else if (input.fCourses.includes(c.courseCode)) {
      schedule.get(c.semester)?.push(c); 
      const retakeSem = earliestAvailable.get(c.courseCode) || c.semester;
      schedule.get(retakeSem)?.push(c);
    } else if (affectedSet.has(c.courseCode)) {
      const targetSem = earliestAvailable.get(c.courseCode) || c.semester;
      schedule.get(targetSem)?.push(c);
    } else {
      if (c.semester > input.currentSemester) {
        schedule.get(c.semester)?.push(c);
      }
    }
  }

  const lowCreditSemesters: { semester: number; totalCredits: number; originalCredits: number }[] = [];
  let excessPool = 0;

  for (let s = 1; s <= input.currentSemester; s++) {
    const coursesInSem = schedule.get(s) || [];
    const originalCredits = coursesInSem.reduce((sum, c) => sum + (c.totalCredits || 0), 0);
    let effectiveCredits = originalCredits;

    if (effectiveCredits > 18) {
      excessPool += (effectiveCredits - 18);
    } else if (effectiveCredits < 18) {
      const needed = 18 - effectiveCredits;
      if (excessPool >= needed) {
        excessPool -= needed;
        effectiveCredits = 18;
      } else {
        effectiveCredits += excessPool;
        excessPool = 0;
      }
    }

    if (effectiveCredits < 18) {
      lowCreditSemesters.push({ semester: s, totalCredits: effectiveCredits, originalCredits });
    }
  }

  return { 
    delaySemesters, 
    finalBlockedSemester, 
    affectedCourses, 
    cascadeChains: chains,
    retakePlans,
    expectedGraduationSemester,
    isDismissed,
    lowCreditSemesters
  };
}
