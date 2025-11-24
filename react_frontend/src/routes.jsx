import { startOfDay } from './utils/date';

// PUBLIC_INTERFACE
export const VIEWS = ['month', 'week', 'day'];

/**
 * Parse the window.location.hash into a route object.
 * Supported patterns:
 *  - #/month
 *  - #/week
 *  - #/day
 *  - #/month/2025-01-31
 *  - #/week/2025-01-31
 *  - #/day/2025-01-31
 *
 * Returns: { view: 'month'|'week'|'day', date: Date }
 */
function parseHash() {
  const raw = (window.location.hash || '').replace(/^#/, '');
  const parts = raw.split('/').filter(Boolean); // remove empty parts
  const view = VIEWS.includes(parts[0]) ? parts[0] : 'month';

  let date = startOfDay(new Date());
  if (parts[1]) {
    const d = new Date(parts[1]);
    if (!isNaN(d.getTime())) {
      date = startOfDay(d);
    }
  }
  return { view, date };
}

/**
 * Build a hash string from view and date.
 */
function buildHash(view, date) {
  const v = VIEWS.includes(view) ? view : 'month';
  const d = date instanceof Date ? date : startOfDay(new Date());
  const iso = d.toISOString().slice(0, 10); // yyyy-mm-dd
  return `#/${v}/${iso}`;
}

let subscribers = new Set();

/**
 * Internal handler to notify subscribers on hash changes.
 */
function notify() {
  const state = parseHash();
  subscribers.forEach((cb) => {
    try {
      cb(state);
    } catch {
      // ignore
    }
  });
}

let isListening = false;
function ensureListener() {
  if (isListening) return;
  window.addEventListener('hashchange', notify);
  isListening = true;
}

// PUBLIC_INTERFACE
export const Router = {
  /**
   * Get current route state from the URL hash.
   */
  getState() {
    return parseHash();
  },

  /**
   * Subscribe to route changes. Returns an unsubscribe function.
   */
  subscribe(callback) {
    ensureListener();
    subscribers.add(callback);
    // Immediately call with current state
    try {
      callback(parseHash());
    } catch {
      // ignore
    }
    return () => {
      subscribers.delete(callback);
    };
  },

  /**
   * Programmatically navigate to a view and date.
   */
  navigate(view, date = startOfDay(new Date())) {
    const next = buildHash(view, date);
    if (window.location.hash !== next) {
      window.location.hash = next;
    } else {
      // If hash didn't change, still notify to keep state in sync
      notify();
    }
  },

  /**
   * Switch only the view, keeping the current date from the URL.
   */
  switchView(view) {
    const { date } = parseHash();
    Router.navigate(view, date);
  },

  /**
   * Go to today's date keeping the current view.
   */
  goToday() {
    const { view } = parseHash();
    Router.navigate(view, startOfDay(new Date()));
  },

  /**
   * Go to previous period based on current view.
   * - month: -1 month
   * - week: -7 days
   * - day: -1 day
   */
  goPrev() {
    const { view, date } = parseHash();
    const d = new Date(date);
    if (view === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (view === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    Router.navigate(view, startOfDay(d));
  },

  /**
   * Go to next period based on current view.
   * - month: +1 month
   * - week: +7 days
   * - day: +1 day
   */
  goNext() {
    const { view, date } = parseHash();
    const d = new Date(date);
    if (view === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (view === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    Router.navigate(view, startOfDay(d));
  },
};

// Initialize default hash on first load if empty.
(function initDefault() {
  if (!window.location.hash || window.location.hash === '#') {
    const state = parseHash();
    window.location.hash = buildHash(state.view, state.date);
  }
})();
