'use client';

import { Course, CourseStatus } from '../../lib/types';
import { Lock } from 'lucide-react';

interface CourseChipProps {
  course: Course;
  status: CourseStatus;
  isLocked?: boolean;
  onClick: () => void;
}

export function CourseChip({ course, status, isLocked, onClick }: CourseChipProps) {
  const activeStatus = isLocked ? undefined : status;
  const chipClass = `chip ${activeStatus === 'passed' ? 'passed' : activeStatus === 'failed' ? 'failed' : ''} ${isLocked ? 'locked' : ''}`;

  const handleClick = () => {
    if (!isLocked) onClick();
  };

  return (
    <div className={chipClass} onClick={handleClick}>
      <div className="chip-code">
        {course.courseCode}
        {isLocked && <Lock size={12} style={{ display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }} />}
      </div>
      <div className="chip-name">{course.courseName}</div>
      <div className="chip-prereq">Pre: {course.prerequisites.join(', ')}</div>
    </div>
  );
}
