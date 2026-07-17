export function calculateImpact(failedCourse: string, curriculum: Record<string, string[]>): string[] {
  const graph: Record<string, string[]> = {};
  
  for (const [course, prereqs] of Object.entries(curriculum)) {
    for (const req of prereqs) {
      if (!graph[req]) {
        graph[req] = [];
      }
      graph[req].push(course);
    }
  }

  const impacted = new Set<string>();
  const stack = [failedCourse];

  while (stack.length > 0) {
    const current = stack.pop()!;
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
