'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SiteSettings } from '@/types/sanity';

interface NavProps {
  onBook: () => void;
  settings?: SiteSettings;
}

type LinkItem = [label: string, href: string, internal?: boolean];

export function Nav({ onBook, settings }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeAnd = (fn?: () => void) => () => {
    setOpen(false);
    if (fn) fn();
  };

  const links: LinkItem[] = [
    ['Hizmetler', '/#services', true],
    ['Portfolyo', '/portfolyo', true],
    ['Blog', '/blog', true],
    ['Süreç', '/#process', true],
    ['Fiyatlar', '/#pricing', true],
    ['İletişim', '/#contact', true],
  ];

  const renderLink = (
    [t, h, internal]: LinkItem,
    extraProps: { onClick?: () => void; style?: React.CSSProperties } = {}
  ) =>
    internal ? (
      <Link key={h} href={h} {...extraProps}>
        {t}
      </Link>
    ) : (
      <a key={h} href={h} {...extraProps}>
        {t}
      </a>
    );

  const title = settings?.title || 'Fotograf';

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/#top" className="nav-logo">
          {title}
          <span className="dot"></span>
        </Link>
        <div className="nav-links">{links.map((l) => renderLink(l))}</div>
        <button className="nav-cta nav-cta-d" onClick={onBook}>
          Rezervasyon
          <span style={{ display: 'inline-block', transform: 'rotate(-45deg)' }}>→</span>
        </button>
        <button className="nav-mob" onClick={() => setOpen((o) => !o)} aria-label="Menü">
          <span className={`burger ${open ? 'x' : ''}`}>
            <i></i>
            <i></i>
          </span>
        </button>
      </nav>

      <div
        className={`nav-sheet ${open ? 'open' : ''}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('nav-sheet')) setOpen(false);
        }}
      >
        <div className="nav-sheet-inner">
          <div className="nav-sheet-links">
            {links.map((l, i) =>
              renderLink(l, {
                onClick: closeAnd(),
                style: { transitionDelay: `${i * 40}ms` },
              })
            )}
          </div>
          <button className="btn nav-sheet-cta" onClick={closeAnd(onBook)}>
            Rezervasyon yap <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
}
