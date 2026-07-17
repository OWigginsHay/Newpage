import React from 'react';

/** Status badge — filled dot-pill for state (e.g. "Hiring!", "New", "Net Zero"). */
export function Badge({ children, tone = 'success', dot = false, style = {}, ...rest }) {
  const tones = {
    success: { background: 'var(--color-success-subtle)', color: 'var(--color-success)' },
    warning: { background: 'var(--color-warning-subtle)', color: 'var(--amber-700, #a9720b)' },
    danger: { background: 'var(--color-danger-subtle)', color: 'var(--color-danger)' },
    info: { background: 'var(--color-info-subtle)', color: 'var(--color-info)' },
    brand: { background: 'var(--teal-50)', color: 'var(--teal-700)' },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-medium)',
        fontSize: '12px',
        lineHeight: 1.2,
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        ...tones[tone],
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
      )}
      {children}
    </span>
  );
}
