import React from 'react';

/**
 * Section heading — the eyebrow + big title + optional lead used to open sections.
 * Eyebrow shows a short teal bar and uppercase label.
 */
export function SectionHeading({ eyebrow, title, lead, align = 'left', onDark = false, style = {}, ...rest }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align, maxWidth: '760px',
      marginInline: align === 'center' ? 'auto' : undefined,
      ...style,
    }} {...rest}>
      {eyebrow && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '28px', height: '3px', borderRadius: '2px', background: 'var(--brand-teal)' }} />
          <span style={{
            fontSize: 'var(--fs-eyebrow)', fontWeight: 'var(--fw-bold)',
            letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase',
            color: 'var(--teal-600)',
          }}>{eyebrow}</span>
        </span>
      )}
      <h2 style={{
        margin: 0, fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-h2)', fontWeight: 'var(--fw-bold)',
        lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--ls-tight)',
        color: onDark ? 'var(--neutral-0)' : 'var(--text-primary)',
        textWrap: 'balance',
      }}>{title}</h2>
      {lead && (
        <p style={{
          margin: 0, fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-body)',
          color: onDark ? 'var(--neutral-300)' : 'var(--text-secondary)',
        }}>{lead}</p>
      )}
    </div>
  );
}
