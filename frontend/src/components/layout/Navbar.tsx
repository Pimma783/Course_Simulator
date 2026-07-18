'use client';

import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

import { useEffect, useState } from 'react';

export function Navbar() {
  const { isAuthenticated, username, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 700, color: 'var(--blue-900)' }}>
          <svg viewBox="0 0 26 26" fill="none" style={{ width: '26px', height: '26px' }}>
            <circle cx="6" cy="20" r="3.2" fill="#1F9D66" />
            <circle cx="13" cy="6" r="3.2" fill="#6C5CE7" />
            <circle cx="20" cy="20" r="3.2" fill="#E14F3D" />
            <path d="M6 17 L13 9 M13 9 L20 17" stroke="#DADCE8" strokeWidth="1.6" />
          </svg>
          Course Simulator
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {mounted && (
            isAuthenticated ? (
              <>
                <Link href="/dashboard" className="navbar-link">Dashboard</Link>
                <Link href="/simulator" className="navbar-link">เริ่มจำลอง</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} /> {username}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                    <LogOut size={14} /> ออกจากระบบ
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-link" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>เข้าสู่ระบบ</Link>
                <Link href="/register" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.875rem' }}>สมัครสมาชิก</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
