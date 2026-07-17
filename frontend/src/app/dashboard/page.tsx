'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { getSimulationHistory, deleteSimulation } from '../../lib/api';
import { Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [studentId, setStudentId] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const router = useRouter();
  const { isAuthenticated, username } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (username) {
      setStudentId(username);
      fetchHistory();
    }
  }, [isAuthenticated, username, router]);

  const fetchHistory = async () => {
    try {
      const data = await getSimulationHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัตินี้?')) {
      try {
        await deleteSimulation(id);
        setHistory(history.filter(h => h.id !== id));
      } catch (err) {
        console.error('Failed to delete simulation', err);
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--blue-900)' }}>Dashboard แผนการเรียน</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Panel: Simulator Link */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--slate-200)', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '1rem' }}>
            จำลองแผนการเรียน (Simulator)
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            ไปที่หน้าจำลองแผนการเรียน เพื่อคลิกเลือกรายวิชาที่คุณสอบผ่านแล้ว หรือรายวิชาที่ติดเกรดตกค้าง (F) เพื่อคำนวณแผนการเรียนและเทอมที่จะจบการศึกษา
          </p>
          <button 
            onClick={() => router.push('/simulator')}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.75rem 2rem' }}
          >
            ไปที่หน้า Simulator
          </button>
        </div>
      </div>
      
      {/* Simulation History */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--slate-800)', marginBottom: '1rem' }}>ประวัติการจำลองแผนการเรียน</h2>
        
        {loadingHistory ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>กำลังโหลดข้อมูล...</div>
        ) : history.length === 0 ? (
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--slate-200)', textAlign: 'center', color: 'var(--slate-500)' }}>
            ยังไม่มีประวัติการบันทึก
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9375rem' }}>
              <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--slate-700)' }}>วันที่บันทึก</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--slate-700)' }}>วิชาที่ติด F</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--slate-700)' }}>คาดว่าจะจบ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--slate-700)' }}>หมายเหตุ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--slate-700)', textAlign: 'center' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                    <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>
                      {new Date(record.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--slate-800)', maxWidth: '300px' }}>
                      {record.failedCourses && record.failedCourses.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {record.failedCourses.map((c: string) => (
                            <span key={c} style={{ background: 'var(--red-50)', color: 'var(--red-700)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--slate-400)' }}>ไม่มี</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--slate-800)' }}>
                      เทอมที่ <strong>{record.expectedGraduationSemester}</strong>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {record.isDismissed ? (
                        <span style={{ color: 'var(--red-600)', fontWeight: 500 }}>พ้นสภาพ (Retire)</span>
                      ) : record.delaySemesters > 0 ? (
                        <span style={{ color: 'var(--orange-600)' }}>จบช้า {record.delaySemesters} เทอม</span>
                      ) : (
                        <span style={{ color: 'var(--emerald-600)' }}>จบตามปกติ</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        style={{ color: 'var(--red-500)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        title="ลบประวัติ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
