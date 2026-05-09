'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReveal } from './useReveal';
import { urlFor } from '@/sanity/lib/image';
import type { BeforeAfterPair } from '@/types/sanity';

interface BeforeAfterProps {
  pairs: BeforeAfterPair[];
}

export function BeforeAfter({ pairs }: BeforeAfterProps) {
  const ref = useReveal();
  const [pair, setPair] = useState(0);
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const setFromEvent = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    if ('touches' in e) {
      setFromEvent(e.touches[0].clientX);
    } else {
      setFromEvent(e.clientX);
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      if ('touches' in e) {
        setFromEvent(e.touches[0].clientX);
      } else {
        setFromEvent(e.clientX);
      }
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  if (!pairs || pairs.length === 0) return null;

  const cur = pairs[pair] ?? pairs[0];

  return (
    <section id="before-after" className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Önce / Sonra</div>
          <div className="head-r">
            <h2>
              Aynı oda,{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                iki farklı
              </span>{' '}
              ilan.
            </h2>
            <p className="lede">
              Sürükleyerek karşılaştırın. Profesyonel ışık, doğru lens ve düzenleme; aynı m²'yi
              farklı bir mülke dönüştürür.
            </p>
          </div>
        </div>

        <div className="reveal">
          <div
            className="ba-wrap"
            ref={wrapRef}
            onMouseDown={onDown}
            onTouchStart={onDown}
            style={{ ['--ba-pos' as any]: pos + '%' }}
          >
            <Image
              className="ba-img"
              src={urlFor(cur.before as any).width(1600).url()}
              alt="Before"
              fill
              sizes="(max-width: 900px) 100vw, 1200px"
            />
            <div className="ba-after-clip">
              <Image
                className="ba-img"
                src={urlFor(cur.after as any).width(1600).url()}
                alt="After"
                fill
                sizes="(max-width: 900px) 100vw, 1200px"
              />
            </div>
            <div className="ba-handle">
              <div className="ba-knob"></div>
            </div>
            <div className="ba-label before">Önce</div>
            <div className="ba-label after">Sonra</div>
          </div>

          <div className="ba-thumbs">
            {pairs.map((p, i) => (
              <div
                key={p._id}
                className={`ba-thumb ${i === pair ? 'active' : ''}`}
                onClick={() => {
                  setPair(i);
                  setPos(50);
                }}
              >
                <Image
                  src={urlFor(p.after as any).width(400).url()}
                  alt={p.label}
                  fill
                  sizes="96px"
                />
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--muted)',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
              }}
            >
              {cur.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
