// data.jsx — content constants for Fotograf site

// Real estate interior photos via Unsplash (architectural / interior)
const PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
  hero2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',

  // Portfolio
  villa: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
  loft: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80',
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  pool: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80',
  bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80',
  livingroom: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80',
  bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
  exterior: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=80',
  drone: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80',
  diningroom: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1400&q=80',

  // Before/after pairs (use bright/dark variants of same room shots)
  baBefore1: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=70&sat=-100&exp=-30',
  baAfter1:  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=85',
  baBefore2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=70&sat=-100&exp=-30',
  baAfter2:  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=85',
  baBefore3: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=70&sat=-100&exp=-30',
  baAfter3:  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=85',
};

const SERVICES = [
  {
    n: '01', title: 'Profesyonel Fotoğraf',
    desc: 'HDR teknikleri ile aydınlık, dengeli, ilanlarda öne çıkan profesyonel iç ve dış mekan çekimleri.',
    tag: '25–40 kare',
  },
  {
    n: '02', title: 'Drone Çekimi',
    desc: 'Lisanslı drone ile havadan fotoğraf ve 4K video; konumun çevresini ve arsayı gösterin.',
    tag: 'DJI Air 3S',
  },
  {
    n: '03', title: '360° Sanal Tur',
    desc: 'Matterport benzeri etkileşimli tur. Alıcılar fiziken gelmeden mülkü gezsin.',
    tag: 'Web + VR',
  },
  {
    n: '04', title: 'Tanıtım Videosu',
    desc: 'Kısa cinematic video — sosyal medya reels ve YouTube için 30s, 60s, 90s formatlarda.',
    tag: '4K · gimbal',
  },
  {
    n: '05', title: 'Kat Planı',
    desc: 'Ölçekli 2D ve 3D kat planları — m², oda dağılımı, bilgilendirici notlarla birlikte.',
    tag: '2D · 3D',
  },
  {
    n: '06', title: 'Sanal Staging',
    desc: 'Boş veya yıpranmış mekanları dijital olarak döşeyin. Üç farklı stilde sunum.',
    tag: 'Modern · Klasik · Boho',
  },
];

const PROJECTS = [
  { id: 'p1', name: 'Bebek Yalı Dairesi', loc: 'İstanbul / Boğaz', img: PHOTOS.livingroom, kind: 'tall', span: 7 },
  { id: 'p2', name: 'Çeşme Villası',      loc: 'İzmir / Çeşme',   img: PHOTOS.pool,       kind: 'tall', span: 5 },
  { id: 'p3', name: 'Cihangir Loft',      loc: 'İstanbul / Beyoğlu', img: PHOTOS.loft,    kind: 'sq',   span: 4 },
  { id: 'p4', name: 'Etiler Triplex',     loc: 'İstanbul / Beşiktaş', img: PHOTOS.kitchen, kind: 'sq',  span: 4 },
  { id: 'p5', name: 'Yıldız Konağı',      loc: 'Ankara / Çankaya', img: PHOTOS.bedroom,   kind: 'sq',   span: 4 },
  { id: 'p6', name: 'Bodrum Yalısı',      loc: 'Muğla / Yalıkavak', img: PHOTOS.exterior, kind: 'wide', span: 8 },
  { id: 'p7', name: 'Levent Penthouse',   loc: 'İstanbul / Şişli',  img: PHOTOS.diningroom, kind: 'wide', span: 4 },
];

const PROCESS = [
  { n: '01', t: 'Brief',       d: 'Online formla mülk bilgisi alıyoruz; öncelik ve hedef kitleyi belirliyoruz.', time: '15 dk' },
  { n: '02', t: 'Çekim',       d: 'Doğal ışıkta veya planlı stüdyo aydınlatma ile 2–4 saatlik profesyonel çekim.', time: '2–4 saat' },
  { n: '03', t: 'Düzenleme',   d: 'HDR birleştirme, renk düzeltme, gökyüzü ve ufuk doğrulama, lekelerin temizliği.', time: '24 saat' },
  { n: '04', t: 'Teslim',      d: 'Yüksek ve web çözünürlükleri, sanal tur linki, video varyantları paylaşılır.', time: 'Online' },
];

const TIERS = [
  {
    name: 'Standart', tag: 'Daire & 2+1 ev', price: '4.500',
    feats: ['25 yüksek çözünürlüklü kare', 'HDR & profesyonel düzenleme', 'Web + ilan boyutu teslim', '24 saatte teslim', '1 reçeke hakkı'],
  },
  {
    name: 'Premium', tag: 'Villa & 3+1 ev', price: '8.900', featured: true,
    feats: ['40 yüksek çözünürlüklü kare', 'Drone fotoğraf + 4K video', '60 sn cinematic reels', '360° sanal tur', 'Aynı gün ön izleme'],
  },
  {
    name: 'Kurumsal', tag: 'Ofis & ticari', price: 'Özel',
    feats: ['Sınırsız kare', 'Aylık paket / abonelik', 'Sanal staging dahil', 'Kat planı (2D + 3D)', 'Özel proje yöneticisi'],
  },
];

const TESTIMONIALS = [
  {
    quote: 'Fotograf ile çalışmaya başladıktan sonra ilanlarımızın görüntülenme oranı iki katından fazla arttı. Mülk gerçekten hak ettiği gibi göründü.',
    name: 'Ayşe Demir', role: 'Remax Anadolu / Broker', initial: 'A',
  },
  {
    quote: 'Drone çekimi ve 360° tur ile yurt dışındaki alıcı bile evi adım adım gezdi. Sözleşmeyi 9 günde imzaladık.',
    name: 'Mert Kayaalp', role: 'Sotheby\'s Realty', initial: 'M',
  },
  {
    quote: 'Çekim, düzenleme, teslim — her aşamada profesyonellik. Bir daha başka stüdyo ile çalışmayı düşünmüyorum.',
    name: 'Selin Aydın', role: 'Coldwell Banker / Direktör', initial: 'S',
  },
];

const TICKER = [
  'Profesyonel Çekim', 'Drone & Hava Çekimi', '360° Sanal Tur',
  'Cinematic Video', 'Kat Planı', 'Sanal Staging', 'HDR & Gece Çekimi',
];

const BA_PAIRS = [
  { id: 'ba1', label: 'Salon — Bebek', before: PHOTOS.baBefore1, after: PHOTOS.baAfter1 },
  { id: 'ba2', label: 'Mutfak — Etiler', before: PHOTOS.baBefore2, after: PHOTOS.baAfter2 },
  { id: 'ba3', label: 'Yatak Odası — Çeşme', before: PHOTOS.baBefore3, after: PHOTOS.baAfter3 },
];

Object.assign(window, { PHOTOS, SERVICES, PROJECTS, PROCESS, TIERS, TESTIMONIALS, TICKER, BA_PAIRS });
