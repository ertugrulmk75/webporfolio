// shared-nav.jsx — shared nav component for sub-pages

const SharedNav = ({ active }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    ['Hizmetler', 'Fotograf.html#services', 'services'],
    ['Portfolyo', 'Portfolyo.html', 'portfolio'],
    ['Blog', 'Blog.html', 'blog'],
    ['Süreç', 'Fotograf.html#process', 'process'],
    ['Fiyatlar', 'Fotograf.html#pricing', 'pricing'],
    ['İletişim', 'Fotograf.html#contact', 'contact'],
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="Fotograf.html" className="nav-logo">
          Fotograf<span className="dot"></span>
        </a>
        <div className="nav-links">
          {links.map(([t, h, id]) => (
            <a key={id} href={h} style={active === id ? { color: 'var(--ink)', fontWeight: 500 } : {}}>{t}</a>
          ))}
        </div>
        <a href="Fotograf.html#contact" className="nav-cta nav-cta-d">
          Rezervasyon
          <span style={{display:'inline-block', transform: 'rotate(-45deg)'}}>→</span>
        </a>
        <button className="nav-mob" onClick={() => setOpen(o => !o)} aria-label="Menü">
          <span className={`burger ${open ? 'x' : ''}`}>
            <i></i><i></i>
          </span>
        </button>
      </nav>

      <div className={`nav-sheet ${open ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('nav-sheet')) setOpen(false); }}>
        <div className="nav-sheet-inner">
          <div className="nav-sheet-links">
            {links.map(([t, h, id], i) => (
              <a key={id} href={h} onClick={() => setOpen(false)} style={{transitionDelay: `${i * 40}ms`}}>{t}</a>
            ))}
          </div>
          <a className="btn nav-sheet-cta" href="Fotograf.html#contact" onClick={() => setOpen(false)}>
            Rezervasyon yap <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </>
  );
};

const SharedFooter = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <div className="nav-logo">Fotograf<span className="dot"></span></div>
        <p>Türkiye'nin önde gelen emlak fotoğrafçılığı stüdyosu. İstanbul, Ankara, İzmir ve Bodrum'da hizmet veriyoruz.</p>
      </div>
      <div>
        <h4>Stüdyo</h4>
        <ul>
          <li><a href="Fotograf.html#services">Hizmetler</a></li>
          <li><a href="Portfolyo.html">Portfolyo</a></li>
          <li><a href="Blog.html">Blog</a></li>
          <li><a href="Fotograf.html#pricing">Fiyatlar</a></li>
        </ul>
      </div>
      <div>
        <h4>İletişim</h4>
        <ul>
          <li><a href="mailto:hello@fotograf.com">hello@fotograf.com</a></li>
          <li><a href="tel:+902120000000">+90 212 000 00 00</a></li>
          <li><a href="#">Maslak, İstanbul</a></li>
        </ul>
      </div>
      <div>
        <h4>Sosyal</h4>
        <ul>
          <li><a href="#">Instagram ↗</a></li>
          <li><a href="#">Behance ↗</a></li>
          <li><a href="#">YouTube ↗</a></li>
          <li><a href="#">LinkedIn ↗</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bot">
      <span>© 2026 Fotograf Stüdyo</span>
      <span>İstanbul · Ankara · İzmir · Bodrum</span>
    </div>
  </footer>
);

Object.assign(window, { SharedNav, SharedFooter });
