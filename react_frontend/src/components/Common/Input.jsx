import React, { forwardRef } from 'react';

// PUBLIC_INTERFACE
export const Input = forwardRef(function Input(
  { label, name, error, textarea = false, ...rest },
  ref
) {
  /** Input with label and optional error text. */
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
      {textarea ? (
        <textarea ref={ref} className="input" name={name} rows={4} {...rest} />
      ) : (
        <input ref={ref} className="input" name={name} {...rest} />
      )}
      {error && <span style={{ color: 'var(--color-error)', fontSize: 12 }}>{error}</span>}
    </label>
  );
});
