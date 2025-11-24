import React, { useCallback } from 'react';

// PUBLIC_INTERFACE
export function Topbar({ theme = 'light', onToggleTheme, onCreateQuick, query = '', onChangeQuery }) {
  /** Topbar with search, quick add, and theme toggle. */
  const onInput = useCallback((e) => {
    onChangeQuery && onChangeQuery(e.target.value);
  }, [onChangeQuery]);

  return (
    <div className="topbar" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
        <input
          className="input"
          placeholder="Search events by title, description or tag…"
          aria-label="Search events"
          value={query}
          onChange={onInput}
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
