import React from 'react';
import { EventItem } from './EventItem';

// PUBLIC_INTERFACE
export function EventList({ events = [], onEventClick }) {
  /** EventList renders a simple vertical list of events. */
  if (!events.length) {
    return <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No events</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {events.map((e) => (
        <EventItem key={e.id} event={e} onClick={() => onEventClick && onEventClick(e)} />
      ))}
    </div>
  );
}
