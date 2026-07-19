'use client';

import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Menu, X } from 'lucide-react';

import { useEffect, useState } from 'react';

export function Navbar() {
  const { isAuthenticated, username, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
        
        {/* Hamburger Icon for Mobile */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu & Mobile Slide-down */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {mounted && (
            isAuthenticated ? (
              <>
                <Link href="/dashboard" className="navbar-link">Dashboard</Link>
                <Link href="/simulator" className="navbar-link">เริ่มจำลอง</Link>
                <div className="navbar-user-section">
                  <span className="navbar-username">
                    <User size={16} /> {username}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline logout-btn">
                    <LogOut size={14} /> ออกจากระบบ
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-link login-link">เข้าสู่ระบบ</Link>
                <Link href="/register" className="btn btn-primary register-btn">สมัครสมาชิก</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
