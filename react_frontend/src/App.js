import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './App.css';
import './index.css';
import { Sidebar } from './components/Layout/Sidebar';
import { Topbar } from './components/Layout/Topbar';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { MonthView } from './components/Calendar/MonthView';
import { WeekView } from './components/Calendar/WeekView';
import { DayView } from './components/Calendar/DayView';
import { EventModal } from './components/Events/EventModal';
import { applyThemeTokens, themeTokens } from './theme';
import { useLocalEvents } from './hooks/useLocalEvents';
import { addDays, isSameDay, startOfDay } from './utils/date';
import { APP_NAME } from './constants/env';

// PUBLIC_INTERFACE
function App() {
  /**
   * App provides:
   * - Theming via CSS variables using Ocean Professional tokens.
   * - Responsive layout with Sidebar, Topbar, and calendar area.
   * - CalendarHeader to manage current date and view.
   * - Month/Week/Day views rendering local events with simple overlap handling.
   * - EventModal for create/edit with validation.
   */
  const [theme, setTheme] = useState('light');
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [view, setView] = useState('month'); // 'month' | 'week' | 'day'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { events, createEvent, updateEvent, deleteEvent } = useLocalEvents();

  // Apply theme tokens to document root and persist attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    applyThemeTokens(themeTokens);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Navigate functions for header controls
  const goToday = useCallback(() => {
    setCurrentDate(startOfDay(new Date()));
  }, []);

  const goPrev = useCallback(() => {
    if (view === 'month') {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() - 1);
      setCurrentDate(startOfDay(d));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  }, [currentDate, view]);

  const goNext = useCallback(() => {
    if (view === 'month') {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + 1);
      setCurrentDate(startOfDay(d));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  }, [currentDate, view]);

  const onCreateQuick = useCallback(() => {
    setEditingEvent({
      id: null,
      title: '',
      description: '',
      color: themeTokens.secondary,
      start: startOfDay(new Date()).toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm
      end: startOfDay(new Date()).toISOString().slice(0, 16),
    });
    setModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingEvent(null);
  }, []);

  const onSaveEvent = useCallback(
    (data) => {
      if (data.id) {
        updateEvent(data.id, data);
      } else {
        createEvent(data);
      }
      setModalOpen(false);
      setEditingEvent(null);
    },
    [createEvent, updateEvent]
  );

  const onEditEvent = useCallback((evt) => {
    setEditingEvent({
      ...evt,
      start: new Date(evt.start).toISOString().slice(0, 16),
      end: new Date(evt.end).toISOString().slice(0, 16),
    });
    setModalOpen(true);
  }, []);

  const onDeleteEvent = useCallback(
    (id) => {
      deleteEvent(id);
      if (editingEvent && editingEvent.id === id) {
        onCloseModal();
      }
    },
    [deleteEvent, editingEvent, onCloseModal]
  );

  const filteredEventsForDate = useCallback(
    (date) => events.filter((e) => isSameDay(new Date(e.start), date)),
    [events]
  );

  const calendarView = useMemo(() => {
    const viewProps = {
      date: currentDate,
      events,
      onEventClick: onEditEvent,
    };
    if (view === 'month') return <MonthView {...viewProps} />;
    if (view === 'week') return <WeekView {...viewProps} />;
    return <DayView {...viewProps} />;
  }, [currentDate, events, onEditEvent, view]);

  return (
    <div className="app-root">
      <aside className="sidebar">
        <Sidebar appName={APP_NAME} onCreateQuick={onCreateQuick} />
      </aside>

      <section className="main">
        <Topbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onCreateQuick={onCreateQuick}
        />
        <CalendarHeader
          date={currentDate}
          view={view}
          setView={setView}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
        />

        <div className="calendar-container" aria-label="Calendar area">
          {calendarView}
        </div>
      </section>

      <EventModal
        open={modalOpen}
        onClose={onCloseModal}
        onDelete={onDeleteEvent}
        onSave={onSaveEvent}
        initialEvent={editingEvent}
      />
    </div>
  );
}

export default App;
