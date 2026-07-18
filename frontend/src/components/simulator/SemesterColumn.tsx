'use client';

import { Course, CourseStatus } from '../../lib/types';
import { CourseChip } from './CourseChip';

interface SemesterColumnProps {
  semester: number;
  courses: Course[];
  statusMap: Record<string, CourseStatus>;
  lockedCourses: Set<string>;
  onCourseClick: (courseCode: string) => void;
}

export function SemesterColumn({ semester, courses, statusMap, lockedCourses, onCourseClick }: SemesterColumnProps) {
  return (
    <div className="semester-col">
      <div className="semester-label">ภาคเรียนที่ {semester}</div>
      <div className="semester-courses">
        {courses.map((course) => (
          <CourseChip
            key={course.courseCode}
            course={course}
            status={statusMap[course.courseCode]}
            isLocked={lockedCourses.has(course.courseCode)}
            onClick={() => onCourseClick(course.courseCode)}
          />
        ))}
        {courses.length === 0 && <div className="empty-text">ไม่มีรายวิชา</div>}
      </div>
    </div>
  );
}
