import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export function Modal({ open, onClose, children, ariaLabel = 'Dialog' }) {
  /**
   * Accessible modal with basic focus trap and Escape to close.
   */
  const backdropRef = useRef(null);
  const focusableRef = useRef([]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === 'Escape') onClose && onClose();
      if (e.key === 'Tab') {
        const nodes = focusableRef.current;
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && backdropRef.current) {
      const selectors = [
        'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
        'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
      ];
      const nodes = backdropRef.current.querySelectorAll(selectors.join(','));
      focusableRef.current = Array.from(nodes);
    }
  }, [open, children]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onMouseDown={(e) => {
        if (e.target === backdropRef.current) onClose && onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className="modal">
        {children}
      </div>
    </div>
  );
}
