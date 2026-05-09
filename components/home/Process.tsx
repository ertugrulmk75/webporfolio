'use client';
import { useReveal } from './useReveal';
import type { ProcessStep } from '@/types/sanity';

interface ProcessProps {
  steps: ProcessStep[];
}

export function Process({ steps }: ProcessProps) {
  const ref = useReveal();
  if (!steps || steps.length === 0) return null;
  const count = String(steps.length).padStart(2, '0');
  return (
    <section id="process" className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Süreç / {count} Adım</div>
          <div className="head-r">
            <h2>
              Briefer, çekim, düzenleme,{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                teslim
              </span>
              .
            </h2>
            <p className="lede">
              Sözleşme imzalanır imzalanmaz net bir program çıkarıyoruz. Sürpriz yok, gecikme
              yok.
            </p>
          </div>
        </div>

        <div className="process reveal-stagger">
          {steps.map((s) => (
            <div className="step" key={s._id}>
              <div className="step-num">{s.number}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.description}</p>
              <div className="step-time">{s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
