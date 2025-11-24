import React, { useCallback, useMemo, useState } from 'react';
import { EventList } from '../Events/EventList';

// PUBLIC_INTERFACE
export function Sidebar({ appName = 'Calendar', onCreateQuick, filters = {} }) {
  /**
   * Sidebar shows app name, quick create, filter controls, and upcoming events.
   * Filters:
   * - activeColors: array of selected color hexes
   * - setActiveColors: setter
   * - tags: array of string tags
   * - setTags: setter
   * - upcoming: array of next events already filtered
   */
  const {
    activeColors = [],
    setActiveColors = () => {},
    tags = [],
    setTags = () => {},
    upcoming = [],
    onEventClick,
  } = filters;

  const [newTag, setNewTag] = useState('');

  const presetColors = useMemo(
    () => ['#F59E0B', '#2563EB', '#EF4444', '#10B981', '#8B5CF6'],
    []
  );

  const toggleColor = useCallback((hex) => {
    setActiveColors((prev) => {
      const exists = prev.includes(hex);
      if (exists) return prev.filter((c) => c !== hex);
      return [...prev, hex];
    });
  }, [setActiveColors]);

  const addTag = useCallback(() => {
    const t = newTag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setNewTag('');
  }, [newTag, tags, setTags]);

  const removeTag = useCallback((t) => {
    setTags(tags.filter((x) => x !== t));
  }, [tags, setTags]);

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

      <div className="cell" style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Colors</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presetColors.map((c) => {
            const active = activeColors.includes(c);
            return (
              <button
                key={c}
                className="btn"
                onClick={() => toggleColor(c)}
                aria-pressed={active}
                aria-label={`Filter color ${c}`}
                style={{
                  borderColor: active ? 'transparent' : 'var(--border-color)',
                  background: c,
                  color: '#0b1220',
                  fontSize: 12,
                  padding: '6px 8px'
                }}
              >
                {active ? '✓' : ''} {c.toUpperCase().slice(0, 7)}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tags</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="input"
            placeholder="Add tag and press +"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            aria-label="New tag"
          />
          <button className="btn" onClick={addTag} aria-label="Add tag">+</button>
        </div>
        {!!tags.length && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.map((t) => (
              <span
                key={t}
                className="event-chip"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}
              >
                #{t}{' '}
                <button
                  className="btn"
                  style={{ padding: '2px 6px', marginLeft: 6, borderRadius: '6px' }}
                  onClick={() => removeTag(t)}
                  aria-label={`Remove tag ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
        Upcoming (next 7 days)
      </div>
      <div className="cell" style={{ marginTop: 8 }}>
        <EventList events={upcoming} onEventClick={onEventClick} />
      </div>
    </div>
  );
}
