import React from 'react';

/** Numbered process step — the "01 Contact us" engagement flow cards. */
export function StepCard({ number, title, description, style = {}, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }} {...rest}>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)',
        fontSize: 'var(--fs-h2)', lineHeight: 1,
        color: 'var(--brand-teal)',
      }}>
        {String(number).padStart(2, '0')}
      </span>
      <h4 style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
}
