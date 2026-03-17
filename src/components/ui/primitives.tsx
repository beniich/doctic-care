import React from 'react';

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'gold' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string; // Pour permettre la surcharge Tailwind
}
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const styles: Record<string, React.CSSProperties> = {
    emerald: { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '0.5px solid rgba(16,185,129,0.3)' },
    gold:    { background: 'rgba(212,168,67,0.12)',  color: '#d4a843', border: '0.5px solid rgba(212,168,67,0.3)' },
    danger:  { background: 'rgba(239,68,68,0.12)',   color: '#f87171', border: '0.5px solid rgba(239,68,68,0.3)' },
    warning: { background: 'rgba(245,158,11,0.12)',  color: '#fbbf24', border: '0.5px solid rgba(245,158,11,0.3)' },
    info:    { background: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: '0.5px solid rgba(59,130,246,0.3)' },
    default: { background: 'rgba(255,255,255,0.06)', color: '#8b9ab0', border: '0.5px solid rgba(255,255,255,0.1)' },
  };
  return (
    <span style={{
      ...styles[variant],
    }} className={`inline-flex items-center rounded-full font-medium tracking-wide whitespace-nowrap ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'} ${className}`}>
      {children}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps { name: string; size?: number; color?: string; className?: string; }
export const Avatar: React.FC<AvatarProps> = ({ name, size = 36, color = '#10b981', className = '' }) => {
  const initials = name ? name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';
  return (
    <div style={{
      width: size, height: size,
      background: `${color}22`, border: `1px solid ${color}44`,
      fontSize: size * 0.35, color,
    }} className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}
export const Card: React.FC<CardProps> = ({ children, style, hover, onClick, className = '' }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      className={`rounded-2xl p-5 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: hovered ? '#1c2330' : '#161b22', // Correspond à var(--bg-elevated) et var(--bg-surface)
        border: `0.5px solid ${hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
        ...style,
      }}>
      {children}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string | number;
  sub?: string; trend?: number;
  icon?: React.ReactNode; color?: string;
  delay?: number;
  className?: string;
}
export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, trend, icon, color = '#10b981', delay = 0, className = '' }) => (
  <div
    className={`bg-[#161b22] border border-white/10 rounded-2xl p-5 flex flex-col gap-1 animate-fade-up delay-${delay} ${className}`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-secondary font-medium uppercase tracking-widest">{label}</span>
      {icon && (
        <div style={{
          background: `${color}18`,
          color,
        }} className="w-8 h-8 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
    <div className="font-serif text-3xl font-medium text-white leading-none">
      {value}
    </div>
    {(sub || trend !== undefined) && (
      <div className="flex items-center gap-1.5 mt-1">
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-primary' : 'text-danger'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="text-xs text-muted">{sub}</span>}
      </div>
    )}
  </div>
);
