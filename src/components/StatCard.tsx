import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-[var(--color-primary)]',
  iconBg = 'bg-[var(--color-primary)]/10',
  subtitle,
  isLoading = false,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-border)]" />
        </div>
        <div className="h-7 bg-[var(--color-border)] rounded-lg w-24 mb-2" />
        <div className="h-4 bg-[var(--color-border)] rounded w-32" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-primary)]/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--color-text)] tracking-tight">{value}</p>
      <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">
        {title}
        {(value === 0 || value === '—') && (
          <span className="block text-xs font-normal text-[var(--color-muted)]/70 mt-1">No data yet</span>
        )}
      </p>
      {subtitle && (
        <p className="text-xs text-[var(--color-muted)]/70 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
