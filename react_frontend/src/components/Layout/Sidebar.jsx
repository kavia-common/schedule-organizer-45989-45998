import React from 'react';

// PUBLIC_INTERFACE
export function Sidebar({ appName = 'Calendar', onCreateQuick }) {
  /** Sidebar shows app name and placeholders for filters/navigation. */
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--color-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{appName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Organize your time</div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onCreateQuick} aria-label="Create new event">
        + New Event
      </button>

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
        Filters
      </div>
      <div className="cell" style={{ marginTop: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" defaultChecked aria-label="Show personal events" />
          Personal
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <input type="checkbox" defaultChecked aria-label="Show work events" />
          Work
        </label>
      </div>
    </div>
  );
}
