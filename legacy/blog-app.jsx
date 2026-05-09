// blog-app.jsx — Blog list page

function BlogApp() {
  const [active, setActive] = React.useState('Tümü');
  const cats = ['Tümü', ...Array.from(new Set(BLOG_POSTS.map(p => p.cat)))];
  const counts = cats.reduce((acc, c) => {
    acc[c] = c === 'Tümü' ? BLOG_POSTS.length : BLOG_POSTS.filter(p => p.cat === c).length;
    return acc;
  }, {});

  const filtered = active === 'Tümü' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.cat === active);
  const featured = BLOG_POSTS[0];
  const rest = filtered.filter(p => p.id !== featured.id);

  return (
    <>
      <SharedNav active="blog" />

      <header className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="Fotograf.html">Anasayfa</a>
            <span className="sep">/</span>
            <span>Blog</span>
          </div>
          <h1>Sahnenin <span className="it">arkasında.</span></h1>
          <p className="lede">Emlak fotoğrafçılığı, drone, sanal tur ve pazarlama üzerine deneyimlerimiz, teknik notlar ve sektör analizleri.</p>
        </div>
      </header>

      <div className="chip-row">
        {cats.map(c => (
          <button key={c} className={`chip ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>
            {c} <span className="count">{counts[c]}</span>
          </button>
        ))}
      </div>

      {active === 'Tümü' && (
        <article className="blog-featured">
          <div className="ft-img"><img src={featured.cover} alt={featured.title} /></div>
          <div>
            <div className="ft-meta">Öne Çıkan · {featured.cat}</div>
            <h2><span className="it">{featured.title.split(' ').slice(0, 2).join(' ')}</span> {featured.title.split(' ').slice(2).join(' ')}</h2>
            <p>{featured.excerpt}</p>
            <a className="btn" href={`Article.html?slug=${featured.slug}`}>
              Yazıyı oku <span className="arrow">→</span>
            </a>
          </div>
        </article>
      )}

      <div className="blog-list">
        {(active === 'Tümü' ? rest : filtered).map(p => (
          <a key={p.id} className="blog-card" href={`Article.html?slug=${p.slug}`}>
            <div className="blog-meta">
              <span className="cat">{p.cat}</span>
              <span>{p.date}</span>
              <span>{p.read}</span>
            </div>
            <div className="blog-title-block">
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </div>
            <div className="blog-thumb">
              <img src={p.cover} alt={p.title} loading="lazy" />
            </div>
          </a>
        ))}
      </div>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BlogApp />);
