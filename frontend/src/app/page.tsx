'use client';

import { Hero } from '../components/landing/Hero';
import { FeatureCard } from '../components/landing/FeatureCard';
import { BookOpen, AlertTriangle, Zap, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Hero />
      <section className="feature-grid">
        <FeatureCard
          title="ตรวจสอบเงื่อนไข"
          description="เช็คว่าคุณสามารถลงทะเบียนเรียนวิชาใดได้บ้างในเทอมถัดไป ตามวิชาที่คุณสอบผ่านแล้ว"
          icon={<BookOpen size={22} />}
        />
        <FeatureCard
          title="จำลองผลกระทบโดมิโน"
          description="ดูว่าถ้าหากสอบตกวิชาสำคัญ จะส่งผลกระทบต่อเนื่องทำให้แผนการเรียนล่าช้าไปกี่เทอม"
          icon={<AlertTriangle size={22} />}
        />
        <FeatureCard
          title="วางแผนรวดเร็ว"
          description="ใช้งานง่ายเพียงแค่คลิกเลือกสถานะรายวิชา ไม่ต้องรอให้ถึงวันลงทะเบียนจริง"
          icon={<Zap size={22} />}
        />
      </section>
    </div>
  );
}
