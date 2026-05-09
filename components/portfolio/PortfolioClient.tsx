'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Nav } from '@/components/home/Nav';
import { Footer } from '@/components/home/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { urlFor } from '@/sanity/lib/image';
import type { PortfolioPageData, PortfolioProject, SanityImage } from '@/types/sanity';

const ALL_LABEL = 'Tümü';
const ALL_YEARS_LABEL = 'Tüm Yıllar';

function safeImageUrl(image?: SanityImage): string | null {
  if (!image || !image.asset) return null;
  try {
    return urlFor(image as unknown as Parameters<typeof urlFor>[0])
      .width(1600)
      .url();
  } catch {
    return null;
  }
}

export default function PortfolioClient({ data }: { data: PortfolioPageData }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [cat, setCat] = useState<string>(ALL_LABEL);
  const [year, setYear] = useState<string>(ALL_YEARS_LABEL);

  const projects: PortfolioProject[] = data?.projects ?? [];

  // Build category list from Sanity categories doc; ensure 'Tümü' is first.
  const categoryNames = useMemo<string[]>(() => {
    const fromCms = (data?.categories ?? [])
      .map((c) => c?.name)
      .filter((n): n is string => Boolean(n));
    // De-duplicate while keeping order, ensure 'Tümü' is first.
    const set = new Set<string>([ALL_LABEL, ...fromCms]);
    return Array.from(set);
  }, [data?.categories]);

  // Year list derived from projects (descending).
  const years = useMemo<string[]>(() => {
    const set = new Set<string>();
    for (const p of projects) if (p?.year) set.add(p.year);
    const sorted = Array.from(set).sort((a, b) => (b > a ? 1 : b < a ? -1 : 0));
    return [ALL_YEARS_LABEL, ...sorted];
  }, [projects]);

  // Counts per category, including total under 'Tümü'.
  const counts = useMemo<Record<string, number>>(() => {
    const acc: Record<string, number> = {};
    for (const c of categoryNames) {
      acc[c] =
        c === ALL_LABEL
          ? projects.length
          : projects.filter((p) => p?.category?.name === c).length;
    }
    return acc;
  }, [categoryNames, projects]);

  const filtered = useMemo<PortfolioProject[]>(() => {
    return projects.filter(
      (p) =>
        (cat === ALL_LABEL || p?.category?.name === cat) &&
        (year === ALL_YEARS_LABEL || p?.year === year)
    );
  }, [projects, cat, year]);

  return (
    <>
      <Nav onBook={() => setBookingOpen(true)} settings={data?.settings} />

      <main id="main">
      <header className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Anasayfa</Link>
            <span className="sep">/</span>
            <span>Portfolyo</span>
          </div>
          <h1>
            Tüm <span className="it">çalışmalarımız.</span>
          </h1>
          <p className="lede">
            2017&apos;den bugüne tamamladığımız projelerden seçkiler. Mülk tipine ve yıla göre
            filtreleyerek inceleyebilirsiniz.
          </p>
        </div>
      </header>

      <div className="chip-row">
        {categoryNames.map((c) => (
          <button
            key={c}
            className={`chip ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c} <span className="count">{counts[c] ?? 0}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {years.map((y) => (
          <button
            key={y}
            className={`chip ${year === y ? 'active' : ''}`}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      <section className="full-portfolio">
        {filtered.map((p) => {
          const src = safeImageUrl(p?.mainImage);
          return (
            <div key={p._id} className={`proj span-${p.span} ${p.kind}`}>
              <div className="proj-img">
                {src && (
                  <Image
                    src={src}
                    alt={p.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    loading="lazy"
                  />
                )}
                <div className="proj-overlay">
                  <div className="badge">
                    {p.category?.name ?? '—'} · {p.year ?? ''}
                  </div>
                  <div className="arrow-circle">→</div>
                </div>
              </div>
              <div className="proj-meta">
                <span className="name">{p.name}</span>
                <span className="loc">{p.location}</span>
              </div>
            </div>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div
          className="portfolio-page-empty"
          style={{
            textAlign: 'center',
            padding: '80px var(--pad-x)',
            color: 'var(--muted)',
          }}
        >
          <p style={{ fontFamily: 'var(--display)', fontSize: 32 }}>
            Bu kombinasyonda proje yok
          </p>
        </div>
      )}
      </main>

      <Footer settings={data?.settings} />
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </>
  );
}
