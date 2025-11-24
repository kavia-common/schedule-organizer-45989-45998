import { useEffect, useMemo, useState } from 'react';
import { STORAGE_NAMESPACE } from '../constants/env';

const KEY = `${STORAGE_NAMESPACE}:events`;

// PUBLIC_INTERFACE
export function useLocalEvents() {
  /**
   * useLocalEvents persists events in localStorage under a namespaced key.
   * Event shape: { id, title, description, color, start, end }
   */
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setEvents(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  const getNextId = useMemo(() => {
    return () => {
      const maxId = events.reduce((acc, e) => Math.max(acc, Number(e.id) || 0), 0);
      return String(maxId + 1);
    };
  }, [events]);

  // PUBLIC_INTERFACE
  const getEvents = () => events;

  // PUBLIC_INTERFACE
  const createEvent = (data) => {
    const id = data.id || getNextId();
    const payload = { ...data, id };
    setEvents((prev) => [...prev, payload]);
    return id;
  };

  // PUBLIC_INTERFACE
  const updateEvent = (id, patch) => {
    setEvents((prev) => prev.map((e) => (String(e.id) === String(id) ? { ...e, ...patch } : e)));
  };

  // PUBLIC_INTERFACE
  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)));
  };

  return { events, getEvents, createEvent, updateEvent, deleteEvent };
}
