import Link from 'next/link';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-badge">ระบบจำลองแผนการเรียน</div>
      <h1>วางแผนการเรียน CS<br />อย่างมั่นใจ</h1>
      <p>ตรวจสอบเงื่อนไขรายวิชา ดูผลกระทบจากการสอบตก และวางแผนการลงทะเบียนล่วงหน้าได้ในคลิกเดียว</p>
      <Link href="/simulator" className="btn btn-primary btn-lg">
        เริ่มจำลองแผนการเรียน →
      </Link>
    </section>
  );
}
