import Link from 'next/link';
import type { SiteSettings } from '@/types/sanity';

interface FooterProps {
  settings?: SiteSettings;
}

const FALLBACK_DESC =
  "Türkiye'nin önde gelen emlak fotoğrafçılığı stüdyosu. İstanbul, Ankara, İzmir ve Bodrum'da hizmet veriyoruz.";

function telHref(phone: string) {
  // Keep leading + and digits only for the tel: scheme.
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

export function Footer({ settings }: FooterProps) {
  const title = settings?.title || 'Fotograf';
  const desc = settings?.footerDescription || FALLBACK_DESC;
  const email = settings?.contact?.email?.trim();
  const phone = settings?.contact?.phone?.trim();
  const address = settings?.contact?.address?.trim();
  const social = settings?.social ?? {};

  const socialLinks = [
    { key: 'instagram', label: 'Instagram', href: social.instagram },
    { key: 'behance', label: 'Behance', href: social.behance },
    { key: 'youtube', label: 'YouTube', href: social.youtube },
    { key: 'linkedin', label: 'LinkedIn', href: social.linkedin },
  ].filter((s): s is { key: string; label: string; href: string } => !!s.href && s.href.trim().length > 0);

  const hasContact = !!(email || phone || address);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="nav-logo">
            {title}
            <span className="dot"></span>
          </div>
          <p>{desc}</p>
        </div>
        <div>
          <h3>Stüdyo</h3>
          <ul>
            <li>
              <a href="#services">Hizmetler</a>
            </li>
            <li>
              <Link href="/portfolyo">Portfolyo</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <a href="#process">Süreç</a>
            </li>
            <li>
              <a href="#pricing">Fiyatlar</a>
            </li>
          </ul>
        </div>
        {hasContact && (
          <div>
            <h3>İletişim</h3>
            <ul>
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={telHref(phone)}>{phone}</a>
                </li>
              )}
              {address && (
                <li>
                  <a href="#">{address}</a>
                </li>
              )}
            </ul>
          </div>
        )}
        {socialLinks.length > 0 && (
          <div>
            <h3>Sosyal</h3>
            <ul>
              {socialLinks.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="footer-bot">
        <span>© {new Date().getFullYear()} {title} Stüdyo</span>
        <span>İstanbul · Ankara · İzmir · Bodrum</span>
      </div>
    </footer>
  );
}
