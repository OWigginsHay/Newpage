import React from 'react';

/** Category / topic tag — small uppercase pill used on case studies, blogs and filters. */
export function Tag({ children, tone = 'teal', size = 'md', style = {}, ...rest }) {
  const tones = {
    teal: { background: 'var(--teal-50)', color: 'var(--teal-700)' },
    yellow: { background: 'var(--yellow-100)', color: 'var(--yellow-700)' },
    orange: { background: 'var(--orange-100)', color: 'var(--orange-700)' },
    neutral: { background: 'var(--neutral-100)', color: 'var(--neutral-600)' },
    solid: { background: 'var(--brand-teal)', color: 'var(--neutral-0)' },
  };
  const sizes = {
    sm: { padding: '3px 9px', fontSize: '11px' },
    md: { padding: '5px 12px', fontSize: '12px' },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-pill)',
        lineHeight: 1.2,
        ...sizes[size],
        ...tones[tone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
