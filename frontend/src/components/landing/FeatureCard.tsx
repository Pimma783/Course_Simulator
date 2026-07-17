'use client';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="card">
      <div className="feature-icon">{icon}</div>
      <div className="feature-title">{title}</div>
      <p className="feature-desc">{description}</p>
    </div>
  );
}
