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
        <Link href="/" className="navbar-brand">
          <span>CS</span> Course Simulator
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
