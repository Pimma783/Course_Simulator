"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const courses_service_1 = require("../courses/courses.service");
const simulation_record_entity_1 = require("../database/entities/simulation-record.entity");
let SimulatorService = class SimulatorService {
    coursesService;
    simulationRecordRepo;
    constructor(coursesService, simulationRecordRepo) {
        this.coursesService = coursesService;
        this.simulationRecordRepo = simulationRecordRepo;
    }
    buildDependentsMap(allCourses) {
        const dependentsMap = new Map();
        for (const course of allCourses) {
            for (const prereq of (course.prerequisites || [])) {
                if (!dependentsMap.has(prereq)) {
                    dependentsMap.set(prereq, []);
                }
                dependentsMap.get(prereq).push(course);
            }
        }
        return dependentsMap;
    }
    computeMaxDepth(code, dependentsMap, memo, visiting) {
        if (memo.has(code))
            return memo.get(code);
        if (visiting.has(code))
            return 0;
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
    collectAffectedCourses(startCode, dependentsMap) {
        const visited = new Set([startCode]);
        const queue = [startCode];
        const affected = [];
        while (queue.length > 0) {
            const current = queue.shift();
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
    calculateRetakeSemester(originalSemester, currentSemester) {
        const parity = originalSemester % 2;
        let retakeSem = currentSemester + 1;
        if (retakeSem % 2 !== parity) {
            retakeSem += 1;
        }
        return retakeSem;
    }
    async checkEligibility(input) {
        const allCoursesRaw = await this.coursesService.findAll();
        const allCourses = allCoursesRaw.map(c => {
            let credits = c.totalCredits;
            if (credits === null || credits === undefined || credits === 0) {
                if (c.creditsBreakdown) {
                    const parsed = parseInt(c.creditsBreakdown.split('-')[0]);
                    if (!isNaN(parsed))
                        credits = parsed;
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
        const eligible = [];
        const blocked = [];
        for (const course of candidates) {
            const prereqs = course.prerequisites || [];
            if (prereqs.length === 0) {
                eligible.push(course);
                continue;
            }
            const failedPrereqs = prereqs.filter(p => input.fCourses.includes(p));
            if (failedPrereqs.length > 0) {
                blocked.push({ course, blockedBy: failedPrereqs, reason: 'FAILED_PREREQUISITE' });
                continue;
            }
            const missingPrereqs = prereqs.filter(p => !input.passedCourses.includes(p));
            if (missingPrereqs.length > 0) {
                blocked.push({ course, blockedBy: missingPrereqs, reason: 'PREREQUISITE_NOT_PASSED' });
                continue;
            }
            eligible.push(course);
        }
        return { targetSemester, eligibleCourses: eligible, blockedCourses: blocked };
    }
    async computeImpact(input) {
        const allCoursesRaw = await this.coursesService.findAll();
        const allCourses = allCoursesRaw.map(c => {
            let credits = c.totalCredits;
            if (credits === null || credits === undefined || credits === 0) {
                if (c.creditsBreakdown) {
                    const parsed = parseInt(c.creditsBreakdown.split('-')[0]);
                    if (!isNaN(parsed))
                        credits = parsed;
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
        const courseMap = new Map();
        for (const c of allCourses) {
            courseMap.set(c.courseCode, c);
        }
        const dependentsMap = this.buildDependentsMap(allCourses);
        const depthMemo = new Map();
        const visiting = new Set();
        const affectedSet = new Set();
        const chains = [];
        const retakePlans = [];
        let maxChainDepth = 0;
        for (const failedCode of input.fCourses) {
            const depth = this.computeMaxDepth(failedCode, dependentsMap, depthMemo, visiting);
            if (depth > maxChainDepth)
                maxChainDepth = depth;
            const chainCodes = this.collectAffectedCourses(failedCode, dependentsMap);
            for (const code of chainCodes) {
                affectedSet.add(code);
            }
            chains.push({ triggerCourse: failedCode, chain: chainCodes });
            const failedCourse = courseMap.get(failedCode);
            if (failedCourse) {
                const retakeSem = this.calculateRetakeSemester(failedCourse.semester, input.currentSemester);
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
        const earliestAvailable = new Map();
        for (const rp of retakePlans) {
            earliestAvailable.set(rp.courseCode, rp.retakeSemester);
        }
        const computeEarliest = (code, stack) => {
            if (earliestAvailable.has(code))
                return earliestAvailable.get(code);
            if (stack.has(code))
                return input.currentSemester;
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
                    if (prereqAvail > latestPrereq)
                        latestPrereq = prereqAvail;
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
            const earliest = computeEarliest(code, new Set());
            if (earliest > maxEarliestSemester)
                maxEarliestSemester = earliest;
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
        const schedule = new Map();
        const maxSem = Math.max(8, expectedGraduationSemester);
        for (let s = 1; s <= maxSem; s++) {
            schedule.set(s, []);
        }
        for (const c of allCourses) {
            if (input.passedCourses.includes(c.courseCode)) {
                schedule.get(c.semester)?.push(c);
            }
            else if (input.fCourses.includes(c.courseCode)) {
                schedule.get(c.semester)?.push(c);
                const retakeSem = earliestAvailable.get(c.courseCode) || c.semester;
                schedule.get(retakeSem)?.push(c);
            }
            else if (affectedSet.has(c.courseCode)) {
                const targetSem = earliestAvailable.get(c.courseCode) || c.semester;
                schedule.get(targetSem)?.push(c);
            }
            else {
                if (c.semester > input.currentSemester) {
                    schedule.get(c.semester)?.push(c);
                }
            }
        }
        const lowCreditSemesters = [];
        let excessPool = 0;
        for (let s = 1; s <= input.currentSemester; s++) {
            const coursesInSem = schedule.get(s) || [];
            const originalCredits = coursesInSem.reduce((sum, c) => sum + (c.totalCredits || 0), 0);
            let effectiveCredits = originalCredits;
            if (effectiveCredits > 18) {
                excessPool += (effectiveCredits - 18);
            }
            else if (effectiveCredits < 18) {
                const needed = 18 - effectiveCredits;
                if (excessPool >= needed) {
                    excessPool -= needed;
                    effectiveCredits = 18;
                }
                else {
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
    async saveSimulationRecord(userId, data) {
        const record = this.simulationRecordRepo.create({
            student: { id: userId },
            failedCourses: data.failedCourses,
            expectedGraduationSemester: data.expectedGraduationSemester,
            delaySemesters: data.delaySemesters,
            isDismissed: data.isDismissed,
        });
        return this.simulationRecordRepo.save(record);
    }
    async getSimulationRecordsByUser(userId) {
        return this.simulationRecordRepo.find({
            where: { student: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async deleteSimulationRecord(recordId, userId) {
        const record = await this.simulationRecordRepo.findOne({
            where: { id: recordId, student: { id: userId } },
        });
        if (!record) {
            throw new common_1.NotFoundException('Simulation record not found or unauthorized');
        }
        return this.simulationRecordRepo.remove(record);
    }
};
exports.SimulatorService = SimulatorService;
exports.SimulatorService = SimulatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(simulation_record_entity_1.SimulationRecord)),
    __metadata("design:paramtypes", [courses_service_1.CoursesService,
        typeorm_2.Repository])
], SimulatorService);
//# sourceMappingURL=simulator.service.js.map