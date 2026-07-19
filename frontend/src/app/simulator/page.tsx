'use client';

import { useEffect, useState, useMemo } from 'react';
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
    // Before passing to simulation input, we should probably strip out statuses of locked courses
    // But the backend simulation logic also enforces prerequisites, so it's safe either way.
    const input = toSimulationInput();
    setStoreInput(input);
    router.push('/result');
  };

  const lockedCourses = useMemo(() => {
    const locked = new Set<string>();
    let changed = true;
    while (changed) {
      changed = false;
      for (const course of courses) {
        if (!locked.has(course.courseCode)) {
          // Lock if any prerequisite is NOT passed (meaning it is 'failed' or 'none'/unselected)
          const isLocked = course.prerequisites.some(pre => 
            status[pre] !== 'passed' || locked.has(pre)
          );
          if (isLocked) {
            locked.add(course.courseCode);
            changed = true;
          }
        }
      }
    }
    return locked;
  }, [courses, status]);

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

  const allSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const displayedSemesters = allSemesters.slice(0, currentSemester);
  const coursesBySemester: Record<number, Course[]> = {};
  displayedSemesters.forEach(s => coursesBySemester[s] = []);
  courses.forEach(c => { if (coursesBySemester[c.semester]) coursesBySemester[c.semester].push(c); });

  return (
    <div className="container">
      <div className="sim-header">
        <h1>จำลองแผนการเรียน</h1>
        <p>คลิกที่รายวิชาเพื่อเปลี่ยนสถานะ: ยังไม่ลง → ผ่านแล้ว → ติด F</p>
      </div>
      <div className="sim-grid">
        {displayedSemesters.map(s => (
          <SemesterColumn 
            key={s} 
            semester={s} 
            courses={coursesBySemester[s]} 
            statusMap={status} 
            lockedCourses={lockedCourses}
            onCourseClick={cycleStatus} 
          />
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
