import React from 'react';

// PUBLIC_INTERFACE
export function EventItem({ event, onClick }) {
  /** EventItem shows a colored chip for an event. */
  return (
    <div
      className="event-chip"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') onClick && onClick();
      }}
      title={event.title}
      aria-label={`Event: ${event.title}`}
      style={{ background: event.color || 'var(--color-secondary)' }}
    >
      {event.title}
    </div>
  );
}
