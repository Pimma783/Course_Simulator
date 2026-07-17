'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSimulationResult } from '../../hooks/useSimulationResult';
import { EligibilityGrid } from '../../components/result/EligibilityGrid';
import { ImpactBanner } from '../../components/result/ImpactBanner';
import { ExportButtons } from '../../components/result/ExportButtons';

export default function ResultPage() {
  const { eligibility, impact, status } = useSimulationResult();

  if (status === 'loading' || !eligibility || !impact) {
    return <div className="page-center"><div className="loading-text">กำลังประมวลผลผลลัพธ์...</div></div>;
  }

  if (status === 'error') {
    return (
      <div className="page-center">
        <div style={{ color: 'var(--red-500)' }}>เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง</div>
        <Link href="/simulator" className="btn btn-outline">กลับไปหน้าจำลอง</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="result-header">
        <Link href="/simulator" className="back-link">
          <ArrowLeft size={18} /> กลับไปหน้าจำลอง
        </Link>
        <h1>ผลการประมวลผล</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', margin: 0 }}>เทอมเป้าหมาย: เทอมที่ {eligibility.targetSemester}</p>
        </div>
      </div>

      <div className="animate-in">
        <ImpactBanner 
          delaySemesters={impact.delaySemesters} 
          affectedCourses={impact.affectedCourses} 
          retakePlans={impact.retakePlans}
          expectedGraduationSemester={impact.expectedGraduationSemester}
          isDismissed={impact.isDismissed}
          lowCreditSemesters={impact.lowCreditSemesters}
        />

        <div className="eligibility-section">
          <h2 className="section-title">สิทธิ์การลงทะเบียนเรียน</h2>
          <EligibilityGrid eligibleCourses={eligibility.eligibleCourses} blockedCourses={eligibility.blockedCourses} />
        </div>

        <ExportButtons eligibility={eligibility} impact={impact} />
      </div>
    </div>
  );
}
