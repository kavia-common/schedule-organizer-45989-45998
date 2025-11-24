import React, { useMemo } from 'react';
import { getMonthGrid, isSameDay, formatDayNumber, weekdayShort } from '../../utils/date';

// PUBLIC_INTERFACE
export function MonthView({ date, events, onEventClick }) {
  /**
   * MonthView renders a 7x5/6 grid of days for the month containing `date`.
   * Simple overlap handling: stacks event chips vertically within a cell.
   */
  const { weeks, weekDayNames } = useMemo(() => {
    return {
      weeks: getMonthGrid(date),
      weekDayNames: Array.from({ length: 7 }).map((_, i) => weekdayShort(i)),
    };
  }, [date]);

  return (
    <div>
      <div className="month-grid" style={{ marginBottom: 8 }}>
        {weekDayNames.map((name) => (
          <div key={name} className="cell" style={{ minHeight: 0 }}>
            <div className="cell-header" style={{ justifyContent: 'center' }}>
              <strong>{name}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="month-grid">
        {weeks.flat().map((day) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.start), day));
          return (
            <div className="cell" key={day.toISOString()}>
              <div className="cell-header">
                <span>{formatDayNumber(day)}</span>
                <span className="visually-hidden">
                  {day.toDateString()}
                </span>
              </div>
              <div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
