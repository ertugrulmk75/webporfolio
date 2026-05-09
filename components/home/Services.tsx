'use client';
import { useReveal } from './useReveal';
import type { Service } from '@/types/sanity';

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  const ref = useReveal();
  if (!services || services.length === 0) return null;
  const count = String(services.length).padStart(2, '0');
  return (
    <section id="services" className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Hizmetler / {count}</div>
          <div className="head-r">
            <h2>
              Tek bir stüdyodan,{' '}
              <span className="display italic" style={{ color: 'var(--accent)' }}>
                uçtan uca
              </span>{' '}
              görsel üretim.
            </h2>
            <p className="lede">
              Çekim, düzenleme, dağıtım. Sadece güzel kareler değil; pazarlanabilir bir paket
              teslim ediyoruz.
            </p>
          </div>
        </div>

        <div className="services-grid reveal-stagger">
          {services.map((s) => (
            <div className="svc" key={s._id}>
              <div className="svc-num">— {s.number}</div>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.description}</p>
              <div className="svc-meta">
                <span className="svc-tag">{s.tag}</span>
                <span className="svc-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
