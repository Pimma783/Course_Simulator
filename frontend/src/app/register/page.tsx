'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.login);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register(username, password);
      if (data.access_token) {
        setAuth(data.access_token, username);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถสมัครสมาชิกได้ โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--green-50) 0%, var(--gray-100) 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px', background: 'var(--green-500)', color: 'white',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', fontWeight: 'bold', margin: '0 auto 1rem', fontFamily: 'Space Grotesk'
          }}>CS</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--blue-900)' }}>สร้างบัญชีใหม่</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>สมัครสมาชิกเพื่อเริ่มวางแผนการเรียน</p>
        </div>

        {error && (
          <div style={{
            background: 'var(--red-100)', color: 'var(--red-800)', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center',
            border: '1px solid var(--red-500)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="register-username" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              รหัสนักศึกษา (สำหรับล็อกอิน)
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              pattern="\d{10}"
              maxLength={10}
              title="รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก"
              style={{
                width: '100%', padding: '0.875rem 1rem', border: '1.5px solid var(--gray-200)',
                borderRadius: '10px', outline: 'none', transition: 'border-color 0.2s',
                fontSize: '0.9375rem', background: 'var(--gray-50)'
              }}
              placeholder="e.g. 6400000000"
              onFocus={(e) => e.target.style.borderColor = 'var(--green-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--gray-200)'}
            />
          </div>

          <div>
            <label htmlFor="register-password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              รหัสผ่าน
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              title="รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
              style={{
                width: '100%', padding: '0.875rem 1rem', border: '1.5px solid var(--gray-200)',
                borderRadius: '10px', outline: 'none', transition: 'border-color 0.2s',
                fontSize: '0.9375rem', background: 'var(--gray-50)'
              }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = 'var(--green-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--gray-200)'}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', fontSize: '1rem', fontWeight: 600, background: 'var(--green-500)', color: 'white' }}
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" style={{ color: 'var(--green-600)', fontWeight: 600 }}>
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
