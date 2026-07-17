import { Course, BlockedCourseInfo } from '../../lib/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface EligibilityCardProps {
  course: Course;
  blockedInfo?: BlockedCourseInfo;
}

export function EligibilityCard({ course, blockedInfo }: EligibilityCardProps) {
  const isEligible = !blockedInfo;

  return (
    <div className={`elig-card ${isEligible ? 'can-register' : 'blocked'}`}>
      <div className="elig-card-header">
        <div>
          <div className="elig-card-code">{course.courseCode}</div>
          <div className="elig-card-name">{course.courseName}</div>
        </div>
        {isEligible
          ? <CheckCircle size={20} color="var(--green-500)" />
          : <XCircle size={20} color="var(--red-500)" />
        }
      </div>
      {!isEligible && blockedInfo && (
        <div className="elig-reason blocked-reason">
          <strong>
            {blockedInfo.reason === 'FAILED_PREREQUISITE'
              ? 'สอบตกวิชาบังคับก่อน'
              : 'ยังไม่ผ่านวิชาบังคับก่อน'
            }
          </strong>
          <div style={{ marginTop: '4px', opacity: 0.8 }}>
            ติดเงื่อนไข: {blockedInfo.blockedBy.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
