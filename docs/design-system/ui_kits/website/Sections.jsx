const { SectionHeading, TestimonialCard, StepCard, Accordion, Button } = window.NewpageDesignSystem_f6a582;

const QUOTES = [
  { quote: "As a strategic technology partner, Newpage brought deep technical expertise to accelerate the development of key digital capabilities, including a cloud-based computational psychiatry and data platform.", name: 'Pablo Gersberg', role: 'VP, BlackThorn Therapeutics' },
  { quote: "Newpage took the time to truly understand our goals, then clearly discussed plans and expectations. The team contributed crucial expertise to bring our vision to life.", name: 'Saquib Lakhani', role: 'Co-Founder, Victory Genomics' },
  { quote: "Their customized gene sequencing solution streamlined our workflow, enabling us to handle large-scale genomic data with precision and reliability.", name: 'Ahmed', role: 'R&D and Co-Founder, QIYAS' },
];
const STEPS = [
  { number: 1, title: 'Contact us', description: "Reach out via our form or phone—we'll respond promptly." },
  { number: 2, title: 'Understanding your goals', description: 'We listen to your objectives and craft an approach that aligns with your vision.' },
  { number: 3, title: 'Proposal presentation', description: "We develop a tailored proposal and roadmap to achieve your goals." },
  { number: 4, title: "We're partners!", description: 'Once finalized, our team begins the engagement, working alongside you as partners.' },
];
const FAQ = [
  { question: 'What is Newpage Solutions?', answer: 'A life-sciences digital engineering partner specialising in Salesforce/Veeva, Adobe Experience Cloud, AI/data engineering, custom software, cloud, and DevOps for pharma, biotech and regulated enterprises.' },
  { question: 'What services do you offer?', answer: 'Digital engineering, platform expertise (Salesforce Health Cloud, Veeva CRM, Adobe AEM), flexible delivery models (GCC/ODC, augmentation), and a compliant life-sciences vertical focus.' },
  { question: "What's the difference between ODC and GCC?", answer: 'An ODC provides dedicated teams for specific projects; a GCC is a client-owned hub for enterprise-wide functions. Newpage builds both and evolves ODCs into GCCs.' },
  { question: 'Are you Net Zero certified?', answer: 'Yes — Scope 1 & 2 Net Zero achieved (2025, verified baseline 2023). Sustainable remote-first engineering supports green digital transformation.' },
];

function Testimonials() {
  const [i, setI] = React.useState(0);
  const go = (d) => setI((p) => (p + d + QUOTES.length) % QUOTES.length);
  return (
    <section style={{ background: 'var(--neutral-900)', color: '#fff' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '96px 24px' }}>
        <SectionHeading eyebrow="Testimonials" title="Trusted by life-sciences innovators" onDark style={{ marginBottom: '40px' }} />
        <div style={{ borderRadius: '20px' }}>
          <TestimonialCard {...QUOTES[i]} />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', alignItems: 'center' }}>
          <button onClick={() => go(-1)} style={navBtn}>←</button>
          <button onClick={() => go(1)} style={navBtn}>→</button>
          <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
            {QUOTES.map((_, k) => <span key={k} onClick={() => setI(k)} style={{ width: k === i ? '24px' : '8px', height: '8px', borderRadius: '999px', background: k === i ? 'var(--brand-teal)' : 'rgba(255,255,255,.3)', cursor: 'pointer', transition: 'all .3s' }}></span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
const navBtn = { width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '18px' };

// Fix quote/author colours on dark
function TestimonialsDarkFix() { return null; }

function Engage({ onNav }) {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 24px' }}>
      <SectionHeading eyebrow="How to engage" title="How to engage with us" align="center" style={{ marginBottom: '56px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '32px' }}>
        {STEPS.map((s) => <StepCard key={s.number} {...s} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Button variant="primary" size="lg" arrow onClick={() => onNav('contact')}>Contact us</Button>
      </div>
    </section>
  );
}

function Faqs() {
  return (
    <section style={{ background: 'var(--surface-subtle)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '96px 24px' }}>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" style={{ marginBottom: '32px' }} />
        <Accordion items={FAQ} />
      </div>
    </section>
  );
}
Object.assign(window, { Testimonials, Engage, Faqs });
