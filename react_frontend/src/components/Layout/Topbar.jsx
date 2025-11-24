import React from 'react';

// PUBLIC_INTERFACE
export function Topbar({ theme = 'light', onToggleTheme, onCreateQuick }) {
  /** Topbar with search placeholder, quick add, and theme toggle. */
  return (
    <div className="topbar" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
        <input
          className="input"
          placeholder="Search events (placeholder)"
          aria-label="Search events"
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button className="btn btn-secondary" onClick={onCreateQuick} aria-label="Quick add event">
          + Add
        </button>
      </div>
    </div>
  );
}
