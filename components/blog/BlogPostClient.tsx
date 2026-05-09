'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Nav } from '@/components/home/Nav';
import { Footer } from '@/components/home/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { urlFor } from '@/sanity/lib/image';
import { formatTurkishDate } from '@/lib/format';
import type { BlogPost, SiteSettings } from '@/types/sanity';

interface BlogPostClientProps {
  post: BlogPost;
  related: BlogPost[];
  settings: SiteSettings;
}

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
  },
  types: {
    pullQuote: ({ value }) => (
      <div className="pull">{value?.text}</div>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
};

export default function BlogPostClient({
  post,
  related,
  settings,
}: BlogPostClientProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const onBook = () => setBookingOpen(true);

  const author = post.author;
  const avatarUrl = author?.avatar
    ? urlFor(author.avatar as any).width(120).url()
    : null;

  return (
    <>
      <Nav onBook={onBook} settings={settings} />

      <header className="article-hero">
        <div className="breadcrumb">
          <Link href="/">Anasayfa</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <Link href="/blog">Blog</Link>
          {post.category?.name && (
            <>
              <span style={{ opacity: 0.5 }}>/</span>
              <span>{post.category.name}</span>
            </>
          )}
        </div>
        <div className="meta-row">
          {post.category?.name && <span className="cat">{post.category.name}</span>}
          <span>{formatTurkishDate(post.publishedAt)}</span>
          {post.readTime && <span>{post.readTime}</span>}
        </div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="article-lede">{post.excerpt}</p>}
      </header>

      {post.cover && (
        <div className="article-hero-img">
          <img
            src={urlFor(post.cover as any).width(1600).url()}
            alt={post.title}
          />
        </div>
      )}

      <article className="article">
        {post.body && post.body.length > 0 && (
          <PortableText value={post.body} components={ptComponents} />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="article-tags">
            {post.tags.map((t) => (
              <span key={t} className="article-tag">
                {t}
              </span>
            ))}
          </div>
        )}

        {author && (
          <div className="article-author">
            <div className="av">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={author.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                author.initial || author.name?.[0] || ''
              )}
            </div>
            <div>
              <div className="nm">{author.name}</div>
              {author.role && <div className="rl">{author.role}</div>}
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="related">
          <h2>İlgili yazılar</h2>
          <div className="related-grid">
            {related.map((r) => (
              <Link
                key={r._id}
                className="related-card"
                href={`/blog/${r.slug.current}`}
              >
                <div className="img">
                  {r.cover && (
                    <img
                      src={urlFor(r.cover as any).width(1600).url()}
                      alt={r.title}
                    />
                  )}
                </div>
                <div className="cat">
                  {r.category?.name ?? ''}
                  {r.readTime ? ` · ${r.readTime}` : ''}
                </div>
                <h4>{r.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer settings={settings} />
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </>
  );
}
