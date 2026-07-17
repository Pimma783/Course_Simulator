'use client';

import { useState } from 'react';
import { Download, FileText, Save } from 'lucide-react';
import { saveSimulation } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { EligibilityResult, ImpactResult } from '../../lib/types';

interface ExportButtonsProps {
  eligibility: EligibilityResult;
  impact: ImpactResult;
}

export function ExportButtons({ eligibility, impact }: ExportButtonsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!impact) return;
    setIsSaving(true);
    try {
      await saveSimulation({
        failedCourses: impact.retakePlans ? impact.retakePlans.map(p => p.courseCode) : [],
        expectedGraduationSemester: impact.expectedGraduationSemester,
        delaySemesters: impact.delaySemesters,
        isDismissed: impact.isDismissed,
      });
      alert('บันทึกผลการจำลองสำเร็จ สามารถดูได้ที่หน้า Dashboard');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (!eligibility || !impact) return;
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "รายงานผลการจำลองแผนการเรียน\n\n";
    csvContent += `คาดว่าจะจบการศึกษาในภาคเรียนที่,${impact.expectedGraduationSemester}\n`;
    csvContent += `พ้นสภาพนักศึกษา (Retire),${impact.isDismissed ? 'ใช่' : 'ไม่ใช่'}\n\n`;
    
    csvContent += "สิทธิ์การลงทะเบียนเรียนในเทอมถัดไป\n";
    csvContent += "รหัสวิชา,ชื่อวิชา,สถานะ\n";
    
    eligibility.eligibleCourses.forEach(c => {
      csvContent += `${c.courseCode},${c.courseName},ลงทะเบียนได้\n`;
    });
    
    eligibility.blockedCourses.forEach(b => {
      csvContent += `${b.course.courseCode},${b.course.courseName},ติดเงื่อนไขวิชาบังคับก่อน: ${b.blockedBy.join(' ')}\n`;
    });

    if (impact.retakePlans.length > 0) {
      csvContent += "\nแผนการลงเรียนแก้ F\n";
      csvContent += "รหัสวิชา,ชื่อวิชา,ต้องแก้ในภาคเรียนที่\n";
      impact.retakePlans.forEach(p => {
        csvContent += `${p.courseCode},${p.courseName},${p.retakeSemester}\n`;
      });
    }

    if (impact.affectedCourses.length > 0) {
      csvContent += "\nวิชาที่ได้รับผลกระทบต่อเนื่อง (โดมิโน)\n";
      csvContent += "รหัสวิชา,ชื่อวิชา\n";
      impact.affectedCourses.forEach(c => {
        csvContent += `${c.courseCode},${c.courseName}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "study_plan_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="export-row no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
      <button className="btn btn-outline" onClick={handleExportCSV}>
        <FileText size={18} /> Export CSV
      </button>
      <button className="btn btn-primary" onClick={handleExportPDF}>
        <Download size={18} /> Export PDF
      </button>
      <button onClick={handleSave} disabled={isSaving} className="btn" style={{ background: 'var(--green-500)', color: 'white', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
        <Save size={18} /> {isSaving ? 'กำลังบันทึก...' : 'บันทึกผลลง Dashboard'}
      </button>
    </div>
  );
}
