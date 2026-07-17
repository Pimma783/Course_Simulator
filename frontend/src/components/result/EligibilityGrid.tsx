import { Course, BlockedCourseInfo } from '../../lib/types';
import { EligibilityCard } from './EligibilityCard';

interface EligibilityGridProps {
  eligibleCourses: Course[];
  blockedCourses: BlockedCourseInfo[];
}

export function EligibilityGrid({ eligibleCourses, blockedCourses }: EligibilityGridProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section>
        <div className="sub-header green">
          วิชาที่ลงทะเบียนได้ <span className="count">{eligibleCourses.length}</span>
        </div>
        {eligibleCourses.length > 0 ? (
          <div className="eligibility-grid">
            {eligibleCourses.map(course => (
              <EligibilityCard key={course.courseCode} course={course} />
            ))}
          </div>
        ) : (
          <div className="empty-text">ไม่มีวิชาที่ลงทะเบียนได้ในเทอมนี้</div>
        )}
      </section>

      <section>
        <div className="sub-header red">
          วิชาที่ติดเงื่อนไข <span className="count">{blockedCourses.length}</span>
        </div>
        {blockedCourses.length > 0 ? (
          <div className="eligibility-grid">
            {blockedCourses.map(blocked => (
              <EligibilityCard key={blocked.course.courseCode} course={blocked.course} blockedInfo={blocked} />
            ))}
          </div>
        ) : (
          <div className="empty-text">ไม่มีวิชาที่ติดเงื่อนไข</div>
        )}
      </section>
    </div>
  );
}
