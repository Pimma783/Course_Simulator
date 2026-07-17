import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  lowCreditSemesters: { semester: number; totalCredits: number; originalCredits: number }[];
}

@Injectable()
export class SimulatorService {
  constructor(
    private readonly coursesService: CoursesService,
    @InjectRepository(SimulationRecord)
    private readonly simulationRecordRepo: Repository<SimulationRecord>,
  ) {}

  /**
   * Build a map: courseCode -> list of courses that depend on it as a prerequisite.
   */
  private buildDependentsMap(allCourses: Course[]): Map<string, Course[]> {
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

  /**
   * Compute the longest prerequisite chain depth from a given course code
   * using memoization. This avoids the bug where a shared visited set
   * would skip alternate longer paths.
   */
  private computeMaxDepth(
    code: string,
    dependentsMap: Map<string, Course[]>,
    memo: Map<string, number>,
    visiting: Set<string>,
  ): number {
    if (memo.has(code)) return memo.get(code)!;

    // Cycle guard: if we're already visiting this node, treat depth as 0
    if (visiting.has(code)) return 0;
    visiting.add(code);

    const dependents = dependentsMap.get(code) || [];
    let maxChildDepth = 0;
    for (const dep of dependents) {
      const childDepth = 1 + this.computeMaxDepth(dep.courseCode, dependentsMap, memo, visiting);
      if (childDepth > maxChildDepth) {
        maxChildDepth = childDepth;
      }
    }

    visiting.delete(code);
    memo.set(code, maxChildDepth);
    return maxChildDepth;
  }

  /**
   * Collect all courses transitively affected by a failed course
   * using BFS (breadth-first search) on the dependents graph.
   */
  private collectAffectedCourses(
    startCode: string,
    dependentsMap: Map<string, Course[]>,
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

  /**
   * Calculate the next available retake semester for a course,
   * respecting the same parity rule (odd/even semester alignment).
   * If the course was offered in semester N, the retake must be in a semester
   * with the same parity (N, N+2, N+4, ...) that is after currentSemester.
   */
  private calculateRetakeSemester(originalSemester: number, currentSemester: number): number {
    // The retake must happen in a future semester with the same parity
    const parity = originalSemester % 2; // 0 = even, 1 = odd
    let retakeSem = currentSemester + 1;

    // Find the next semester after currentSemester with the same parity
    if (retakeSem % 2 !== parity) {
      retakeSem += 1;
    }

    return retakeSem;
  }

  async checkEligibility(input: { passedCourses: string[]; fCourses: string[]; currentSemester: number }): Promise<EligibilityResult> {
    const allCoursesRaw = await this.coursesService.findAll();
    
    const allCourses: Course[] = allCoursesRaw.map(c => {
      let credits = c.totalCredits;
      if (credits === null || credits === undefined || credits === 0) {
        if (c.creditsBreakdown) {
          const parsed = parseInt(c.creditsBreakdown.split('-')[0]);
          if (!isNaN(parsed)) credits = parsed;
        }
      }
      return {
        courseCode: c.courseCode,
        courseName: c.courseName,
        semester: c.semester,
        prerequisites: c.prerequisites || [],
        totalCredits: credits || 0,
      };
    });

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

  async computeImpact(input: { passedCourses: string[]; fCourses: string[]; currentSemester: number }): Promise<ImpactResult> {
    const allCoursesRaw = await this.coursesService.findAll();
    
    const allCourses: Course[] = allCoursesRaw.map(c => {
      let credits = c.totalCredits;
      if (credits === null || credits === undefined || credits === 0) {
        if (c.creditsBreakdown) {
          const parsed = parseInt(c.creditsBreakdown.split('-')[0]);
          if (!isNaN(parsed)) credits = parsed;
        }
      }
      return {
        courseCode: c.courseCode,
        courseName: c.courseName,
        semester: c.semester,
        prerequisites: c.prerequisites || [],
        totalCredits: credits || 0,
      };
    });

    const courseMap = new Map<string, Course>();
    for (const c of allCourses) {
      courseMap.set(c.courseCode, c);
    }

    const dependentsMap = this.buildDependentsMap(allCourses);
    const depthMemo = new Map<string, number>();
    const visiting = new Set<string>();

    const affectedSet = new Set<string>();
    const chains: CascadeChain[] = [];
    const retakePlans: RetakePlan[] = [];

    let maxChainDepth = 0;

    for (const failedCode of input.fCourses) {
      // (Fix #1) Compute the longest chain depth using memoized DFS
      const depth = this.computeMaxDepth(failedCode, dependentsMap, depthMemo, visiting);
      if (depth > maxChainDepth) maxChainDepth = depth;

      // (Fix #1) Collect all affected courses via BFS (no depth distortion)
      const chainCodes = this.collectAffectedCourses(failedCode, dependentsMap);
      for (const code of chainCodes) {
        affectedSet.add(code);
      }
      chains.push({ triggerCourse: failedCode, chain: chainCodes });

      // (Fix #2) Compute retake semester using parity-aware logic
      const failedCourse = courseMap.get(failedCode);
      if (failedCourse) {
        const retakeSem = this.calculateRetakeSemester(
          failedCourse.semester,
          input.currentSemester,
        );
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

    // (Fix #3) Compute delay by simulating earliest completion for each
    // affected course, considering prerequisite chains and retake timing.
    //
    // earliestAvailable tracks when each course can actually be taken,
    // starting from the retake semesters for failed courses and propagating
    // through the prerequisite chain.
    const earliestAvailable = new Map<string, number>();

    // Seed: earliest availability for retaken failed courses
    for (const rp of retakePlans) {
      earliestAvailable.set(rp.courseCode, rp.retakeSemester);
    }

    // For each affected course, compute when it can actually be taken
    // by looking at when ALL its prerequisites become available.
    const computeEarliest = (code: string, stack: Set<string>): number => {
      if (earliestAvailable.has(code)) return earliestAvailable.get(code)!;
      if (stack.has(code)) return input.currentSemester; // cycle guard

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

      // The course can be taken the semester after all its prerequisites are completed
      // and must match the same parity as the original semester
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

    // Check for low credit semesters (< 18 credits) with rolling excess
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
        // สำหรับอดีตและเทอมปัจจุบัน ให้นับเฉพาะวิชาที่ผู้ใช้คลิกเลือก (Passed/Failed) เท่านั้น
        // สำหรับอนาคต (c.semester > currentSemester) ให้นำวิชาตามแผนมาใส่ในตาราง
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

  async saveSimulationRecord(userId: string, data: { failedCourses: string[]; expectedGraduationSemester: number; delaySemesters: number; isDismissed: boolean; }) {
    const record = this.simulationRecordRepo.create({
      student: { id: userId },
      failedCourses: data.failedCourses,
      expectedGraduationSemester: data.expectedGraduationSemester,
      delaySemesters: data.delaySemesters,
      isDismissed: data.isDismissed,
    });
    return this.simulationRecordRepo.save(record);
  }

  async getSimulationRecordsByUser(userId: string) {
    return this.simulationRecordRepo.find({
      where: { student: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteSimulationRecord(recordId: string, userId: string) {
    const record = await this.simulationRecordRepo.findOne({
      where: { id: recordId, student: { id: userId } },
    });
    if (!record) {
      throw new NotFoundException('Simulation record not found or unauthorized');
    }
    return this.simulationRecordRepo.remove(record);
  }
}
