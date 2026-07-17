'use client';

import { Course, CourseStatus } from '../../lib/types';

interface CourseChipProps {
  course: Course;
  status: CourseStatus;
  onClick: () => void;
}

export function CourseChip({ course, status, onClick }: CourseChipProps) {
  const chipClass = `chip ${status === 'passed' ? 'passed' : status === 'failed' ? 'failed' : ''}`;

  return (
    <div className={chipClass} onClick={onClick}>
      <div className="chip-code">{course.courseCode}</div>
      <div className="chip-name">{course.courseName}</div>
      {course.prerequisites.length > 0 && (
        <div className="chip-prereq">Pre: {course.prerequisites.join(', ')}</div>
      )}
    </div>
  );
}
