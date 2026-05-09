'use client';
import Link from 'next/link';
import { useReveal } from './useReveal';
import { urlFor } from '@/sanity/lib/image';
import type { PortfolioProject } from '@/types/sanity';

interface PortfolioProps {
  projects: PortfolioProject[];
}

export function Portfolio({ projects }: PortfolioProps) {
  const ref = useReveal();
  if (!projects || projects.length === 0) return null;
  return (
    <section id="portfolio" className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Seçili İşler / 2024–2026</div>
          <div className="head-r">
            <h2>
              Son{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                yedi
              </span>{' '}
              proje, yedi farklı hikaye.
            </h2>
            <p className="lede">
              Her mülkün karakteri farklıdır. Çekim planını, ışığı ve montaj tonunu mülke göre
              uyarlıyoruz.
            </p>
          </div>
        </div>

        <div className="portfolio reveal-stagger">
          {projects.map((p) => (
            <div key={p._id} className={`proj span-${p.span} ${p.kind}`}>
              <div className="proj-img">
                <img
                  src={urlFor(p.mainImage as any).width(1600).url()}
                  alt={p.name}
                  loading="lazy"
                />
              </div>
              <div className="proj-meta">
                <span className="name">{p.name}</span>
                <span className="loc">{p.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
          <Link className="btn btn-ghost" href="/portfolyo">
            Tüm portfolyoyu gör <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
