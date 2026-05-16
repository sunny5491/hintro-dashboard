import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PhoneCall,
  Settings,
  MessageSquarePlus,
  ChevronDown,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import type { UserId } from '../context/UserContext';
import FeedbackModal from './FeedbackModal';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/call-history', label: 'Call History', icon: PhoneCall },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const { userId, setUserId, profile, isLoading } = useUser();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = profile
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : '??';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
            Hintro
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] shadow-sm'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2 border-t border-[var(--color-border)] pt-3">
        {/* Feedback button */}
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-all duration-150"
        >
          <MessageSquarePlus size={18} />
          Give Feedback
        </button>

        {/* User switcher */}
        <div className="relative">
          <button
            onClick={() => setShowSwitcher((s) => !s)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-all duration-150"
          >
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                userId === 'u2' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'
              )}
            />
            <span>Viewing as: <strong className="text-[var(--color-text)]">{userId === 'u2' ? 'Active User (u2)' : 'New User (u1)'}</strong></span>
            <ChevronDown size={14} className={clsx('ml-auto transition-transform', showSwitcher && 'rotate-180')} />
          </button>
          {showSwitcher && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-xl z-50">
              {(['u1', 'u2'] as UserId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => { setUserId(id); setShowSwitcher(false); }}
                  className={clsx(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    userId === id
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
                  )}
                >
                  {id === 'u1' ? '🆕 New User (u1) — Empty State' : '✅ Active User (u2) — Populated'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--color-surface)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {isLoading ? '…' : initials}
          </div>
          {isLoading ? (
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-[var(--color-border)] rounded animate-pulse w-24" />
              <div className="h-2.5 bg-[var(--color-border)] rounded animate-pulse w-32" />
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                {profile ? `${profile.firstName} ${profile.lastName}` : '—'}
              </p>
              <p className="text-xs text-[var(--color-muted)] truncate">{profile?.email ?? '—'}</p>
            </div>
          )}
          {profile?.login_method && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-border)] text-[var(--color-muted)] shrink-0 capitalize">
              {profile.login_method}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden w-9 h-9 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:relative z-40 h-full w-64 flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-300 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
};

export default Sidebar;
