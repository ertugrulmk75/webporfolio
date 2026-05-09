'use client';
import { useReveal } from './useReveal';
import { urlFor } from '@/sanity/lib/image';
import type { Testimonial } from '@/types/sanity';

interface TestimonialsProps {
  items: Testimonial[];
}

export function Testimonials({ items }: TestimonialsProps) {
  const ref = useReveal();
  if (!items || items.length === 0) return null;

  const renderStars = (rating?: number) => {
    const count = rating && rating > 0 ? Math.min(Math.round(rating), 5) : 5;
    return '★'.repeat(count);
  };

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Yorumlar / 4.9 ★</div>
          <div className="head-r">
            <h2>
              240+ projede{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                tam not
              </span>
              .
            </h2>
            <p className="lede">
              Brokerlar, mülk sahipleri ve geliştiriciler — birlikte çalıştığımız ekipler bizi
              yine arıyor.
            </p>
          </div>
        </div>

        <div className="tst-marquee">
          <div className="tst-marquee-track">
            {[...items, ...items].map((t, i) => {
              const avatarUrl = t.avatar
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  urlFor(t.avatar as any).width(80).height(80).url()
                : null;
              return (
                <div className="tst-card tst-marquee-card" key={`${t._id}-${i}`}>
                  <div className="tst-stars">{renderStars(t.rating)}</div>
                  <p className="tst-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="tst-meta">
                    <div className="tst-avatar">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={t.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '999px',
                          }}
                        />
                      ) : (
                        t.initial
                      )}
                    </div>
                    <div>
                      <div className="tst-name">{t.name}</div>
                      <div className="tst-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
