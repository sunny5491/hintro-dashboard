import {
  PhoneCall,
  Clock,
  BrainCircuit,
  CalendarCheck,
  CreditCard,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useUser } from '../context/UserContext';
import StatCard from '../components/StatCard';
import UsageBar from '../components/UsageBar';
import ErrorBanner from '../components/ErrorBanner';
import { formatDuration, formatDate } from '../utils/formatters';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const SubscriptionBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active: 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30',
    inactive: 'bg-[var(--color-muted)]/15 text-[var(--color-muted)] border-[var(--color-muted)]/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
    trialing: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30',
  };
  const cls = map[status?.toLowerCase()] ?? map.inactive;
  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize', cls)}>
      {status}
    </span>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-5">
    <h2 className="text-base font-semibold text-[var(--color-text)]">{title}</h2>
    {subtitle && <p className="text-sm text-[var(--color-muted)] mt-0.5">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const { profile } = useUser();
  const { dashboardData, callStats, isLoading, error, refetch } = useDashboard();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [isLive, refetch]);

  const firstName = profile?.firstName ?? '';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {greeting}{firstName ? `, ${firstName}` : ''}! 👋
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Here's what's happening with your account.
          </p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={clsx(
            "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border",
            isLive 
              ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30" 
              : "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:bg-[var(--color-bg)]"
          )}
        >
          {isLive ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
          ) : (
            <TrendingUp size={13} />
          )}
          Live data
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Stats row */}
      <div>
        <SectionHeader title="Overview" subtitle="Your session activity at a glance" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sessions"
            value={callStats?.totalSessions ?? 0}
            icon={PhoneCall}
            isLoading={isLoading}
            iconColor="text-[var(--color-primary)]"
            iconBg="bg-[var(--color-primary)]/10"
          />
          <StatCard
            title="Avg. Duration"
            value={callStats ? formatDuration(callStats.averageDuration) : '—'}
            icon={Clock}
            isLoading={isLoading}
            iconColor="text-cyan-400"
            iconBg="bg-cyan-400/10"
          />
          <StatCard
            title="AI Interactions"
            value={callStats?.totalAIInteractions ?? 0}
            icon={BrainCircuit}
            isLoading={isLoading}
            iconColor="text-violet-400"
            iconBg="bg-violet-400/10"
          />
          <StatCard
            title="Last Session"
            value={
              callStats?.lastSession?.[0]
                ? formatDate(callStats.lastSession[0])
                : '—'
            }
            icon={CalendarCheck}
            isLoading={isLoading}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-400/10"
          />
        </div>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
          <SectionHeader title="Usage" subtitle="Your current plan usage" />
          <div className="space-y-5">
            <UsageBar
              label="KB Files"
              used={dashboardData?.usage.kb_files.used ?? 0}
              limit={dashboardData?.usage.kb_files.limit ?? 100}
              percentage={dashboardData?.usage.kb_files.percentage ?? 0}
              isLoading={isLoading}
            />
            <UsageBar
              label="Vocab Terms"
              used={dashboardData?.usage.vocab_terms ?? 0}
              limit={500}
              percentage={
                dashboardData ? Math.round((dashboardData.usage.vocab_terms / 500) * 100) : 0
              }
              isLoading={isLoading}
            />
            <UsageBar
              label="Notes"
              used={dashboardData?.usage.notes ?? 0}
              limit={200}
              percentage={
                dashboardData ? Math.round((dashboardData.usage.notes / 200) * 100) : 0
              }
              isLoading={isLoading}
            />
          </div>


        </div>

        {/* Subscription */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col">
          <SectionHeader title="Subscription" />
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-[var(--color-border)] rounded w-32" />
              <div className="h-4 bg-[var(--color-border)] rounded w-24" />
              <div className="h-4 bg-[var(--color-border)] rounded w-20" />
            </div>
          ) : dashboardData?.subscription ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-[var(--color-text)] capitalize">
                  {dashboardData.subscription.plan}
                </span>
                <SubscriptionBadge status={dashboardData.subscription.status} />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={14} className="text-[var(--color-muted)] shrink-0" />
                  <span className="text-[var(--color-muted)]">Billing:</span>
                  <span className="text-[var(--color-text)] font-medium capitalize">
                    {dashboardData.subscription.billing_cycle}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
                <button className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold rounded-lg hover:bg-[var(--color-bg)] transition-colors">
                  Manage Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4">
                <CreditCard size={24} className="text-[var(--color-muted)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text)]">No active subscription</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">Upgrade to unlock more features</p>
              <button className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-900/30">
                View Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <SectionHeader title="Recent Sessions" subtitle="Your last 3 call sessions" />
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 animate-pulse flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-border)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-[var(--color-border)] rounded w-40" />
                  <div className="h-3 bg-[var(--color-border)] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : callStats?.lastSession && callStats.lastSession.length > 0 ? (
          <div className="space-y-3">
            {callStats.lastSession.slice(0, 3).map((dateStr, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <CalendarDays size={16} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Session {i + 1}</p>
                  <p className="text-xs text-[var(--color-muted)]">{formatDate(dateStr)}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs text-[var(--color-muted)] bg-[var(--color-bg)] px-2.5 py-1 rounded-lg">
                    #{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-3">
              <CalendarDays size={20} className="text-[var(--color-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text)]">No sessions yet</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Your recent call sessions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
