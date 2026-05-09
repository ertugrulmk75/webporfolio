// article-app.jsx — single blog post page

function ArticleApp() {
  const slug = new URLSearchParams(window.location.search).get('slug') || BLOG_POSTS[0].slug;
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
  const related = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);

  React.useEffect(() => { document.title = post.title + ' — Fotograf'; }, [post]);

  const renderBlock = (block, i) => {
    const [tag, ...content] = block;
    if (tag === 'h2') return <h2 key={i}>{content[0]}</h2>;
    if (tag === 'p') return <p key={i}>{content[0]}</p>;
    if (tag === 'pull') return <div key={i} className="pull">{content[0]}</div>;
    if (tag === 'img') return <img key={i} src={content[0]} alt="" />;
    if (tag === 'ul') return <ul key={i}>{content[0].map((li, j) => <li key={j}>{li}</li>)}</ul>;
    return null;
  };

  return (
    <>
      <SharedNav active="blog" />

      <header className="article-hero">
        <div className="breadcrumb">
          <a href="Fotograf.html">Anasayfa</a>
          <span style={{opacity:.5}}>/</span>
          <a href="Blog.html">Blog</a>
          <span style={{opacity:.5}}>/</span>
          <span>{post.cat}</span>
        </div>
        <div className="meta-row">
          <span className="cat">{post.cat}</span>
          <span>{post.date}</span>
          <span>{post.read}</span>
        </div>
        <h1>{post.title}</h1>
        <p className="article-lede">{post.excerpt}</p>
      </header>

      <div className="article-hero-img">
        <img src={post.cover} alt={post.title} />
      </div>

      <article className="article">
        {post.body.map(renderBlock)}

        <div className="article-tags">
          {post.tags.map(t => <span key={t} className="article-tag">{t}</span>)}
        </div>

        <div className="article-author">
          <div className="av">{post.authorInit}</div>
          <div>
            <div className="nm">{post.author}</div>
            <div className="rl">{post.authorRole}</div>
          </div>
        </div>
      </article>

      <section className="related">
        <h2>İlgili yazılar</h2>
        <div className="related-grid">
          {related.map(r => (
            <a key={r.id} className="related-card" href={`Article.html?slug=${r.slug}`}>
              <div className="img"><img src={r.cover} alt={r.title} /></div>
              <div className="cat">{r.cat} · {r.read}</div>
              <h4>{r.title}</h4>
            </a>
          ))}
        </div>
      </section>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ArticleApp />);
