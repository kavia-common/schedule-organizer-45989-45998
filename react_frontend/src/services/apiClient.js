import { API_BASE, WS_URL, LOG_LEVEL } from '../constants/env';

/**
 * Lightweight API client wrapper around fetch.
 * Provides a minimal interface that mirrors expected backend endpoints.
 * For now, calls are no-ops/stubs to allow swapping from local storage to API later.
 */

const log = (...args) => {
  if (['debug', 'info'].includes((LOG_LEVEL || '').toLowerCase())) {
    // eslint-disable-next-line no-console
    console.log('[apiClient]', ...args);
  }
};

// PUBLIC_INTERFACE
export class ApiClient {
  /** Create an ApiClient with optional base URL override. */
  constructor(baseUrl = API_BASE) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
    this.wsUrl = WS_URL;
  }

  /**
   * Internal fetch wrapper handling JSON, errors, and base URL prefixing.
   */
  async _request(path, { method = 'GET', body, headers = {} } = {}) {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include',
    };
    if (body !== undefined) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    const res = await fetch(url, options);
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = text;
    }
    if (!res.ok) {
      const err = new Error(`Request failed ${res.status}`);
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  }

  // ---- Events API (stubs to be wired to backend later) ----

  // PUBLIC_INTERFACE
  async listEvents(params = {}) {
    /** List events with optional filters. Stub: returns null to indicate "not implemented". */
    log('listEvents(params)', params);
    return null; // not implemented; use useLocalEvents for now
  }

  // PUBLIC_INTERFACE
  async createEvent(payload) {
    /** Create a new event. Stub: returns null to indicate "not implemented". */
    log('createEvent(payload)', payload);
    return null;
  }

  // PUBLIC_INTERFACE
  async updateEvent(id, patch) {
    /** Update event by id. Stub. */
    log('updateEvent(id, patch)', id, patch);
    return null;
  }

  // PUBLIC_INTERFACE
  async deleteEvent(id) {
    /** Delete event by id. Stub. */
    log('deleteEvent(id)', id);
    return null;
  }

  // PUBLIC_INTERFACE
  openEventsWebSocket() {
    /**
     * Optional: open a websocket to receive real-time updates. Stub returns null.
     * Usage when implemented: return new WebSocket(`${this.wsUrl}/events`);
     */
    log('openEventsWebSocket()');
    return null;
  }
}

// PUBLIC_INTERFACE
export const apiClient = new ApiClient();
