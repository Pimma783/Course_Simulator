import { useState, useEffect } from 'react';
import { Course, CourseStatus, SimulationInput } from '../lib/types';

export function useCourseSelection() {
  const [status, setStatus] = useState<Record<string, CourseStatus>>({});
  const [currentSemester, setCurrentSemester] = useState<number>(1); // Default to semester 1
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem('courseStatus');
      if (savedStatus) setStatus(JSON.parse(savedStatus));
      const savedSem = localStorage.getItem('currentSemester');
      if (savedSem) setCurrentSemester(parseInt(savedSem, 10));
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('courseStatus', JSON.stringify(status));
      localStorage.setItem('currentSemester', currentSemester.toString());
    }
  }, [status, currentSemester, isLoaded]);

  function cycleStatus(courseCode: string): void {
    setStatus((prev) => {
      const current = prev[courseCode];
      let next: CourseStatus;
      
      if (current === undefined) next = 'passed';
      else if (current === 'passed') next = 'failed';
      else next = undefined;
      
      const newStatus = { ...prev };
      if (next === undefined) {
        delete newStatus[courseCode];
      } else {
        newStatus[courseCode] = next;
      }
      return newStatus;
    });
  }

  function toSimulationInput(): SimulationInput {
    const passedCourses: string[] = [];
    const fCourses: string[] = [];
    
    Object.entries(status).forEach(([code, s]) => {
      if (s === 'passed') passedCourses.push(code);
      if (s === 'failed') fCourses.push(code);
    });

    return {
      passedCourses,
      fCourses,
      currentSemester
    };
  }

  const passedCount = Object.values(status).filter(s => s === 'passed').length;
  const failedCount = Object.values(status).filter(s => s === 'failed').length;

  return {
    status,
    cycleStatus,
    toSimulationInput,
    passedCount,
    failedCount,
    currentSemester,
    setCurrentSemester
  };
}
