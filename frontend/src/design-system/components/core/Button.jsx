import React from 'react';

/**
 * Newpage Button — pill-shaped, Roboto-bold. Primary is solid teal;
 * secondary is a teal outline; ghost is text-only. Optional up-right arrow.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  disabled = false,
  as = 'button',
  href,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '9px 18px', fontSize: '14px' },
    md: { padding: '13px 26px', fontSize: '15px' },
    lg: { padding: '17px 34px', fontSize: '17px' },
  };
  const variants = {
    primary: {
      background: 'var(--brand-teal)',
      color: 'var(--color-on-primary)',
      border: '2px solid var(--brand-teal)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--teal-700)',
      border: '2px solid var(--brand-teal)',
    },
    dark: {
      background: 'var(--neutral-900)',
      color: 'var(--neutral-0)',
      border: '2px solid var(--neutral-900)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--teal-700)',
      border: '2px solid transparent',
    },
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--fw-bold)',
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
    ...sizes[size],
    ...variants[variant],
    ...style,
  };
  const Tag = as === 'a' || href ? 'a' : 'button';
  const props = Tag === 'a'
    ? { href, onClick, style: base, ...rest }
    : { type, disabled, onClick, style: base, ...rest };
  return (
    <Tag {...props}>
      {children}
      {arrow && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Tag>
  );
}
