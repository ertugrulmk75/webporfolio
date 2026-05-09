'use client';
import { useReveal } from './useReveal';
import { urlFor } from '@/sanity/lib/image';
import type { SiteSettings } from '@/types/sanity';

interface HeroProps {
  onBook: () => void;
  hero?: SiteSettings['hero'];
  variant?: 'a' | 'b';
}

const FALLBACK_IMG_A =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80';
const FALLBACK_IMG_B =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80';

const FALLBACK_STATS = [
  { value: '240+', label: 'Tamamlanan Proje' },
  { value: '38', label: 'Şehir' },
  { value: '9 yıl', label: 'Deneyim' },
  { value: '2.4×', label: 'Ort. Görüntülenme Artışı' },
];

export function Hero({ onBook, hero, variant = 'a' }: HeroProps) {
  const ref = useReveal();

  const eyebrow = hero?.eyebrow ?? "İstanbul · 2017'den beri";
  const line1 = hero?.headlineLine1 ?? 'Mülkünüzü';
  const highlight = hero?.headlineHighlight ?? 'hak ettiği';
  const line2 = hero?.headlineLine2 ?? 'gibi gösterelim.';
  const subtitle =
    hero?.subtitle ??
    'Profesyonel emlak fotoğrafçılığı, drone, sanal tur ve cinematic video. Daha hızlı satış, daha yüksek görüntülenme, daha az pazarlık.';

  const featuredName = hero?.featuredProjectName ?? 'Bebek Yalı Dairesi';
  const featuredMeta = hero?.featuredProjectMeta ?? 'NO. 047 · 2026';

  const imgB = hero?.image2 ? urlFor(hero.image2 as any).width(1400).url() : FALLBACK_IMG_B;
  const imgA = hero?.image1 ? urlFor(hero.image1 as any).width(1400).url() : FALLBACK_IMG_A;
  const heroImg = variant === 'b' ? imgB : imgA;

  const stats = hero?.stats && hero.stats.length > 0 ? hero.stats : FALLBACK_STATS;

  return (
    <header id="top" className="hero" ref={ref as React.RefObject<HTMLElement>}>
      <div className="hero-grid">
        <div className="reveal-stagger">
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            {eyebrow}
          </div>
          <h1 className="hero-headline">
            {line1} <span className="it">{highlight}</span>
            <br />
            {line2}
          </h1>
          <p className="hero-sub">{subtitle}</p>
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
          <img src={heroImg} alt="Featured property" />
          <div className="hero-photo-meta">
            <b>{featuredName}</b>
            <span>{featuredMeta}</span>
          </div>
        </div>
      </div>

      <div className="hero-strip reveal-stagger">
        {stats.map((s, i) => (
          <div className="stat" key={`${s.label}-${i}`}>
            <div className="num">{s.value}</div>
            <div className="lbl">{s.label}</div>
          </div>
        ))}
      </div>
    </header>
  );
}
