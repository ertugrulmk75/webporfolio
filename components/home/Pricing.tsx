'use client';
import { useReveal } from './useReveal';
import type { PricingTier } from '@/types/sanity';

interface PricingProps {
  tiers: PricingTier[];
  onBook: () => void;
}

export function Pricing({ tiers, onBook }: PricingProps) {
  const ref = useReveal();
  if (!tiers || tiers.length === 0) return null;
  return (
    <section id="pricing" className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Fiyatlandırma / TL</div>
          <div className="head-r">
            <h2>
              Şeffaf paketler,{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                gizli ücret yok
              </span>
              .
            </h2>
            <p className="lede">
              Daire için Standart, villa için Premium, ofis ve geliştiriciler için Kurumsal. KDV
              dahil.
            </p>
          </div>
        </div>

        <div className="pricing reveal">
          {tiers.map((t) => (
            <div key={t._id} className={`tier ${t.featured ? 'featured' : ''}`}>
              <div className="tier-tag">{t.tag}</div>
              <div className="tier-name">{t.name}</div>
              <div className="tier-price">
                {t.priceType === 'custom' ? (
                  <>
                    {t.price} <span className="period">/ {t.period || 'teklif'}</span>
                  </>
                ) : (
                  <>
                    <span className="currency">{t.currency || '₺'}</span>
                    {t.price}
                    <span className="period">{t.period || '/ proje'}</span>
                  </>
                )}
              </div>
              <ul className="tier-feats">
                {(t.features || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className="btn" onClick={onBook}>
                {t.ctaLabel || (t.featured ? 'Hemen rezervasyon' : 'Bu paketi seç')}
                <span className="arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
