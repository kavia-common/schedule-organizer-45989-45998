 // PUBLIC_INTERFACE
export const getEnv = (key, fallback = '') => {
  /**
   * Get an environment variable injected at build time (REACT_APP_*),
   * falling back to the provided default when not set.
   */
  const v = process.env[key];
  return typeof v === 'string' && v.length ? v : fallback;
};

// PUBLIC_INTERFACE
export const API_BASE = getEnv('REACT_APP_API_BASE', '');
// PUBLIC_INTERFACE
export const BACKEND_URL = getEnv('REACT_APP_BACKEND_URL', '');
// PUBLIC_INTERFACE
export const FRONTEND_URL = getEnv('REACT_APP_FRONTEND_URL', '');
// PUBLIC_INTERFACE
export const WS_URL = getEnv('REACT_APP_WS_URL', '');
// PUBLIC_INTERFACE
export const NODE_ENV = getEnv('REACT_APP_NODE_ENV', 'development');
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
