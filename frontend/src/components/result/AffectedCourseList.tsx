import { Course } from '../../lib/types';

interface AffectedCourseListProps {
  courses: Course[];
}

export function AffectedCourseList({ courses }: AffectedCourseListProps) {
  if (courses.length === 0) return null;

  return (
    <div className="affected-list">
      <h4>รายวิชาที่ได้รับผลกระทบ ({courses.length})</h4>
      <div className="affected-tags">
        {courses.map(course => (
          <div key={course.courseCode} className="affected-tag">
            <strong>{course.courseCode}</strong> {course.courseName}
          </div>
        ))}
      </div>
    </div>
  );
}
