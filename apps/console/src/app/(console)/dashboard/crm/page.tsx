import { getContacts, getPipelines } from '@/lib/ghl';

export default async function CRMPage() {
  const [contacts, pipelines] = await Promise.all([getContacts(), getPipelines()]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter bar */}
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search contacts…"
          className="flex-1 max-w-xs rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <select
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <option value="">All Stages</option>
          {pipelines
            .flatMap((p) => p.stages)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>

      {/* Contacts Table */}
      <div
        className="rounded-xl overflow-x-auto"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            All Contacts
          </h2>
        </div>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Tags', 'Stage', 'Value', 'Date'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                className="transition-colors hover:bg-[var(--surface-raised)]"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>
                  {c.name}
                </td>
                <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>
                  {c.email}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: 'var(--surface-raised)',
                          color: 'var(--text-subtle)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
                  >
                    {c.stage}
                  </span>
                </td>
                <td className="px-5 py-3 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {c.value != null ? `$${c.value.toLocaleString()}` : '—'}
                </td>
                <td className="px-5 py-3" style={{ color: 'var(--text-subtle)' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pipeline Kanban */}
      {pipelines.map((pipeline) => (
        <div key={pipeline.id} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {pipeline.name}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pipeline.stages.map((stage) => {
              const stageContacts = contacts.filter((c) => c.stage === stage.name);
              return (
                <div
                  key={stage.id}
                  className="rounded-xl p-4 flex flex-col gap-3 shrink-0 w-52"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {stage.name}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-subtle)' }}
                    >
                      {stageContacts.length}
                    </span>
                  </div>
                  {stageContacts.length === 0 && (
                    <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                      No contacts
                    </p>
                  )}
                  {stageContacts.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg p-3 flex flex-col gap-1"
                      style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)' }}
                    >
                      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                        {c.name}
                      </span>
                      {c.value != null && (
                        <span className="text-xs tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                          ${c.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
