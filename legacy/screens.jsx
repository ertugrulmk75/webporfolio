// screens.jsx — Hero, Services, Portfolio, Before/After, Process, Pricing, Testimonials, CTA, Footer

const useReveal = (deps = []) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    el.querySelectorAll('.reveal, .reveal-stagger').forEach(n => io.observe(n));
    return () => io.disconnect();
  }, deps);
  return ref;
};

// ── Nav ─────────────────────────────────────────────
const Nav = ({ onBook }) => {
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
  const closeAnd = (fn) => () => { setOpen(false); if (fn) fn(); };
  const links = [
    ['Hizmetler', '#services'],
    ['Portfolyo', 'Portfolyo.html'],
    ['Blog', 'Blog.html'],
    ['Süreç', '#process'],
    ['Fiyatlar', '#pricing'],
    ['İletişim', '#contact'],
  ];
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#top" className="nav-logo">
          Fotograf<span className="dot"></span>
        </a>
        <div className="nav-links">
          {links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
        </div>
        <button className="nav-cta nav-cta-d" onClick={onBook}>
          Rezervasyon
          <span style={{display:'inline-block', transform: 'rotate(-45deg)'}}>→</span>
        </button>
        <button className="nav-mob" onClick={() => setOpen(o => !o)} aria-label="Menü">
          <span className={`burger ${open ? 'x' : ''}`}>
            <i></i><i></i>
          </span>
        </button>
      </nav>

      <div className={`nav-sheet ${open ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('nav-sheet')) setOpen(false); }}>
        <div className="nav-sheet-inner">
          <div className="nav-sheet-links">
            {links.map(([t, h], i) => (
              <a key={h} href={h} onClick={closeAnd()} style={{transitionDelay: `${i * 40}ms`}}>{t}</a>
            ))}
          </div>
          <button className="btn nav-sheet-cta" onClick={closeAnd(onBook)}>
            Rezervasyon yap <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
};

// ── Hero ────────────────────────────────────────────
const Hero = ({ onBook, variant }) => {
  const ref = useReveal();
  return (
    <header id="top" className="hero" ref={ref}>
      <div className="hero-grid">
        <div className="reveal-stagger">
          <div className="eyebrow" style={{marginBottom: 24}}>İstanbul · 2017'den beri</div>
          <h1 className="hero-headline">
            Mülkünüzü <span className="it">hak ettiği</span><br/>
            gibi gösterelim.
          </h1>
          <p className="hero-sub">
            Profesyonel emlak fotoğrafçılığı, drone, sanal tur ve cinematic video.
            Daha hızlı satış, daha yüksek görüntülenme, daha az pazarlık.
          </p>
          <div className="hero-actions">
            <button className="btn" onClick={onBook}>
              Rezervasyon yap <span className="arrow">→</span>
            </button>
            <a href="#portfolio" className="btn btn-ghost">
              Portfolyoyu gör <span className="arrow">↓</span>
            </a>
          </div>
        </div>

        <div className="reveal hero-photo">
          <img src={variant === 'b' ? PHOTOS.hero2 : PHOTOS.hero} alt="Featured property" />
          <div className="hero-photo-meta">
            <b>Bebek Yalı Dairesi</b>
            <span>NO. 047 · 2026</span>
          </div>
        </div>
      </div>

      <div className="hero-strip reveal-stagger">
        <div className="stat"><div className="num">240+</div><div className="lbl">Tamamlanan Proje</div></div>
        <div className="stat"><div className="num">38</div><div className="lbl">Şehir</div></div>
        <div className="stat"><div className="num">9 yıl</div><div className="lbl">Deneyim</div></div>
        <div className="stat"><div className="num">2.4×</div><div className="lbl">Ort. Görüntülenme Artışı</div></div>
      </div>
    </header>
  );
};

// ── Ticker ──────────────────────────────────────────
const Ticker = () => (
  <div className="ticker">
    <div className="ticker-track">
      {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
        <span key={i} className="ticker-item">
          {t} <span className="star">✦</span>
        </span>
      ))}
    </div>
  </div>
);

// ── Services ────────────────────────────────────────
const Services = () => {
  const ref = useReveal();
  return (
    <section id="services" className="section" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Hizmetler / 06</div>
          <div className="head-r">
            <h2>Tek bir stüdyodan, <span className="display italic" style={{color:'var(--accent)'}}>uçtan uca</span> görsel üretim.</h2>
            <p className="lede">Çekim, düzenleme, dağıtım. Sadece güzel kareler değil; pazarlanabilir bir paket teslim ediyoruz.</p>
          </div>
        </div>

        <div className="services-grid reveal-stagger">
          {SERVICES.map(s => (
            <div className="svc" key={s.n}>
              <div className="svc-num">— {s.n}</div>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <div className="svc-meta">
                <span className="svc-tag">{s.tag}</span>
                <span className="svc-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Portfolio ───────────────────────────────────────
const Portfolio = () => {
  const ref = useReveal();
  return (
    <section id="portfolio" className="section" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Seçili İşler / 2024–2026</div>
          <div className="head-r">
            <h2>Son <span className="italic" style={{color:'var(--accent)'}}>yedi</span> proje, yedi farklı hikaye.</h2>
            <p className="lede">Her mülkün karakteri farklıdır. Çekim planını, ışığı ve montaj tonunu mülke göre uyarlıyoruz.</p>
          </div>
        </div>

        <div className="portfolio reveal-stagger">
          {PROJECTS.map(p => (
            <div key={p.id} className={`proj span-${p.span} ${p.kind}`}>
              <div className="proj-img"><img src={p.img} alt={p.name} loading="lazy" /></div>
              <div className="proj-meta">
                <span className="name">{p.name}</span>
                <span className="loc">{p.loc}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop: 48, display:'flex', justifyContent:'center'}}>
          <a className="btn btn-ghost" href="#">Tüm portfolyoyu gör <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
};

// ── Before / After ──────────────────────────────────
const BeforeAfter = () => {
  const ref = useReveal();
  const [pair, setPair] = React.useState(0);
  const [pos, setPos] = React.useState(50);
  const wrapRef = React.useRef(null);
  const dragging = React.useRef(false);

  const setFromEvent = (clientX) => {
    const r = wrapRef.current.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  const onDown = (e) => { dragging.current = true; setFromEvent(e.touches ? e.touches[0].clientX : e.clientX); };
  const onMove = (e) => { if (!dragging.current) return; setFromEvent(e.touches ? e.touches[0].clientX : e.clientX); };
  const onUp = () => { dragging.current = false; };

  React.useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const cur = BA_PAIRS[pair];

  return (
    <section id="before-after" className="section" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Önce / Sonra</div>
          <div className="head-r">
            <h2>Aynı oda, <span className="italic" style={{color:'var(--accent)'}}>iki farklı</span> ilan.</h2>
            <p className="lede">Sürükleyerek karşılaştırın. Profesyonel ışık, doğru lens ve düzenleme; aynı m²'yi farklı bir mülke dönüştürür.</p>
          </div>
        </div>

        <div className="reveal">
          <div
            className="ba-wrap"
            ref={wrapRef}
            onMouseDown={onDown}
            onTouchStart={onDown}
            style={{ ['--ba-pos']: pos + '%' }}
          >
            <img className="ba-img" src={cur.before} alt="Before" />
            <div className="ba-after-clip">
              <img className="ba-img" src={cur.after} alt="After" />
            </div>
            <div className="ba-handle">
              <div className="ba-knob"></div>
            </div>
            <div className="ba-label before">Önce</div>
            <div className="ba-label after">Sonra</div>
          </div>

          <div className="ba-thumbs">
            {BA_PAIRS.map((p, i) => (
              <div key={p.id} className={`ba-thumb ${i === pair ? 'active' : ''}`} onClick={() => { setPair(i); setPos(50); }}>
                <img src={p.after} alt={p.label} />
              </div>
            ))}
            <div style={{display:'flex', alignItems:'center', padding: '0 16px', fontFamily:'var(--mono)', fontSize: 11, color:'var(--muted)', letterSpacing:'.12em', textTransform:'uppercase'}}>
              {cur.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Process ─────────────────────────────────────────
const Process = () => {
  const ref = useReveal();
  return (
    <section id="process" className="section" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Süreç / 04 Adım</div>
          <div className="head-r">
            <h2>Briefer, çekim, düzenleme, <span className="italic" style={{color:'var(--accent)'}}>teslim</span>.</h2>
            <p className="lede">Sözleşme imzalanır imzalanmaz net bir program çıkarıyoruz. Sürpriz yok, gecikme yok.</p>
          </div>
        </div>

        <div className="process reveal-stagger">
          {PROCESS.map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3 className="step-title">{s.t}</h3>
              <p className="step-desc">{s.d}</p>
              <div className="step-time">{s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Pricing ─────────────────────────────────────────
const Pricing = ({ onBook }) => {
  const ref = useReveal();
  return (
    <section id="pricing" className="section" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Fiyatlandırma / TL</div>
          <div className="head-r">
            <h2>Şeffaf paketler, <span className="italic" style={{color:'var(--accent)'}}>gizli ücret yok</span>.</h2>
            <p className="lede">Daire için Standart, villa için Premium, ofis ve geliştiriciler için Kurumsal. KDV dahil.</p>
          </div>
        </div>

        <div className="pricing reveal">
          {TIERS.map((t, i) => (
            <div key={t.name} className={`tier ${t.featured ? 'featured' : ''}`}>
              <div className="tier-tag">{t.tag}</div>
              <div className="tier-name">{t.name}</div>
              <div className="tier-price">
                {t.price === 'Özel' ? (
                  <>Özel <span className="period">/ teklif</span></>
                ) : (
                  <><span className="currency">₺</span>{t.price}<span className="period">/ proje</span></>
                )}
              </div>
              <ul className="tier-feats">
                {t.feats.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="btn" onClick={onBook}>
                {t.featured ? 'Hemen rezervasyon' : 'Bu paketi seç'}
                <span className="arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Testimonials ────────────────────────────────────
const Testimonials = () => {
  const ref = useReveal();
  return (
    <section className="section" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Yorumlar / 4.9 ★</div>
          <div className="head-r">
            <h2>240+ projede <span className="italic" style={{color:'var(--accent)'}}>tam not</span>.</h2>
            <p className="lede">Brokerlar, mülk sahipleri ve geliştiriciler — birlikte çalıştığımız ekipler bizi yine arıyor.</p>
          </div>
        </div>

        <div className="tst reveal-stagger">
          {TESTIMONIALS.map(t => (
            <div className="tst-card" key={t.name}>
              <div className="tst-stars">★★★★★</div>
              <p className="tst-quote">"{t.quote}"</p>
              <div className="tst-meta">
                <div className="tst-avatar">{t.initial}</div>
                <div>
                  <div className="tst-name">{t.name}</div>
                  <div className="tst-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── CTA + Footer ────────────────────────────────────
const FinalCTA = ({ onBook }) => (
  <section id="contact" className="cta-block">
    <h2>
      Mülkünüzü <span className="it">satışa hazırlayalım.</span>
    </h2>
    <div className="actions">
      <button className="btn" onClick={onBook}>
        Online rezervasyon <span className="arrow">→</span>
      </button>
      <a href="tel:+902120000000" className="btn btn-ghost">
        +90 (212) 000 00 00 <span className="arrow">↗</span>
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <div className="nav-logo">Fotograf<span className="dot"></span></div>
        <p>Türkiye'nin önde gelen emlak fotoğrafçılığı stüdyosu. İstanbul, Ankara, İzmir ve Bodrum'da hizmet veriyoruz.</p>
      </div>
      <div>
        <h4>Stüdyo</h4>
        <ul>
          <li><a href="#services">Hizmetler</a></li>
          <li><a href="Portfolyo.html">Portfolyo</a></li>
          <li><a href="Blog.html">Blog</a></li>
          <li><a href="#process">Süreç</a></li>
          <li><a href="#pricing">Fiyatlar</a></li>
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

Object.assign(window, {
  Nav, Hero, Ticker, Services, Portfolio, BeforeAfter, Process, Pricing, Testimonials, FinalCTA, Footer
});
