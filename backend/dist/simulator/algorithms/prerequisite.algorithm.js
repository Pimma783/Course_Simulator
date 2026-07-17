"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEligibility = checkEligibility;
function checkEligibility(targetCourse, passedCourses, prerequisites) {
    const reqs = prerequisites[targetCourse] || [];
    return reqs.every(req => passedCourses.includes(req));
}
//# sourceMappingURL=prerequisite.algorithm.js.map