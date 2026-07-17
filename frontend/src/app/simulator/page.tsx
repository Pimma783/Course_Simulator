'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '../../lib/types';
import { getCourses } from '../../lib/api';
import { useCourseSelection } from '../../hooks/useCourseSelection';
import { useSimulationStore } from '../../store/simulationStore';
import { useAuthStore } from '../../store/authStore';
import { SemesterColumn } from '../../components/simulator/SemesterColumn';
import { StickySummaryBar } from '../../components/simulator/StickySummaryBar';

export default function SimulatorPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const setStoreInput = useSimulationStore((state) => state.setInput);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    status,
    cycleStatus,
    toSimulationInput,
    passedCount,
    failedCount,
    currentSemester,
    setCurrentSemester
  } = useCourseSelection();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    getCourses()
      .then(data => { setCourses(data); setLoading(false); })
      .catch(err => { console.error(err); setError('ไม่สามารถโหลดข้อมูลรายวิชาได้ โปรดลองใหม่อีกครั้ง'); setLoading(false); });
  }, [isAuthenticated, router]);

  const handleProcess = () => {
    const input = toSimulationInput();
    setStoreInput(input);
    router.push('/result');
  };

  if (loading) {
    return <div className="page-center"><div className="loading-text">กำลังโหลดรายวิชา...</div></div>;
  }

  if (error) {
    return (
      <div className="page-center">
        <div style={{ color: 'var(--red-500)' }}>{error}</div>
        <button className="btn btn-outline" onClick={() => window.location.reload()}>ลองใหม่</button>
      </div>
    );
  }

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const coursesBySemester: Record<number, Course[]> = {};
  semesters.forEach(s => coursesBySemester[s] = []);
  courses.forEach(c => { if (coursesBySemester[c.semester]) coursesBySemester[c.semester].push(c); });

  return (
    <div className="container">
      <div className="sim-header">
        <h1>จำลองแผนการเรียน</h1>
        <p>คลิกที่รายวิชาเพื่อเปลี่ยนสถานะ: ยังไม่ลง → ผ่านแล้ว → ติด F</p>
      </div>
      <div className="sim-grid">
        {semesters.map(s => (
          <SemesterColumn key={s} semester={s} courses={coursesBySemester[s]} statusMap={status} onCourseClick={cycleStatus} />
        ))}
      </div>
      <StickySummaryBar
        passedCount={passedCount}
        failedCount={failedCount}
        currentSemester={currentSemester}
        onSemesterChange={setCurrentSemester}
        onProcess={handleProcess}
      />
    </div>
  );
}
