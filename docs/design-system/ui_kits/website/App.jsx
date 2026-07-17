function App() {
  const [page, setPage] = React.useState('home');
  const scrollRef = React.useRef(null);
  const onNav = (p) => { setPage(p); const el = document.getElementById('kit-scroll'); if (el) el.scrollTop = 0; };
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  let body;
  if (page === 'home') body = <><window.HomePage onNav={onNav} /><window.Testimonials /><window.Engage onNav={onNav} /><window.Faqs /></>;
  else if (page === 'services') body = <window.ServicesPage />;
  else if (page === 'contact') body = <window.ContactPage />;
  else if (page === 'cases') body = <window.SimplePage eyebrow="Case studies" title="Outcomes across pharma, biotech & healthcare" lead="Browse how we've delivered AI, marketing technology and digital health solutions for global life-sciences leaders." />;
  else if (page === 'insights') body = <window.SimplePage eyebrow="Insights" title="Blogs, announcements & papers" lead="Perspectives from our engineers on AI delivery, compliance and digital health." />;
  else if (page === 'careers') body = <window.SimplePage eyebrow="Careers" title="Build breakthroughs with us" lead="We're a remote-first, distributed team across 10 countries. Hiring across engineering, AI and delivery." />;
  else body = <window.SimplePage eyebrow="About us" title="A trusted life-sciences technology partner" lead="We challenge the conventional approach to technology adoption, championing innovation to solve complex problems for pharma and biotech." />;

  const dark = page === 'home';
  return (
    <div id="kit-scroll" ref={scrollRef} style={{ height: '100vh', overflowY: 'auto', background: '#fff' }}>
      <window.Header page={page} onNav={onNav} dark={dark} />
      {body}
      <window.Footer onNav={onNav} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
setTimeout(() => window.lucide && window.lucide.createIcons(), 60);
