import React from 'react';

/** Testimonial / quote card with the Newpage brand quote mark, body, and attribution. */
export function TestimonialCard({ quote, name, role, avatar, style = {}, ...rest }) {
  return (
    <figure
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: 'var(--space-10)',
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      <svg width="52" height="40" viewBox="0 0 52 40" fill="none" aria-hidden="true">
        <path d="M0 40V22C0 9.85 8.4 1.2 21 0L23 6.5C15.2 8 11 12.4 11 18h9v22H0Zm29 0V22C29 9.85 37.4 1.2 50 0l2 6.5C44.2 8 40 12.4 40 18h9v22H29Z" fill="var(--brand-teal)" />
      </svg>
      <blockquote style={{
        margin: 0, fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-regular)',
        lineHeight: 'var(--lh-snug)', color: 'var(--text-primary)',
      }}>
        {quote}
      </blockquote>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'auto' }}>
        {avatar && (
          <img src={avatar} alt="" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
        )}
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>{name}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
