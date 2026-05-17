import type { CallSession } from '../api';
import { formatDuration, formatDate } from '../utils/formatters';
import { PhoneCall, Users } from 'lucide-react';
import clsx from 'clsx';

interface CallTableProps {
  sessions: CallSession[];
  isLoading?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    completed: 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30',
    ended: 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30',
    active: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30',
    failed: 'bg-red-500/15 text-red-400 border-red-500/30',
    missed: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/30',
  };
  const cls = map[status?.toLowerCase()] ?? 'bg-[var(--color-border)] text-[var(--color-muted)]';
  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize', cls)}>
      {status}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3.5 bg-[var(--color-border)] rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const CallTable = ({ sessions, isLoading = false }: CallTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Client', 'Description', 'Duration', 'Date', 'Status', 'Participants'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {['Client', 'Description', 'Duration', 'Date', 'Status', 'Participants'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {sessions.map((session) => (
              <tr key={session._id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                      <PhoneCall size={14} className="text-[var(--color-primary)]" />
                    </div>
                    <span className="font-medium text-[var(--color-text)] truncate max-w-[120px]">
                      {session.client || '—'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[var(--color-muted)] max-w-[200px]">
                  <span className="truncate block">{session.description || '—'}</span>
                </td>
                <td className="px-4 py-4 text-[var(--color-text)] font-medium whitespace-nowrap">
                  {formatDuration(session.total_duration_seconds)}
                </td>
                <td className="px-4 py-4 text-[var(--color-muted)] whitespace-nowrap">
                  {formatDate(session.started_at)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={session.status} />
                </td>
                <td className="px-4 py-4">
                  {session.participants?.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-[var(--color-muted)] text-xs">
                      <Users size={13} />
                      <span>{session.participants.map((p) => p.name).join(', ')}</span>
                    </div>
                  ) : (
                    <span className="text-[var(--color-muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallTable;
