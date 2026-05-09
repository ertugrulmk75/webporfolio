// booking.jsx — Multi-step booking modal (no pricing, no date step)

const BOOK_SERVICES = [
  { id: 'photo', title: 'Fotoğraf Çekimi', desc: 'HDR + profesyonel düzenleme' },
  { id: 'drone', title: 'Drone & Hava Çekimi', desc: 'Foto + 4K video' },
  { id: 'tour',  title: '360° Sanal Tur',     desc: 'Web + VR uyumlu' },
  { id: 'video', title: 'Tanıtım Videosu',    desc: '60 sn cinematic' },
  { id: 'plan',  title: 'Kat Planı',          desc: '2D + 3D' },
  { id: 'stage', title: 'Sanal Staging',      desc: 'Üç farklı stil' },
];

const PROPERTY_TYPES = [
  { id: 'apt',   title: 'Daire',         desc: '1+1 / 2+1 / 3+1' },
  { id: 'villa', title: 'Villa',         desc: 'Müstakil ev / yalı' },
  { id: 'duplex',title: 'Dubleks / Triplex', desc: 'Çok katlı konut' },
  { id: 'office',title: 'Ofis & Ticari', desc: 'Mağaza, ofis, AVM' },
];

const BookingModal = ({ open, onClose }) => {
  const [step, setStep] = React.useState(0);
  const [services, setServices] = React.useState(['photo']);
  const [propType, setPropType] = React.useState('apt');
  const [meters, setMeters]   = React.useState(120);
  const [city, setCity]       = React.useState('İstanbul');
  const [name, setName]       = React.useState('');
  const [phone, setPhone]     = React.useState('');
  const [email, setEmail]     = React.useState('');
  const [notes, setNotes]     = React.useState('');
  const [done, setDone]       = React.useState(false);

  React.useEffect(() => {
    if (open) { setStep(0); setDone(false); }
  }, [open]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggleService = (id) => {
    setServices(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const STEPS = ['Hizmet', 'Mülk', 'İletişim', 'Özet'];

  const canNext = () => {
    if (step === 0) return services.length > 0;
    if (step === 1) return propType && meters && city.trim();
    if (step === 2) return name.trim() && phone.trim() && email.trim();
    return true;
  };

  const submit = () => { setDone(true); };

  return (
    <div className={`modal-back ${open ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal-back')) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        {!done ? (
          <>
            <div className="modal-hd">
              <span className="step-of">Adım {step + 1} / {STEPS.length} · {STEPS[step]}</span>
              <button className="modal-x" onClick={onClose} aria-label="Kapat">✕</button>
            </div>
            <div className="modal-progress"><div style={{width: `${((step+1)/STEPS.length)*100}%`}} /></div>

            <div className="modal-bd">
              {step === 0 && (
                <>
                  <h3>Hangi hizmetleri istiyorsunuz?</h3>
                  <p className="lede">Birden fazla seçebilirsiniz. Çekim sonrası fiyat teklifimizi e-posta ile gönderiyoruz.</p>
                  <div className="choice-grid">
                    {BOOK_SERVICES.map(s => (
                      <div key={s.id}
                           className={`choice ${services.includes(s.id) ? 'selected' : ''}`}
                           onClick={() => toggleService(s.id)}>
                        <div className="choice-title">{s.title}</div>
                        <div className="choice-desc">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h3>Mülk hakkında birkaç bilgi.</h3>
                  <p className="lede">Tip ve metrekareye göre çekim süresini ve ekipmanı hazırlıyoruz.</p>

                  <div className="field">
                    <span className="field-lbl">Mülk Tipi</span>
                    <div className="choice-grid">
                      {PROPERTY_TYPES.map(p => (
                        <div key={p.id}
                             className={`choice ${propType === p.id ? 'selected' : ''}`}
                             onClick={() => setPropType(p.id)}>
                          <div className="choice-title">{p.title}</div>
                          <div className="choice-desc">{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12}}>
                    <div className="field">
                      <span className="field-lbl">Metrekare ({meters} m²)</span>
                      <input type="range" min="40" max="500" step="10" value={meters}
                             onChange={(e) => setMeters(+e.target.value)}
                             style={{width:'100%', accentColor:'var(--ink)'}} />
                    </div>
                    <div className="field">
                      <span className="field-lbl">Şehir / Konum</span>
                      <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="İstanbul, Beşiktaş" />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h3>Sizinle nasıl iletişim kuralım?</h3>
                  <p className="lede">Onay ve tarih planlaması için iletişim bilgilerinizi alıyoruz.</p>
                  <div className="field">
                    <label>Ad Soyad</label>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız" />
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
                    <div className="field">
                      <label>Telefon</label>
                      <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5XX XXX XX XX" />
                    </div>
                    <div className="field">
                      <label>E-posta</label>
                      <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Not (opsiyonel)</label>
                    <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mülk veya çekim hakkında özel bir not"></textarea>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3>Talebinizin özeti.</h3>
                  <p className="lede">Bilgileri kontrol edip gönderin. Ekibimiz 24 saat içinde sizinle iletişime geçecek.</p>

                  <div className="summary">
                    <div className="summary-row">
                      <span className="lbl">Hizmetler</span>
                      <span className="val">{services.map(id => BOOK_SERVICES.find(s => s.id===id)?.title).join(', ')}</span>
                    </div>
                    <div className="summary-row">
                      <span className="lbl">Mülk</span>
                      <span className="val">{PROPERTY_TYPES.find(p=>p.id===propType)?.title} · {meters} m²</span>
                    </div>
                    <div className="summary-row">
                      <span className="lbl">Konum</span>
                      <span className="val">{city}</span>
                    </div>
                    <div className="summary-row">
                      <span className="lbl">Adına</span>
                      <span className="val">{name || '—'}</span>
                    </div>
                    <div className="summary-row">
                      <span className="lbl">İletişim</span>
                      <span className="val">{phone || '—'} · {email || '—'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-ft">
              <button className="btn-text" onClick={() => step > 0 ? setStep(step - 1) : onClose()}>
                ← {step > 0 ? 'Geri' : 'Kapat'}
              </button>
              <div style={{display:'flex', alignItems:'center', gap:16}}>
                {step < STEPS.length - 1 ? (
                  <button className="btn" disabled={!canNext()} onClick={() => canNext() && setStep(step + 1)}
                          style={!canNext() ? {opacity: .4, cursor: 'not-allowed'} : {}}>
                    Devam <span className="arrow">→</span>
                  </button>
                ) : (
                  <button className="btn" onClick={submit}>
                    Talebi gönder <span className="arrow">✓</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="modal-hd">
              <span className="step-of">Alındı</span>
              <button className="modal-x" onClick={onClose} aria-label="Kapat">✕</button>
            </div>
            <div className="modal-bd">
              <div className="success-state">
                <div className="check">✓</div>
                <h3 className="display">Talebiniz alındı.</h3>
                <p>24 saat içinde sizi arayacağız ve detayları planlayacağız. {email} adresine onay maili gönderildi.</p>
                <div style={{marginTop: 32}}>
                  <button className="btn" onClick={onClose}>Tamam <span className="arrow">→</span></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { BookingModal });
