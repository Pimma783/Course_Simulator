import Link from 'next/link';

export function Hero() {
  return (
    <section className="hero" style={{ paddingBottom: '0' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-1px' }}>
          วางแผนลงทะเบียนเรียน<br />โดยไม่ต้องเดาอีกต่อไป
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '18px', marginBottom: '32px', lineHeight: 1.6 }}>
          ตรวจสอบเงื่อนไขรายวิชาต่อเนื่องแบบอัตโนมัติ<br />เห็นผลกระทบทันทีเมื่อแผนการเรียนเปลี่ยน
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/simulator" className="btn btn-primary btn-lg" style={{ padding: '12px 24px', fontSize: '16px' }}>
            เริ่มจำลองแผนการเรียน
          </Link>
          <Link href="/simulator" className="btn btn-outline btn-lg" style={{ padding: '12px 24px', fontSize: '16px' }}>
            ดูรายวิชาทั้งหมด
          </Link>
        </div>
      </div>

      {/* Hero Graphic */}
      <div style={{ margin: '60px auto 0', maxWidth: '800px', position: 'relative', height: '240px' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 240" fill="none" style={{ overflow: 'visible' }}>
          {/* Background Grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--gray-200)" strokeWidth="0.5" />
          </pattern>
          <rect width="800" height="240" fill="url(#grid)" rx="24" />
          
          {/* Connections */}
          <path d="M200 120 C 300 120, 300 60, 400 60" stroke="var(--blue-500)" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M200 120 C 300 120, 300 180, 400 180" stroke="var(--blue-500)" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M400 60 C 500 60, 500 120, 600 120" stroke="var(--green-500)" strokeWidth="2" />
          
          {/* Nodes */}
          <g transform="translate(200,120)">
            <circle r="28" fill="var(--white)" stroke="var(--blue-500)" strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="var(--blue-900)">CS101</text>
          </g>
          <g transform="translate(400,60)">
            <circle r="28" fill="var(--white)" stroke="var(--gray-200)" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="var(--gray-500)">CS102</text>
          </g>
          <g transform="translate(400,180)">
            <circle r="28" fill="var(--red-100)" stroke="var(--red-500)" strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="var(--red-500)">CS201</text>
          </g>
          <g transform="translate(600,120)">
            <circle r="28" fill="var(--green-100)" stroke="var(--green-500)" strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" fill="var(--green-800)">CS202</text>
          </g>
        </svg>
      </div>
    </section>
  );
}
