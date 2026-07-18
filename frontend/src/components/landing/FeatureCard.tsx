'use client';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  theme?: 'blue' | 'red' | 'green';
}

export function FeatureCard({ title, description, icon, theme = 'blue' }: FeatureCardProps) {
  // Use CSS variables that exist in globals.css
  const colorMap = {
    blue: { bg: 'var(--blue-100)', color: 'var(--blue-500)' },
    red: { bg: 'var(--red-100)', color: 'var(--red-500)' },
    green: { bg: 'var(--green-100)', color: 'var(--green-500)' }
  };
  
  const colors = colorMap[theme];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: colors.bg,
        color: colors.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
      }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', color: 'var(--blue-900)' }}>{title}</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '14px', lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}
