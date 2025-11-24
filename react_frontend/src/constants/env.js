/**
 * Environment constants and helpers for frontend config.
 * Uses process.env.REACT_APP_* variables with sensible defaults to run locally without backend.
 */

// PUBLIC_INTERFACE
export const getEnv = (key, fallback = '') => {
  /**
   * Get an environment variable injected at build time (REACT_APP_*),
   * falling back to the provided default when not set.
   */
  const v = process.env[key];
  return typeof v === 'string' && v.length ? v : fallback;
};

// Sensible defaults for local dev with no backend:
// - API_BASE: attempts BACKEND_URL + '/api' or empty
// - BACKEND_URL: default to '' (same-origin)
// - WS_URL: derive from window if available, fallback empty

const deriveDefaultBackend = () => '';
const deriveDefaultApiBase = () => {
  const b = getEnv('REACT_APP_BACKEND_URL', deriveDefaultBackend());
  if (b) return `${b.replace(/\/$/, '')}/api`;
  return '/api'; // same-origin proxy-friendly default
};
const deriveDefaultWs = () => {
  if (typeof window === 'undefined') return '';
  const loc = window.location;
  const wsProto = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${wsProto}//${loc.host}`;
};

// PUBLIC_INTERFACE
export const BACKEND_URL = getEnv('REACT_APP_BACKEND_URL', deriveDefaultBackend());

// PUBLIC_INTERFACE
export const API_BASE = getEnv('REACT_APP_API_BASE', deriveDefaultApiBase());

// PUBLIC_INTERFACE
export const FRONTEND_URL = getEnv('REACT_APP_FRONTEND_URL', '');

// PUBLIC_INTERFACE
export const WS_URL = getEnv('REACT_APP_WS_URL', deriveDefaultWs());

// PUBLIC_INTERFACE
export const NODE_ENV = getEnv('REACT_APP_NODE_ENV', process.env.NODE_ENV || 'development');

// PUBLIC_INTERFACE
export const NEXT_TELEMETRY_DISABLED = getEnv('REACT_APP_NEXT_TELEMETRY_DISABLED', '1');

// PUBLIC_INTERFACE
export const ENABLE_SOURCE_MAPS = getEnv('REACT_APP_ENABLE_SOURCE_MAPS', '0');

// PUBLIC_INTERFACE
export const APP_PORT = getEnv('REACT_APP_PORT', '3000');

// PUBLIC_INTERFACE
export const TRUST_PROXY = getEnv('REACT_APP_TRUST_PROXY', '0');

// PUBLIC_INTERFACE
export const LOG_LEVEL = getEnv('REACT_APP_LOG_LEVEL', 'info');

// PUBLIC_INTERFACE
export const HEALTHCHECK_PATH = getEnv('REACT_APP_HEALTHCHECK_PATH', '/healthz');

// PUBLIC_INTERFACE
export const FEATURE_FLAGS = getEnv('REACT_APP_FEATURE_FLAGS', '{}');

// PUBLIC_INTERFACE
export const EXPERIMENTS_ENABLED = getEnv('REACT_APP_EXPERIMENTS_ENABLED', '0');

// PUBLIC_INTERFACE
export const STORAGE_NAMESPACE = 'calendar-local';

// PUBLIC_INTERFACE
export const APP_NAME = 'Schedule Organizer';
