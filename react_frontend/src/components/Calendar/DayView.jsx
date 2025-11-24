import React, { useMemo } from 'react';
import { formatHourLabel, isSameDay } from '../../utils/date';

// PUBLIC_INTERFACE
export function DayView({ date, events, onEventClick }) {
  /**
   * DayView renders a list of hours and shows events for the selected day.
   */
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const dayEvents = useMemo(
    () => events.filter((e) => isSameDay(new Date(e.start), date)),
    [events, date]
  );

  return (
    <div className="day-grid">
      <div className="cell" style={{ minHeight: 0 }}>
        <div className="cell-header" style={{ justifyContent: 'center' }}>
          <strong>{date.toDateString()}</strong>
        </div>
      </div>
      <div className="cell" style={{ minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dayEvents.map((e) => (
            <div
              key={e.id}
              className="event-chip"
              title={e.title}
              onClick={() => onEventClick && onEventClick(e)}
              style={{ background: e.color || 'var(--color-secondary)' }}
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') onEventClick && onEventClick(e);
              }}
              aria-label={`Event: ${e.title}`}
            >
              {e.title}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
          <div>
            {hours.map((h) => (
              <div key={h} style={{ height: 40, display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: 12 }}>
                {formatHourLabel(h)}
              </div>
            ))}
          </div>
          <div>
            {hours.map((h) => (
              <div key={h} className="cell" style={{ minHeight: 40 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
