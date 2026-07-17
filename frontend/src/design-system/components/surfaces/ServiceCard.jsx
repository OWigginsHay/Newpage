import React from 'react';

/**
 * Service card — the dark tiles on the Newpage homepage: a media/icon block,
 * a title, a short description and an up-right arrow. Whole card is a link.
 */
export function ServiceCard({ title, description, media, href, tone = 'dark', style = {}, ...rest }) {
  const dark = tone === 'dark';
  return (
    <a
      href={href}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        textDecoration: 'none',
        background: dark ? 'var(--neutral-900)' : 'var(--surface-card)',
        color: dark ? 'var(--neutral-0)' : 'var(--text-primary)',
        border: dark ? '1px solid var(--neutral-800)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
          background: dark ? 'rgba(8,189,184,.16)' : 'var(--teal-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {media}
        </div>
        <span style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'var(--brand-teal)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <h3 style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', fontFamily: 'var(--font-display)', lineHeight: 'var(--lh-heading)' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: dark ? 'var(--neutral-300)' : 'var(--text-secondary)' }}>{description}</p>
    </a>
  );
}
