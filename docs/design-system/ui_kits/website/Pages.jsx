const { SectionHeading, ServiceCard, Input, Button, Card, Tag } = window.NewpageDesignSystem_f6a582;
const KI = window.KitIcon;

const DETAIL = [
  { icon: 'brain-circuit', title: 'Data & Artificial Intelligence', desc: 'Scalable data and AI platforms — from LLM apps to computational pipelines.' },
  { icon: 'megaphone', title: 'Marketing Technologies', desc: 'Salesforce, Veeva and Adobe Experience Cloud personalization at scale.' },
  { icon: 'heart-pulse', title: 'Digital Health', desc: 'Companion apps, chronic disease management, and bioinformatics.' },
  { icon: 'code-2', title: 'Technical Services', desc: 'Mobile & web, cloud, microservices, DevOps, QA and AR/VR/XR.' },
  { icon: 'flask-conical', title: 'NAT Studio', desc: 'AI-powered test automation built for scale, stability and compliance.' },
  { icon: 'shield-check', title: 'Compliance & QA', desc: 'Validated, regulated delivery for pharma, biotech and BFSI.' },
];

function ServicesPage() {
  return (
    <div>
      <section style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
          <SectionHeading eyebrow="Services" title="Technology transformation for life sciences" lead="We help drive technology transformation across the pharmaceutical and biotech industry — from ideation and strategy to design, development and delivery." />
        </div>
      </section>
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {DETAIL.map((s) => (
            <ServiceCard key={s.title} tone="light" href="#" title={s.title} description={s.desc}
              media={<KI name={s.icon} color="var(--brand-teal)" />} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = React.useState(false);
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
      <div>
        <SectionHeading eyebrow="Let's connect" title="Tell us about your project" lead="We'll get back to you within 2 business days." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '32px' }}>
          {[['mail', 'info@newpage.io'], ['phone', '+1 910-420-0496'], ['map-pin', 'Miami · Bangalore · Chennai']].map(([ic, t]) => (
            <div key={t} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KI name={ic} color="var(--teal-700)" size={20} /></span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <Card elevation="lg" style={{ padding: '32px' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><KI name="check" color="var(--color-success)" size={30} /></div>
            <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 700 }}>Thanks — we'll be in touch</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Our team will reach out within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="First name" placeholder="Jane" required />
              <Input label="Last name" placeholder="Doe" required />
            </div>
            <Input label="Work email" type="email" placeholder="you@company.com" required />
            <Input label="Company" placeholder="Acme Biotech" />
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>How can we help?</span>
              <textarea rows="4" placeholder="Tell us about your project" style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', padding: '12px 14px', border: '1px solid var(--border-default)', borderRadius: '10px', resize: 'vertical' }}></textarea>
            </label>
            <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <input type="checkbox" style={{ marginTop: '3px' }} /> I agree to receive emails and marketing communications from Newpage.
            </label>
            <Button type="submit" variant="primary" size="lg" arrow style={{ width: '100%' }}>Send message</Button>
          </form>
        )}
      </Card>
    </section>
  );
}

function SimplePage({ title, eyebrow, lead }) {
  return (
    <section style={{ maxWidth: '900px', margin: '0 auto', padding: '110px 24px', textAlign: 'center' }}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} align="center" />
    </section>
  );
}
Object.assign(window, { ServicesPage, ContactPage, SimplePage });
