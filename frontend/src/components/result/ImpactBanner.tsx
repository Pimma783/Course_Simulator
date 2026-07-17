import { AlertTriangle, CheckCircle, Clock, CalendarDays, XOctagon } from 'lucide-react';
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
  if (retakePlans.length === 0 && affectedCourses.length === 0 && lowCreditSemesters.length === 0) {
    return (
      <div className="impact-banner success">
        <CheckCircle size={28} color="var(--green-500)" />
        <div>
          <h3>ไม่มีผลกระทบต่อเนื่อง</h3>
          <p>การสอบตกในรายวิชาที่คุณเลือก ไม่ส่งผลกระทบต่อวิชาอื่นๆ และไม่มีวิชาที่ต้องลงแก้</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`impact-banner ${isDismissed ? 'danger' : 'warning'}`} style={isDismissed ? {} : { background: 'var(--yellow-50)', border: '1px solid var(--yellow-500)' }}>
      {isDismissed ? <XOctagon size={28} color="var(--red-500)" /> : <AlertTriangle size={28} color="var(--yellow-600)" />}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: isDismissed ? 'var(--red-800)' : 'var(--yellow-800)', marginBottom: '0.5rem' }}>
          {isDismissed ? '⚠️ พ้นสภาพนักศึกษา (Retire)' : `แผนการเรียนล่าช้า ${delaySemesters} เทอม`}
        </h3>
        <p style={{ color: isDismissed ? 'var(--red-700)' : 'var(--yellow-700)', marginBottom: '1rem' }}>
          {isDismissed 
            ? `การสอบตกส่งผลกระทบให้แผนการเรียนยืดเยื้อเกิน 8 ปี (คาดว่าจะจบในภาคเรียนที่ ${expectedGraduationSemester}) ซึ่งเกินกว่าระยะเวลาที่มหาวิทยาลัยกำหนด ทำให้พ้นสภาพนักศึกษา` 
            : `การสอบตกส่งผลให้ต้องเรียนแก้ตามภาคเรียนคู่/คี่ที่กำหนด คาดว่าจะจบการศึกษาในภาคเรียนที่ ${expectedGraduationSemester}`
          }
        </p>

        {retakePlans.length > 0 && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={16} /> แผนการลงเรียนแก้ F (ตามกฎคู่/คี่)
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
              {retakePlans.map(plan => (
                <li key={plan.courseCode} style={{ marginBottom: '0.25rem' }}>
                  <strong>{plan.courseCode} {plan.courseName}</strong>: ลงแก้ได้เร็วที่สุดใน <strong>ภาคเรียนที่ {plan.retakeSemester}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {affectedCourses.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> ผลกระทบลูกโซ่ (เรียนช้าลง)
            </h4>
            <AffectedCourseList courses={affectedCourses} />
          </div>
        )}

        {lowCreditSemesters.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', borderLeft: '4px solid var(--orange-400)' }}>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--orange-800)' }}>
              <AlertTriangle size={16} /> แจ้งเตือน: หน่วยกิตไม่ครบตามเกณฑ์ (น้อยกว่า 18 หน่วยกิต)
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: 'var(--orange-900)' }}>
              {lowCreditSemesters.map(sem => (
                <li key={sem.semester} style={{ marginBottom: '0.25rem' }}>
                  ภาคเรียนที่ <strong>{sem.semester}</strong> มีเพียง <strong>{sem.originalCredits}</strong> หน่วยกิต 
                  {sem.totalCredits > sem.originalCredits 
                    ? ` (ทบจากเทอมก่อนหน้าแล้วรวมเป็น ${sem.totalCredits} หน่วยกิต แต่ก็ยังไม่ถึง 18)` 
                    : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
