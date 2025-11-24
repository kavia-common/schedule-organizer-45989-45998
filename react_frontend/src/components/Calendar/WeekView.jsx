import React, { useMemo } from 'react';
import { startOfWeek, addDays, formatHourLabel, isSameDay } from '../../utils/date';

// PUBLIC_INTERFACE
export function WeekView({ date, events, onEventClick }) {
  /**
   * WeekView renders a time grid for 7 days starting at the week's start.
   * For simplicity, list events in each day column at top.
   */
  const { days, hours } = useMemo(() => {
    const start = startOfWeek(date);
    const ds = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    const hrs = Array.from({ length: 24 }, (_, i) => i);
    return { days: ds, hours: hrs };
  }, [date]);

  return (
    <div className="week-grid">
      <div />
      {days.map((d) => (
        <div key={d.toISOString()} className="cell" style={{ minHeight: 0 }}>
          <div className="cell-header" style={{ justifyContent: 'center' }}>
            <strong>{d.toDateString().slice(0, 10)}</strong>
          </div>
        </div>
      ))}
      {hours.map((h) => (
        <React.Fragment key={h}>
          <div className="cell" style={{ minHeight: 48 }}>
            <div className="cell-header" style={{ justifyContent: 'center' }}>
              <span>{formatHourLabel(h)}</span>
            </div>
          </div>
          {days.map((d) => {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.start), d));
            return (
              <div key={d.toISOString() + h} className="cell" style={{ minHeight: 48 }}>
                {h === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
