interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  percentage: number;
  isLoading?: boolean;
}

const UsageBar = ({ label, used, limit, percentage, isLoading = false }: UsageBarProps) => {
  const pct = Math.min(Math.max(percentage, 0), 100);
  const color =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-primary)]';

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between mb-2">
          <div className="h-3.5 bg-[var(--color-border)] rounded w-24" />
          <div className="h-3.5 bg-[var(--color-border)] rounded w-16" />
        </div>
        <div className="h-2 bg-[var(--color-border)] rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        <span className="text-xs text-[var(--color-muted)]">
          {used} / {limit} <span className="text-[var(--color-muted)]/60">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default UsageBar;
