import { useEffect, useMemo, useState } from 'react';
import { STORAGE_NAMESPACE } from '../constants/env';

const KEY = `${STORAGE_NAMESPACE}:events`;

/**
 * The shape returned by this hook is intentionally aligned with a future API-backed
 * implementation so App and components won't break when swapping.
 * Interface:
 *  - events: array
 *  - getEvents(): array
 *  - createEvent(data): string|Promise<string>
 *  - updateEvent(id, patch): void|Promise<void>
 *  - deleteEvent(id): void|Promise<void>
 *  - selectFiltered(filters): array
 *  - selectUpcoming(filters): array
 */

// PUBLIC_INTERFACE
export function useLocalEvents() {
  /**
   * useLocalEvents persists events in localStorage under a namespaced key.
   * Event shape: { id, title, description, color, start, end }
   * Also exposes filtering selectors compatible with a remote implementation.
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

  // Helpers
  const matchQuery = (evt, q) => {
    if (!q) return true;
    const s = q.toLowerCase();
    const text = `${evt.title || ''} ${evt.description || ''}`.toLowerCase();
    return text.includes(s);
  };

  const matchColors = (evt, colors) => {
    if (!colors || !colors.length) return true;
    const c = (evt.color || '').toLowerCase();
    return colors.map((x) => x.toLowerCase()).includes(c);
  };

  const matchTags = (evt, tags) => {
    if (!tags || !tags.length) return true;
    const blob = `${evt.title || ''} ${evt.description || ''}`.toLowerCase();
    return tags.every((t) => blob.includes(String(t).toLowerCase()));
  };

  // PUBLIC_INTERFACE
  const selectFiltered = ({ query = '', colors = [], tags = [] } = {}) => {
    return events
      .filter((e) => matchQuery(e, query))
      .filter((e) => matchColors(e, colors))
      .filter((e) => matchTags(e, tags));
  };

  // PUBLIC_INTERFACE
  const selectUpcoming = ({ days = 7, limit = 10, query = '', colors = [], tags = [] } = {}) => {
    const now = new Date();
    const to = new Date();
    to.setDate(to.getDate() + days);
    return events
      .filter((e) => {
        const start = new Date(e.start);
        return start >= now && start <= to;
      })
      .filter((e) => matchQuery(e, query))
      .filter((e) => matchColors(e, colors))
      .filter((e) => matchTags(e, tags))
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, limit);
  };

  return {
    events,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    selectFiltered,
    selectUpcoming,
  };
}

// PUBLIC_INTERFACE
export function createEventsService(adapter = useLocalEvents) {
  /**
   * Factory that allows swapping the underlying events source.
   * Example future usage:
   *   const service = createEventsService(useApiEvents);
   * For now, defaults to local storage implementation.
   */
  return adapter();
}
