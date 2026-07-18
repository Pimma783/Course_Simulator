'use client';

import { Hero } from '../components/landing/Hero';
import { FeatureCard } from '../components/landing/FeatureCard';
import { Layers, AlertTriangle, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Hero />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', padding: '60px 0' }}>
        <FeatureCard
          title="ตรวจสอบสิทธิ์อัตโนมัติ"
          description="ระบบจะคำนวณวิชาบังคับก่อนให้ทันที แจ้งเตือนวิชาที่ลงไม่ได้พร้อมเหตุผล"
          icon={<Layers size={24} />}
          theme="blue"
        />
        <FeatureCard
          title="ผลกระทบโดมิโน"
          description="ประเมินความเสี่ยงล่วงหน้า หากสอบตกวิชาแกน จะกระทบการเรียนกี่เทอม"
          icon={<AlertTriangle size={24} />}
          theme="red"
        />
        <FeatureCard
          title="ส่งออกเป็นรายงาน"
          description="ดาวน์โหลดผลการจำลองเป็น PDF หรือ CSV เพื่อปรึกษาอาจารย์ที่ปรึกษา"
          icon={<FileText size={24} />}
          theme="green"
        />
      </section>
    </div>
  );
}
