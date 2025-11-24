import React from 'react';
import { formatMonthYear } from '../../utils/date';

// PUBLIC_INTERFACE
export function CalendarHeader({ date, view, setView, onPrev, onNext, onToday }) {
  /** Header with navigation controls, current month label, and view switcher.
   * The setView callback should update both state and URL via router.
   */
  return (
    <div className="calendar-header" role="region" aria-label="Calendar navigation">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn" onClick={onPrev} aria-label="Previous">
          ‹
        </button>
        <button className="btn" onClick={onToday} aria-label="Today">
          Today
        </button>
        <button className="btn" onClick={onNext} aria-label="Next">
          ›
        </button>
        <div style={{ marginLeft: 12, fontWeight: 700 }}>{formatMonthYear(date)}</div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`btn ${view === 'day' ? 'btn-primary' : ''}`}
          onClick={() => setView('day')}
          aria-pressed={view === 'day'}
          aria-label="Day view"
        >
          Day
        </button>
        <button
          className={`btn ${view === 'week' ? 'btn-primary' : ''}`}
          onClick={() => setView('week')}
          aria-pressed={view === 'week'}
          aria-label="Week view"
        >
          Week
        </button>
        <button
          className={`btn ${view === 'month' ? 'btn-primary' : ''}`}
          onClick={() => setView('month')}
          aria-pressed={view === 'month'}
          aria-label="Month view"
        >
          Month
        </button>
      </div>
    </div>
  );
}
