const { Button } = window.NewpageDesignSystem_f6a582;

const COLS = [
  { h: 'Company', links: ['Services', 'Insights', 'Case Studies', 'About us', 'Careers', 'Contact us'] },
  { h: 'Services', links: ['Data & AI', 'Marketing Technologies', 'Digital Health', 'Technical Services', 'NAT Studio'] },
];

function Footer({ onNav }) {
  return (
    <footer style={{ background: 'var(--neutral-900)', color: 'var(--neutral-300)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 24px 40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '40px' }}>
        <div>
          <img src="../../assets/logo-white.svg" alt="Newpage" style={{ height: '28px', marginBottom: '16px' }} />
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, maxWidth: '30ch' }}>Digital &amp; connected health solutions for life-sciences organizations worldwide.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {['linkedin', 'twitter'].map((s) => (
              <span key={s} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i data-lucide={s} style={{ width: 16, height: 16, color: '#fff' }}></i>
              </span>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.h}>
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>{c.h}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {c.links.map((l) => <li key={l}><a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('home'); }} style={{ color: 'var(--neutral-300)', textDecoration: 'none', fontSize: '14px' }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>Get in touch</div>
          <p style={{ margin: '0 0 6px', fontSize: '14px' }}>info@newpage.io</p>
          <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.6 }}>601 Brickell Key Drive, Suite 700<br />Miami, Florida 33131</p>
          <Button variant="primary" size="sm" arrow onClick={() => onNav && onNav('contact')}>Contact us</Button>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--neutral-400)' }}>
          <span>©2026 Newpage.io — All rights reserved</span>
          <span style={{ display: 'flex', gap: '20px' }}><a href="#" onClick={(e)=>e.preventDefault()} style={{ color: 'var(--neutral-400)', textDecoration: 'none' }}>Privacy Policy</a><a href="#" onClick={(e)=>e.preventDefault()} style={{ color: 'var(--neutral-400)', textDecoration: 'none' }}>Terms &amp; Conditions</a></span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
