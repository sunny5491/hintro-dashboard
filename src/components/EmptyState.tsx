import { PhoneOff } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title = 'No calls yet',
  message = 'Start your first session to see call history here.',
  icon,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-inner">
        {icon ?? <PhoneOff size={36} className="text-[var(--color-muted)]" />}
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">{message}</p>
    </div>
  );
};

export default EmptyState;
