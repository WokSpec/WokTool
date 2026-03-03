export default function SettingsPage() {
  const hasGHL = Boolean(process.env.GHL_API_KEY);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Profile */}
      <section className="rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Profile</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Display Name</span>
            <input
              defaultValue="Agency Owner"
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Email</span>
            <input
              defaultValue="owner@wokspec.org"
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </label>
        </div>
        <button
          className="self-start text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          Save Changes
        </button>
      </section>

      {/* GHL Connection */}
      <section className="rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: 'var(--text)' }}>GoHighLevel Connection</h2>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={hasGHL
              ? { backgroundColor: 'rgba(34,197,94,0.12)', color: 'var(--success)' }
              : { backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--warning)' }
            }
          >
            {hasGHL ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        {!hasGHL && (
          <div
            className="rounded-xl p-6 flex flex-col items-center gap-3 text-center"
            style={{ backgroundColor: 'var(--bg)', border: '2px dashed var(--border)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: 'var(--surface-raised)' }}
            >
              🔌
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Connect GoHighLevel</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Link your GHL account to sync contacts, pipelines, and automations.
              </p>
            </div>
            <a
              href="https://app.gohighlevel.com/oauth/chooselocation?client_id=wokspec"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              Connect GoHighLevel
            </a>
          </div>
        )}

        {hasGHL && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            GHL API key is configured. Your contacts, pipelines, and automations are synced live.
          </p>
        )}
      </section>

      {/* Eral API */}
      <section className="rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Eral AI</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Eral API URL</span>
          <input
            defaultValue={process.env.ERAL_API_URL ?? 'https://eral.wokspec.org/api'}
            readOnly
            className="rounded-lg px-3 py-2 text-sm outline-none font-mono"
            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          />
        </label>
      </section>

      {/* Notifications */}
      <section className="rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Notifications</h2>
        {[
          { label: 'New contact added', desc: 'Get notified when a new contact is created' },
          { label: 'Automation triggered', desc: 'Get notified when an automation fires' },
          { label: 'Deal stage change', desc: 'Get notified when a deal moves to a new stage' },
        ].map(({ label, desc }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div
                className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:rounded-full after:w-4 after:h-4 after:transition-transform"
                style={{
                  backgroundColor: 'var(--accent)',
                }}
              />
            </label>
          </div>
        ))}
      </section>
    </div>
  );
}
