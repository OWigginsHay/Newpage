import React from 'react';

/** Generic elevated surface. Newpage cards are white, softly rounded, subtle shadow. */
export function Card({ children, elevation = 'sm', padded = true, hover = false, style = {}, ...rest }) {
  const shadows = {
    none: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  };
  return (
    <div
      onMouseEnter={hover ? (e) => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; } : undefined}
      onMouseLeave={hover ? (e) => { e.currentTarget.style.boxShadow = shadows[elevation]; e.currentTarget.style.transform = 'none'; } : undefined}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: shadows[elevation],
        padding: padded ? 'var(--space-6)' : 0,
        transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
