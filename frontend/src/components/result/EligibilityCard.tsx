import { Course, BlockedCourseInfo } from '../../lib/types';

interface EligibilityCardProps {
  course: Course;
  blockedInfo?: BlockedCourseInfo;
}

export function EligibilityCard({ course, blockedInfo }: EligibilityCardProps) {
  const isEligible = !blockedInfo;

  return (
    <div className={`elig-card ${isEligible ? 'ok' : 'blocked'}`}>
      <span className="code">{course.courseCode}</span>
      <div className="name">{course.courseName}</div>
      <div className="why">
        {isEligible 
          ? 'ลงได้ตามเงื่อนไข' 
          : `ลงไม่ได้ — ${blockedInfo?.reason === 'FAILED_PREREQUISITE' ? 'ติด F ในวิชาบังคับก่อน' : 'ยังไม่ผ่านวิชาบังคับก่อน'}`
        }
      </div>
    </div>
  );
}
