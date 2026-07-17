import React from 'react';

/** FAQ-style disclosure list. Controlled internally; single-open by default. */
export function Accordion({ items = [], allowMultiple = false, style = {}, ...rest }) {
  const [open, setOpen] = React.useState(() => new Set());
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }} {...rest}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => toggle(i)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                width: '100%', textAlign: 'left', cursor: 'pointer',
                background: 'none', border: 'none', padding: '20px 4px',
                fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h4)',
                fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)',
              }}
            >
              <span>{item.question}</span>
              <span style={{
                flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                background: isOpen ? 'var(--brand-teal)' : 'var(--teal-50)',
                color: isOpen ? '#fff' : 'var(--teal-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
                transform: isOpen ? 'rotate(45deg)' : 'none',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
              </span>
            </button>
            <div style={{
              maxHeight: isOpen ? '600px' : '0', overflow: 'hidden',
              transition: 'max-height var(--dur-slow) var(--ease-standard)',
            }}>
              <p style={{ margin: 0, padding: '0 4px 22px', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--text-secondary)' }}>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
