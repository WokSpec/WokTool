'use client';

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-4xl font-bold select-none"
            style={{ color: 'var(--accent)' }}
            aria-label="WokSpec"
          >
            ✦
          </span>
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            WokSpec
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Sign in to Console
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            Manage your clients and automations
          </p>
        </div>

        <a
          href="https://api.wokspec.org/auth/github?redirect=https://console.wokspec.org/dashboard"
          className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#fff',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--accent-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--accent)';
          }}
        >
          Continue with WokSpec
        </a>

        <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>
          By signing in you agree to the WokSpec terms of service.
        </p>
      </div>
    </div>
  );
}
