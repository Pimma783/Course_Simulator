"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateImpact = calculateImpact;
function calculateImpact(failedCourse, curriculum) {
    const graph = {};
    for (const [course, prereqs] of Object.entries(curriculum)) {
        for (const req of prereqs) {
            if (!graph[req]) {
                graph[req] = [];
            }
            graph[req].push(course);
        }
    }
    const impacted = new Set();
    const stack = [failedCourse];
    while (stack.length > 0) {
        const current = stack.pop();
        const dependents = graph[current] || [];
        for (const dep of dependents) {
            if (!impacted.has(dep)) {
                impacted.add(dep);
                stack.push(dep);
            }
        }
    }
    return Array.from(impacted);
}
//# sourceMappingURL=impact.algorithm.js.map