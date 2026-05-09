interface FinalCTAProps {
  onBook: () => void;
  phone?: string;
}

const FALLBACK_PHONE = '+90 (212) 000 00 00';

function telHref(phone?: string) {
  if (!phone) return 'tel:+902120000000';
  return `tel:${phone.replace(/\s|\(|\)|-/g, '')}`;
}

export function FinalCTA({ onBook, phone }: FinalCTAProps) {
  const display = phone || FALLBACK_PHONE;
  return (
    <section id="contact" className="cta-block">
      <h2>
        Mülkünüzü <span className="it">satışa hazırlayalım.</span>
      </h2>
      <div className="actions">
        <button className="btn" onClick={onBook}>
          Online rezervasyon <span className="arrow">→</span>
        </button>
        <a href={telHref(phone)} className="btn btn-ghost">
          {display} <span className="arrow">↗</span>
        </a>
      </div>
    </section>
  );
}
