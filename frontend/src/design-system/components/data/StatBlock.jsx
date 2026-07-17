import React from 'react';

/** Big-number stat block — the "200+ / Projects delivered" metrics on the homepage. */
export function StatBlock({ value, label, accent = 'teal', align = 'left', style = {}, ...rest }) {
  const accents = {
    teal: 'var(--brand-teal)',
    yellow: 'var(--brand-yellow)',
    orange: 'var(--brand-orange)',
    dark: 'var(--neutral-900)',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start', ...style }} {...rest}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-black)',
        fontSize: 'var(--fs-display)',
        lineHeight: 1,
        letterSpacing: 'var(--ls-tight)',
        color: accents[accent],
      }}>
        {value}
      </span>
      <span style={{ fontSize: 'var(--fs-body)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-snug)', maxWidth: '18ch' }}>
        {label}
      </span>
    </div>
  );
}
