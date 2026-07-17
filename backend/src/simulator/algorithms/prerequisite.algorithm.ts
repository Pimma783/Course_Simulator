export function checkEligibility(targetCourse: string, passedCourses: string[], prerequisites: Record<string, string[]>): boolean {
  const reqs = prerequisites[targetCourse] || [];
  return reqs.every(req => passedCourses.includes(req));
}
