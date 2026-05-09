// portfolio-app.jsx — full Portfolio listing page

function PortfolioApp() {
  const [cat, setCat] = React.useState('Tümü');
  const [year, setYear] = React.useState('Tüm Yıllar');

  const years = ['Tüm Yıllar', ...Array.from(new Set(ALL_PROJECTS.map(p => p.year))).sort((a,b) => b-a)];

  const filtered = ALL_PROJECTS.filter(p =>
    (cat === 'Tümü' || p.cat === cat) &&
    (year === 'Tüm Yıllar' || p.year === year)
  );

  const counts = PORTFOLIO_CATS.reduce((acc, c) => {
    acc[c] = c === 'Tümü' ? ALL_PROJECTS.length : ALL_PROJECTS.filter(p => p.cat === c).length;
    return acc;
  }, {});

  return (
    <>
      <SharedNav active="portfolio" />

      <header className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="Fotograf.html">Anasayfa</a>
            <span className="sep">/</span>
            <span>Portfolyo</span>
          </div>
          <h1>Tüm <span className="it">çalışmalarımız.</span></h1>
          <p className="lede">2017'den bugüne tamamladığımız 240+ projeden seçkiler. Mülk tipine ve yıla göre filtreleyerek inceleyebilirsiniz.</p>
        </div>
      </header>

      <div className="chip-row">
        {PORTFOLIO_CATS.map(c => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c} <span className="count">{counts[c]}</span>
          </button>
        ))}
        <div style={{flex: 1}} />
        {years.map(y => (
          <button key={y} className={`chip ${year === y ? 'active' : ''}`} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      <section className="full-portfolio">
        {filtered.map(p => (
          <div key={p.id} className={`proj span-${p.span} ${p.kind}`}>
            <div className="proj-img">
              <img src={p.img} alt={p.name} loading="lazy" />
              <div className="proj-overlay">
                <div className="badge">{p.cat} · {p.year}</div>
                <div className="arrow-circle">→</div>
              </div>
            </div>
            <div className="proj-meta">
              <span className="name">{p.name}</span>
              <span className="loc">{p.loc}</span>
            </div>
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <div style={{textAlign:'center', padding: '80px var(--pad-x)', color: 'var(--muted)'}}>
          <p style={{fontFamily:'var(--display)', fontSize: 32}}>Bu kriterlere uyan proje bulunamadı.</p>
        </div>
      )}

      <div className="pagination">
        <button className="page-btn prev">← Önceki</button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn next">Sonraki →</button>
      </div>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PortfolioApp />);
