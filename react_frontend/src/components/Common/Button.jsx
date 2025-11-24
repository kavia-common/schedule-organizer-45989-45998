import React from 'react';

// PUBLIC_INTERFACE
export function Button({ children, variant = 'default', ...rest }) {
  /** Small button wrapper to apply styles. */
  let cls = 'btn';
  if (variant === 'primary') cls += ' btn-primary';
  if (variant === 'secondary') cls += ' btn-secondary';
  if (variant === 'danger') cls += ' btn-danger';
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
