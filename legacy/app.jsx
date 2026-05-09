// app.jsx — main Fotograf app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "displayFont": "Instrument Serif",
  "heroVariant": "a",
  "showTicker": true
}/*EDITMODE-END*/;

const THEME_OPTIONS = [
  ['#F2EDE3', '#14110F', '#B07A3B'],
  ['#14110F', '#F2EDE3', '#C8A26A'],
  ['#ECEAE0', '#1A2420', '#4F6B5A'],
];
const THEME_NAMES = ['paper', 'ink', 'sage'];

const DISPLAY_FONTS = {
  'Instrument Serif': "'Instrument Serif', 'Cormorant Garamond', serif",
  'Cormorant Garamond': "'Cormorant Garamond', 'Instrument Serif', serif",
  'DM Serif Display': "'DM Serif Display', 'Instrument Serif', serif",
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [bookOpen, setBookOpen] = React.useState(false);

  // Apply theme
  React.useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
  }, [t.theme]);

  // Apply display font
  React.useEffect(() => {
    document.documentElement.style.setProperty('--display', DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Instrument Serif']);
  }, [t.displayFont]);

  const themeIdx = THEME_NAMES.indexOf(t.theme);
  const safeThemeIdx = themeIdx < 0 ? 0 : themeIdx;

  const openBook = () => setBookOpen(true);
  const closeBook = () => setBookOpen(false);

  return (
    <>
      <Nav onBook={openBook} />
      <Hero onBook={openBook} variant={t.heroVariant} />
      {t.showTicker && <Ticker />}
      <Services />
      <Portfolio />
      <BeforeAfter />
      <Process />
      <Pricing onBook={openBook} />
      <Testimonials />
      <FinalCTA onBook={openBook} />
      <Footer />

      <BookingModal open={bookOpen} onClose={closeBook} />

      <TweaksPanel>
        <TweakSection label="Tema" />
        <TweakColor
          label="Renk paleti"
          value={THEME_OPTIONS[safeThemeIdx]}
          options={THEME_OPTIONS}
          onChange={(v) => {
            const idx = THEME_OPTIONS.findIndex(p => p[0] === v[0]);
            setTweak('theme', THEME_NAMES[idx >= 0 ? idx : 0]);
          }}
        />

        <TweakSection label="Tipografi" />
        <TweakSelect
          label="Display fontu"
          value={t.displayFont}
          options={Object.keys(DISPLAY_FONTS)}
          onChange={(v) => setTweak('displayFont', v)}
        />

        <TweakSection label="Hero" />
        <TweakRadio
          label="Hero görseli"
          value={t.heroVariant}
          options={['a', 'b']}
          onChange={(v) => setTweak('heroVariant', v)}
        />

        <TweakSection label="Bölümler" />
        <TweakToggle
          label="Hizmet ticker'ı"
          value={t.showTicker}
          onChange={(v) => setTweak('showTicker', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
