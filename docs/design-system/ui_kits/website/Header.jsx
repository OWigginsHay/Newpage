const { Button } = window.NewpageDesignSystem_f6a582;
const NAV = [
  { label: 'Services', page: 'services' },
  { label: 'Insights', page: 'insights' },
  { label: 'Case studies', page: 'cases' },
  { label: 'Careers', page: 'careers', badge: 'Hiring!' },
  { label: 'About us', page: 'about' },
];

function Header({ page, onNav, dark }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById('kit-scroll');
    const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 12);
    (el || window).addEventListener('scroll', onScroll);
    return () => (el || window).removeEventListener('scroll', onScroll);
  }, []);
  const onDark = dark && !scrolled;
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      marginBottom: dark ? '-76px' : 0,
      background: onDark ? 'transparent' : 'rgba(255,255,255,.9)',
      backdropFilter: onDark ? 'none' : 'saturate(180%) blur(12px)',
      borderBottom: onDark ? '1px solid transparent' : '1px solid var(--border-subtle)',
      transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '76px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onNav('home'); }} style={{ display: 'flex', alignItems: 'center' }}>
          <img src={onDark ? '../../assets/logo-white.svg' : '../../assets/logo-black.svg'} alt="Newpage" style={{ height: '26px' }} />
        </a>
        <nav style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          {NAV.map((n) => (
            <a key={n.label} href="#" onClick={(e) => { e.preventDefault(); onNav(n.page); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '999px', textDecoration: 'none',
                fontSize: '15px', fontWeight: 500,
                color: page === n.page ? 'var(--teal-600)' : (onDark ? 'rgba(255,255,255,.88)' : 'var(--text-primary)'),
                background: page === n.page ? (onDark ? 'rgba(255,255,255,.12)' : 'var(--teal-50)') : 'transparent',
                transition: 'background .2s, color .2s',
              }}>
              {n.label}
              {n.badge && <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: 'var(--brand-orange)', padding: '2px 6px', borderRadius: '999px' }}>{n.badge}</span>}
            </a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <Button variant={onDark ? 'primary' : 'dark'} size="sm" arrow onClick={() => onNav('contact')}>Contact us</Button>
        </div>
      </div>
    </header>
  );
}
window.Header = Header;
