import { PhoneCall } from 'lucide-react';
import { useCallSessions } from '../hooks/useCallSessions';
import CallTable from '../components/CallTable';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';

const CallHistory = () => {
  const { data, isLoading, error, refetch } = useCallSessions(10);

  const sessions = data?.callSessions ?? [];
  const pagination = data?.pagination;
  const isEmpty = !isLoading && sessions.length === 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Call History</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {pagination
              ? `Showing ${sessions.length} of ${pagination.totalCount} sessions`
              : 'Your recent call sessions'}
          </p>
        </div>
        {pagination && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg">
            <span>
              Page {pagination.page} / {pagination.totalPages}
            </span>
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Empty state for u1 */}
      {isEmpty ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
          <EmptyState
            title="No calls yet"
            message="Start your first session to see call history here. Your calls will appear with detailed stats and AI interaction counts."
            icon={
              <PhoneCall size={36} className="text-[var(--color-muted)]" />
            }
          />
        </div>
      ) : (
        <CallTable sessions={sessions} isLoading={isLoading} />
      )}

      {/* Pagination info */}
      {pagination && sessions.length > 0 && (
        <div className="flex items-center justify-between text-sm text-[var(--color-muted)] px-1">
          <span>
            {pagination.totalCount} total session{pagination.totalCount !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3">
            <span>
              {pagination.hasPrevPage && '← '}
              Page {pagination.page} of {pagination.totalPages}
              {pagination.hasNextPage && ' →'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
