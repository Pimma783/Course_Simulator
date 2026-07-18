import { CalendarDays, AlertTriangle } from 'lucide-react';
import { AffectedCourseList } from './AffectedCourseList';
import { Course, RetakePlan } from '../../lib/types';

interface ImpactBannerProps {
  delaySemesters: number;
  affectedCourses: Course[];
  retakePlans: RetakePlan[];
  expectedGraduationSemester: number;
  isDismissed: boolean;
  lowCreditSemesters?: { semester: number; totalCredits: number; originalCredits: number }[];
}

export function ImpactBanner({ delaySemesters, affectedCourses, retakePlans, expectedGraduationSemester, isDismissed, lowCreditSemesters = [] }: ImpactBannerProps) {
  if (retakePlans.length === 0 && affectedCourses.length === 0 && lowCreditSemesters.length === 0 && !isDismissed) {
    return (
      <div className="all-clear" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'var(--green-100)', color: 'var(--green-800)', borderRadius: 'var(--radius)', marginBottom: '24px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        ไม่มีวิชาที่ติด F ในตอนนี้ — แผนการเรียนยังไม่ได้รับผลกระทบ
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
      
      {/* Domino Animation Banner */}
      {affectedCourses.length > 0 && (
        <div className="impact-banner">
          <div>
            <div className="big-num">+{delaySemesters}</div>
            <div className="big-num-label">ภาคเรียนที่ล่าช้า</div>
          </div>
          <div className="msg">
            การติด F ในวิชาที่เลือกไว้ ส่งผลกระทบต่อเนื่องไปยัง <b>{affectedCourses.length} วิชา</b> ในหลักสูตร 
            ทำให้แผนจบการศึกษาต้องขยับออกไปประมาณ <b>{delaySemesters} ภาคเรียน</b>
          </div>
          <div className="cascade">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="domino" style={{ animationDelay: `${i * 0.09}s` }}></div>
            ))}
          </div>
        </div>
      )}

      {/* Dismissed Status */}
      {isDismissed && (
        <div style={{ padding: '16px', background: 'var(--red-100)', color: 'var(--red-800)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={20} /> พ้นสภาพนักศึกษา (Retire)
          </h3>
          <p>การสอบตกส่งผลกระทบให้แผนการเรียนยืดเยื้อเกิน 8 ปี (คาดว่าจะจบในภาคเรียนที่ {expectedGraduationSemester}) ทำให้พ้นสภาพนักศึกษา</p>
        </div>
      )}

      {/* Affected Pills */}
      {affectedCourses.length > 0 && (
        <div className="affected-list">
          {affectedCourses.map(c => (
            <span key={c.courseCode} className="affected-pill">{c.courseCode}</span>
          ))}
        </div>
      )}

      {/* Detailed Chains & Retake Plans (Old UI preserved below the banner) */}
      {affectedCourses.length > 0 && (
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ marginBottom: '16px' }}>รายละเอียดผลกระทบ</h4>
          <AffectedCourseList courses={affectedCourses} />
        </div>
      )}

      {retakePlans.length > 0 && (
        <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={18} color="var(--blue-500)" /> แผนการลงเรียนแก้ F (ตามกฎเทอมคู่/คี่)
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {retakePlans.map(plan => (
              <li key={plan.courseCode} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--gray-100)' }}>
                <strong>{plan.courseCode} {plan.courseName}</strong>: ลงแก้ได้เร็วที่สุดใน <strong>เทอมที่ {plan.retakeSemester}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lowCreditSemesters.length > 0 && (
        <div style={{ padding: '16px', background: 'var(--yellow-50)', border: '1px solid var(--yellow-500)', borderRadius: 'var(--radius)' }}>
          <h4 style={{ color: 'var(--yellow-800)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> แจ้งเตือน: หน่วยกิตไม่ครบตามเกณฑ์ (น้อยกว่า 18 หน่วยกิต)
          </h4>
          <ul style={{ color: 'var(--yellow-900)', margin: 0, paddingLeft: '24px' }}>
            {lowCreditSemesters.map(sem => (
              <li key={sem.semester} style={{ marginBottom: '4px' }}>
                เทอมที่ {sem.semester} มีเพียง {sem.originalCredits} หน่วยกิต 
                {sem.totalCredits > sem.originalCredits 
                  ? ` (รวมที่ทบมาแล้วเป็น ${sem.totalCredits})` 
                  : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
