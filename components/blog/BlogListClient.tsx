'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Nav } from '@/components/home/Nav';
import { Footer } from '@/components/home/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { urlFor } from '@/sanity/lib/image';
import { formatTurkishDate } from '@/lib/format';
import type { BlogPost, BlogCategory, SiteSettings } from '@/types/sanity';

interface BlogListClientProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  settings: SiteSettings;
}

export default function BlogListClient({ posts, settings }: BlogListClientProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [active, setActive] = useState<string>('Tümü');

  const cats: string[] = [
    'Tümü',
    ...Array.from(
      new Set(
        posts
          .map((p) => p.category?.name)
          .filter((n): n is string => typeof n === 'string' && n.length > 0)
      )
    ),
  ];

  const counts: Record<string, number> = cats.reduce<Record<string, number>>(
    (acc, c) => {
      acc[c] =
        c === 'Tümü'
          ? posts.length
          : posts.filter((p) => p.category?.name === c).length;
      return acc;
    },
    {}
  );

  const filtered =
    active === 'Tümü' ? posts : posts.filter((p) => p.category?.name === active);

  const featured = posts[0];
  const rest = featured ? filtered.filter((p) => p._id !== featured._id) : filtered;

  const onBook = () => setBookingOpen(true);

  const titleSplit = (title: string) => {
    const parts = title.split(' ');
    return {
      head: parts.slice(0, 2).join(' '),
      tail: parts.slice(2).join(' '),
    };
  };

  return (
    <>
      <Nav onBook={onBook} settings={settings} />

      <main id="main">
      <header className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Anasayfa</Link>
            <span className="sep">/</span>
            <span>Blog</span>
          </div>
          <h1>
            Sahnenin <span className="it">arkasında.</span>
          </h1>
          <p className="lede">
            Emlak fotoğrafçılığı, drone, sanal tur ve pazarlama üzerine
            deneyimlerimiz, teknik notlar ve sektör analizleri.
          </p>
        </div>
      </header>

      {posts.length === 0 ? (
        <div
          className="chip-row"
          style={{ borderBottom: 'none', justifyContent: 'center' }}
        >
          <span>Henüz yazı yok.</span>
        </div>
      ) : (
        <>
          <div className="chip-row">
            {cats.map((c) => (
              <button
                key={c}
                className={`chip ${active === c ? 'active' : ''}`}
                onClick={() => setActive(c)}
              >
                {c} <span className="count">{counts[c]}</span>
              </button>
            ))}
          </div>

          {active === 'Tümü' && featured && (
            <article className="blog-featured">
              <div className="ft-img">
                {featured.cover && (
                  <Image
                    src={urlFor(featured.cover as any).width(1600).url()}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                )}
              </div>
              <div>
                <div className="ft-meta">
                  Öne Çıkan{featured.category?.name ? ` · ${featured.category.name}` : ''}
                </div>
                <h2>
                  <span className="it">{titleSplit(featured.title).head}</span>{' '}
                  {titleSplit(featured.title).tail}
                </h2>
                <p>{featured.excerpt ?? ''}</p>
                <Link className="btn" href={`/blog/${featured.slug.current}`}>
                  Yazıyı oku <span className="arrow">→</span>
                </Link>
              </div>
            </article>
          )}

          <div className="blog-list">
            {(active === 'Tümü' ? rest : filtered).map((p) => (
              <Link
                key={p._id}
                className="blog-card"
                href={`/blog/${p.slug.current}`}
              >
                <div className="blog-meta">
                  {p.category?.name && <span className="cat">{p.category.name}</span>}
                  <span>{formatTurkishDate(p.publishedAt)}</span>
                  {p.readTime && <span>{p.readTime}</span>}
                </div>
                <div className="blog-title-block">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt ?? ''}</p>
                </div>
                <div className="blog-thumb">
                  {p.cover && (
                    <Image
                      src={urlFor(p.cover as any).width(1600).url()}
                      alt={p.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      loading="lazy"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      </main>
      <Footer settings={settings} />
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </>
  );
}
