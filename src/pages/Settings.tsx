import { useUser } from '../context/UserContext';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
    <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">{title}</h2>
    {children}
  </div>
);

const SettingRow = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0">
    <div>
      <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
      {description && <p className="text-xs text-[var(--color-muted)] mt-0.5">{description}</p>}
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { profile } = useUser();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Manage your account preferences</p>
      </div>

      <SettingSection title="Profile">
        <SettingRow label="Full Name" description="Your display name across the platform">
          <span className="text-sm text-[var(--color-muted)]">
            {profile ? `${profile.firstName} ${profile.lastName}` : '—'}
          </span>
        </SettingRow>
        <SettingRow label="Email Address" description="Used for login and notifications">
          <span className="text-sm text-[var(--color-muted)]">{profile?.email ?? '—'}</span>
        </SettingRow>
        <SettingRow label="Login Method">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 capitalize">
            {profile?.login_method ?? 'email'}
          </span>
        </SettingRow>
        <SettingRow label="Account Status">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30 capitalize">
            {profile?.status ?? 'active'}
          </span>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Notifications">
        <SettingRow label="Email Notifications" description="Receive updates about your sessions">
          <div className="w-10 h-5 rounded-full bg-[var(--color-primary)] relative cursor-not-allowed opacity-70">
            <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
          </div>
        </SettingRow>
        <SettingRow label="Weekly Reports" description="Summary of your weekly activity">
          <div className="w-10 h-5 rounded-full bg-[var(--color-border)] relative cursor-not-allowed opacity-70">
            <div className="absolute left-1 top-0.5 w-4 h-4 bg-[var(--color-muted)] rounded-full" />
          </div>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Appearance">
        <SettingRow label="Theme" description="Interface color scheme">
          <span className="text-sm text-[var(--color-muted)] bg-[var(--color-bg)] px-3 py-1 rounded-lg border border-[var(--color-border)]">
            Dark (default)
          </span>
        </SettingRow>
      </SettingSection>

      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-muted)]">
        <SettingsIcon size={13} />
        Settings are read-only in this demo — this page shows your live profile data pulled from the API.
      </div>
    </div>
  );
};

export default Settings;
