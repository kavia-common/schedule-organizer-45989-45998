export const themeTokens = {
  name: 'Ocean Professional',
  primary: '#2563EB',
  secondary: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827'
};

// PUBLIC_INTERFACE
export function applyThemeTokens(tokens) {
  /**
   * Applies theme tokens to CSS variables at root for usage across the app.
   */
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', tokens.primary);
  root.style.setProperty('--color-secondary', tokens.secondary);
  root.style.setProperty('--color-error', tokens.error);
}
