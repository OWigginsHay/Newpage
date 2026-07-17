const { Button, SectionHeading, ServiceCard, StatBlock, Card, Tag } = window.NewpageDesignSystem_f6a582;

function Icon({ name, size = 24, color }) {
  const ref = React.useRef(null);
  React.useEffect(() => { window.lucide && window.lucide.createIcons({ nameAttr: 'data-lucide', icons: window.lucide.icons }); });
  return <i ref={ref} data-lucide={name} style={{ width: size, height: size, color }}></i>;
}

const SERVICES = [
  { icon: 'brain-circuit', title: 'Data & Artificial Intelligence', desc: 'Boost productivity across your organisation with scalable data and AI solutions.' },
  { icon: 'megaphone', title: 'Marketing Technologies', desc: 'Drive engagement with personalized experiences and omnichannel solutions.' },
  { icon: 'heart-pulse', title: 'Digital Health', desc: 'Engage and empower customers throughout their care journey.' },
  { icon: 'code-2', title: 'Technical Services', desc: 'Deep technology experience from development to deployment.' },
];
const STATS = [
  { value: '200+', label: 'Projects delivered', accent: 'teal' },
  { value: '27', label: 'Countries where our projects are deployed', accent: 'orange' },
  { value: '150K+', label: 'Hours on healthcare projects', accent: 'yellow' },
  { value: '10', label: 'Countries where our teams are located', accent: 'dark' },
];
const CASES = [
  { tags: ['AI/ML/Data', 'Salesforce'], title: 'Automating CRM Support Operations via AI Chatbot', desc: 'AI-powered Salesforce chatbot cut resolution times from four days to under five minutes.', c: 'linear-gradient(135deg,#08BDB8,#008C85)' },
  { tags: ['AI/ML/Data', 'Marketing'], title: 'From Weeks to Hours: How GenAI Transformed Brand Reporting', desc: 'Enterprise brand teams across 60+ brands escaped manual reporting with GenAI.', c: 'linear-gradient(135deg,#FFCF36,#FF7F1F)' },
  { tags: ['Digital Health', 'Mobile'], title: 'Augmented Reality for Immunity Education', desc: 'An interactive AR game that teaches children about the immune system.', c: 'linear-gradient(135deg,#2E3739,#0C1213)' },
];

function HomePage({ onNav }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--neutral-900)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 500px at 85% -10%, rgba(8,189,184,.28), transparent 60%)' }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 130px', position: 'relative' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ width: '28px', height: '3px', background: 'var(--brand-teal)', borderRadius: '2px' }}></span>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--teal-300)' }}>Life Sciences · AI &amp; Digital</span>
          </span>
          <h1 style={{ margin: 0, fontSize: '64px', lineHeight: 1.04, fontWeight: 900, letterSpacing: '-.02em', maxWidth: '15ch' }}>Deliver Breakthroughs with a trusted partner</h1>
          <p style={{ margin: '24px 0 36px', fontSize: '20px', lineHeight: 1.6, color: 'var(--neutral-300)', maxWidth: '54ch' }}>Transform your life sciences organization with AI &amp; Digital solutions that drive innovation and productivity.</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" arrow onClick={() => onNav('services')}>Explore AI Solutions</Button>
            <Button variant="ghost" size="lg" style={{ color: '#fff', border: '2px solid rgba(255,255,255,.25)' }} onClick={() => onNav('cases')}>View case studies</Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px' }}>
        <SectionHeading eyebrow="Services" title="We drive technology transformation across pharma and biotech" style={{ marginBottom: '48px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} tone="dark" href="#" title={s.title} description={s.desc}
              media={<Icon name={s.icon} color="var(--brand-teal)" />} />
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section style={{ background: 'var(--surface-subtle)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 24px' }}>
          <p style={{ margin: '0 0 40px', fontSize: '26px', fontWeight: 700, lineHeight: 1.3, maxWidth: '30ch' }}>A global team of problem-solvers with deep life-sciences expertise.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '32px' }}>
            {STATS.map((s) => <StatBlock key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px', flexWrap: 'wrap' }}>
          <SectionHeading eyebrow="Case studies" title="Outcomes we're proud of" />
          <Button variant="secondary" arrow onClick={() => onNav('cases')}>All case studies</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {CASES.map((c) => (
            <Card key={c.title} padded={false} hover elevation="sm" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', background: c.c }}></div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{c.tags.map((t) => <Tag key={t} tone="teal" size="sm">{t}</Tag>)}</div>
                <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.desc}</p>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ marginTop: 'auto', color: 'var(--teal-700)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Discover more →</a>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
window.HomePage = HomePage;
window.KitIcon = Icon;
