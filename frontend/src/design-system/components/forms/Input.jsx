import React from 'react';

/** Text input with optional label — brand focus ring in teal. */
export function Input({ label, hint, error, id, style = {}, containerStyle = {}, ...rest }) {
  const inputId = id || (label ? `in-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{label}</label>
      )}
      <input
        id={inputId}
        onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body)',
          color: 'var(--text-primary)',
          padding: '12px 14px',
          background: 'var(--surface-page)',
          border: `1px solid ${error ? 'var(--color-danger)' : focused ? 'var(--brand-teal)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px var(--focus-ring)' : 'none',
          transition: 'border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
          ...style,
        }}
        {...rest}
      />
      {(hint || error) && (
        <span style={{ fontSize: 'var(--fs-xs)', color: error ? 'var(--color-danger)' : 'var(--text-muted)' }}>{error || hint}</span>
      )}
    </div>
  );
}
