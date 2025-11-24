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
import { isSameDay, startOfDay } from './utils/date';
import { APP_NAME } from './constants/env';
import { Router } from './routes.jsx';

// PUBLIC_INTERFACE
function App() {
  /**
   * App provides:
   * - Theming via CSS variables using Ocean Professional tokens.
   * - Responsive layout with Sidebar, Topbar, and calendar area.
   * - CalendarHeader to manage current date and view.
   * - Month/Week/Day views rendering local events with simple overlap handling.
   * - EventModal for create/edit with validation.
   * - Hash-based routing syncing URL (#/view/YYYY-MM-DD) with calendar state.
   * - Text search and color/tag filters with upcoming list in Sidebar.
   */
  const [theme, setTheme] = useState('light');

  // Initialize from router state
  const initial = Router.getState();
  const [currentDate, setCurrentDate] = useState(initial.date);
  const [view, setView] = useState(initial.view); // 'month' | 'week' | 'day'

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Search and filter state
  const [query, setQuery] = useState('');
  const [activeColors, setActiveColors] = useState([]); // array of hex strings
  const [tags, setTags] = useState([]);

  const {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    selectFiltered,
    selectUpcoming,
  } = useLocalEvents();

  // Filtered lists
  const filteredEvents = useMemo(() => {
    return selectFiltered({ query, colors: activeColors, tags });
  }, [selectFiltered, query, activeColors, tags]);

  const upcoming = useMemo(() => {
    return selectUpcoming({ days: 7, limit: 10, query, colors: activeColors, tags });
  }, [selectUpcoming, query, activeColors, tags]);

  // Keep state in sync with hash changes
  useEffect(() => {
    const unsub = Router.subscribe(({ view: v, date: d }) => {
      setView(v);
      setCurrentDate(d);
    });
    return () => unsub && unsub();
  }, []);

  // Apply theme tokens to document root and persist attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    applyThemeTokens(themeTokens);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Router-driven navigation/wrappers to pass to header
  const goToday = useCallback(() => {
    Router.goToday();
  }, []);

  const goPrev = useCallback(() => {
    Router.goPrev();
  }, []);

  const goNext = useCallback(() => {
    Router.goNext();
  }, []);

  const changeView = useCallback((nextView) => {
    Router.switchView(nextView);
  }, []);

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
    (date) => filteredEvents.filter((e) => isSameDay(new Date(e.start), date)),
    [filteredEvents]
  );

  const calendarView = useMemo(() => {
    const viewProps = {
      date: currentDate,
      events: filteredEvents,
      onEventClick: onEditEvent,
    };
    if (view === 'month') return <MonthView {...viewProps} />;
    if (view === 'week') return <WeekView {...viewProps} />;
    return <DayView {...viewProps} />;
  }, [currentDate, filteredEvents, onEditEvent, view]);

  return (
    <div className="app-root">
      <aside className="sidebar">
        <Sidebar
          appName={APP_NAME}
          onCreateQuick={onCreateQuick}
          filters={{
            activeColors,
            setActiveColors,
            tags,
            setTags,
            upcoming,
            onEventClick: onEditEvent,
          }}
        />
      </aside>

      <section className="main">
        <Topbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onCreateQuick={onCreateQuick}
          query={query}
          onChangeQuery={setQuery}
        />
        <CalendarHeader
          date={currentDate}
          view={view}
          setView={changeView}
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
