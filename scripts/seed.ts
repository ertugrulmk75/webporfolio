/**
 * Seed script — imports legacy content into Sanity.
 *
 * Usage:
 *   npm run seed
 *
 * Requires (in .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 *
 * Idempotent: every document is written via createOrReplace with a
 * deterministic _id, so re-running the seed updates instead of duplicating.
 */

import { writeClient } from '../sanity/lib/client';

// ---------------------------------------------------------------------------
// Bail early if the write token isn't set.
// ---------------------------------------------------------------------------
if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error(
    '\n[seed] Missing SANITY_API_WRITE_TOKEN.\n' +
      '  1. Visit https://sanity.io/manage → API → Tokens\n' +
      '  2. Create a token with Editor permissions\n' +
      '  3. Add it to .env.local as SANITY_API_WRITE_TOKEN=...\n' +
      '  4. Run `npm run seed` again.\n'
  );
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('[seed] Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('[seed] Missing NEXT_PUBLIC_SANITY_DATASET in .env.local');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Turkish-safe slugifier. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/** Cheap unique key generator for Portable Text blocks/spans. */
let _keySeq = 0;
function key(): string {
  _keySeq += 1;
  return `k${Date.now().toString(36)}${_keySeq.toString(36)}`;
}

/** Turkish month names → 0-indexed month. */
const TR_MONTHS: Record<string, number> = {
  ocak: 0,
  şubat: 1,
  subat: 1,
  mart: 2,
  nisan: 3,
  mayıs: 4,
  mayis: 4,
  haziran: 5,
  temmuz: 6,
  ağustos: 7,
  agustos: 7,
  eylül: 8,
  eylul: 8,
  ekim: 9,
  kasım: 10,
  kasim: 10,
  aralık: 11,
  aralik: 11,
};

/** Parses dates like "08 Mayıs 2026" → ISO string. */
function parseTrDate(s: string): string {
  const parts = s.trim().split(/\s+/);
  if (parts.length !== 3) {
    return new Date().toISOString();
  }
  const day = parseInt(parts[0], 10);
  const month = TR_MONTHS[parts[1].toLowerCase()];
  const year = parseInt(parts[2], 10);
  if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) {
    return new Date().toISOString();
  }
  // Use noon UTC so the date renders the same in any TZ.
  return new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString();
}

// ---------------------------------------------------------------------------
// Image upload (with per-run cache)
// ---------------------------------------------------------------------------

type ImageRef = { _type: 'image'; asset: { _type: 'reference'; _ref: string } };

const imageCache = new Map<string, ImageRef>();

async function uploadImageFromUrl(
  url: string,
  filename?: string
): Promise<ImageRef | null> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[seed] image fetch failed ${res.status}: ${url}`);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: filename ?? url.split('/').pop()?.split('?')[0] ?? 'image.jpg',
    });
    const ref: ImageRef = {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
    imageCache.set(url, ref);
    return ref;
  } catch (err) {
    console.warn(`[seed] image upload failed for ${url}:`, err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Source data (mirrors legacy/*.jsx)
// ---------------------------------------------------------------------------

const PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
  hero2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
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
  baBefore1: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=70&sat=-100&exp=-30',
  baAfter1: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=85',
  baBefore2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=70&sat=-100&exp=-30',
  baAfter2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=85',
  baBefore3: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=70&sat=-100&exp=-30',
  baAfter3: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=85',
};

const SERVICES = [
  {
    n: '01',
    title: 'Profesyonel Fotoğraf',
    desc: 'HDR teknikleri ile aydınlık, dengeli, ilanlarda öne çıkan profesyonel iç ve dış mekan çekimleri.',
    tag: '25–40 kare',
  },
  {
    n: '02',
    title: 'Drone Çekimi',
    desc: 'Lisanslı drone ile havadan fotoğraf ve 4K video; konumun çevresini ve arsayı gösterin.',
    tag: 'DJI Air 3S',
  },
  {
    n: '03',
    title: '360° Sanal Tur',
    desc: 'Matterport benzeri etkileşimli tur. Alıcılar fiziken gelmeden mülkü gezsin.',
    tag: 'Web + VR',
  },
  {
    n: '04',
    title: 'Tanıtım Videosu',
    desc: 'Kısa cinematic video — sosyal medya reels ve YouTube için 30s, 60s, 90s formatlarda.',
    tag: '4K · gimbal',
  },
  {
    n: '05',
    title: 'Kat Planı',
    desc: 'Ölçekli 2D ve 3D kat planları — m², oda dağılımı, bilgilendirici notlarla birlikte.',
    tag: '2D · 3D',
  },
  {
    n: '06',
    title: 'Sanal Staging',
    desc: 'Boş veya yıpranmış mekanları dijital olarak döşeyin. Üç farklı stilde sunum.',
    tag: 'Modern · Klasik · Boho',
  },
];

const PROJECTS_HOME = [
  'Bebek Yalı Dairesi',
  'Çeşme Villası',
  'Cihangir Loft',
  'Etiler Triplex',
  'Yıldız Konağı',
  'Bodrum Yalısı',
  'Levent Penthouse',
];

const PROCESS = [
  { n: '01', t: 'Brief', d: 'Online formla mülk bilgisi alıyoruz; öncelik ve hedef kitleyi belirliyoruz.', time: '15 dk' },
  { n: '02', t: 'Çekim', d: 'Doğal ışıkta veya planlı stüdyo aydınlatma ile 2–4 saatlik profesyonel çekim.', time: '2–4 saat' },
  { n: '03', t: 'Düzenleme', d: 'HDR birleştirme, renk düzeltme, gökyüzü ve ufuk doğrulama, lekelerin temizliği.', time: '24 saat' },
  { n: '04', t: 'Teslim', d: 'Yüksek ve web çözünürlükleri, sanal tur linki, video varyantları paylaşılır.', time: 'Online' },
];

const TIERS = [
  {
    name: 'Standart',
    tag: 'Daire & 2+1 ev',
    price: '4.500',
    feats: [
      '25 yüksek çözünürlüklü kare',
      'HDR & profesyonel düzenleme',
      'Web + ilan boyutu teslim',
      '24 saatte teslim',
      '1 reçeke hakkı',
    ],
  },
  {
    name: 'Premium',
    tag: 'Villa & 3+1 ev',
    price: '8.900',
    featured: true,
    feats: [
      '40 yüksek çözünürlüklü kare',
      'Drone fotoğraf + 4K video',
      '60 sn cinematic reels',
      '360° sanal tur',
      'Aynı gün ön izleme',
    ],
  },
  {
    name: 'Kurumsal',
    tag: 'Ofis & ticari',
    price: 'Özel',
    feats: [
      'Sınırsız kare',
      'Aylık paket / abonelik',
      'Sanal staging dahil',
      'Kat planı (2D + 3D)',
      'Özel proje yöneticisi',
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Fotograf ile çalışmaya başladıktan sonra ilanlarımızın görüntülenme oranı iki katından fazla arttı. Mülk gerçekten hak ettiği gibi göründü.',
    name: 'Ayşe Demir',
    role: 'Remax Anadolu / Broker',
    initial: 'A',
  },
  {
    quote:
      'Drone çekimi ve 360° tur ile yurt dışındaki alıcı bile evi adım adım gezdi. Sözleşmeyi 9 günde imzaladık.',
    name: 'Mert Kayaalp',
    role: "Sotheby's Realty",
    initial: 'M',
  },
  {
    quote:
      'Çekim, düzenleme, teslim — her aşamada profesyonellik. Bir daha başka stüdyo ile çalışmayı düşünmüyorum.',
    name: 'Selin Aydın',
    role: 'Coldwell Banker / Direktör',
    initial: 'S',
  },
];

const TICKER = [
  'Profesyonel Çekim',
  'Drone & Hava Çekimi',
  '360° Sanal Tur',
  'Cinematic Video',
  'Kat Planı',
  'Sanal Staging',
  'HDR & Gece Çekimi',
];

const BA_PAIRS = [
  { id: 'ba1', label: 'Salon — Bebek', before: PHOTOS.baBefore1, after: PHOTOS.baAfter1 },
  { id: 'ba2', label: 'Mutfak — Etiler', before: PHOTOS.baBefore2, after: PHOTOS.baAfter2 },
  { id: 'ba3', label: 'Yatak Odası — Çeşme', before: PHOTOS.baBefore3, after: PHOTOS.baAfter3 },
];

const PHOTOS_X = {
  v1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
  v2: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80',
  v3: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80',
  v4: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
  v5: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
  l1: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1400&q=80',
  l2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80',
  l3: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=80',
  d1: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80',
  d2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
  k1: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
  k2: 'https://images.unsplash.com/photo-1556909195-4e5f0bb6b9e0?w=1400&q=80',
  b1: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&q=80',
  b2: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=80',
  bath: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=80',
  dn: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1400&q=80',
  o1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  o2: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80',
};

const ALL_PROJECTS = [
  { id: 'p1', name: 'Bebek Yalı Dairesi', loc: 'İstanbul / Boğaz', img: PHOTOS_X.v4, cat: 'Daire', span: 7, kind: 'tall', year: '2026' },
  { id: 'p2', name: 'Çeşme Villası', loc: 'İzmir / Çeşme', img: PHOTOS_X.v2, cat: 'Villa', span: 5, kind: 'tall', year: '2026' },
  { id: 'p3', name: 'Cihangir Loft', loc: 'İstanbul / Beyoğlu', img: PHOTOS_X.l1, cat: 'Daire', span: 4, kind: 'sq', year: '2025' },
  { id: 'p4', name: 'Etiler Triplex', loc: 'İstanbul / Beşiktaş', img: PHOTOS_X.k1, cat: 'Dubleks', span: 4, kind: 'sq', year: '2025' },
  { id: 'p5', name: 'Yıldız Konağı', loc: 'Ankara / Çankaya', img: PHOTOS_X.b1, cat: 'Villa', span: 4, kind: 'sq', year: '2025' },
  { id: 'p6', name: 'Bodrum Yalısı', loc: 'Muğla / Yalıkavak', img: PHOTOS_X.v3, cat: 'Villa', span: 8, kind: 'wide', year: '2025' },
  { id: 'p7', name: 'Levent Penthouse', loc: 'İstanbul / Şişli', img: PHOTOS_X.dn, cat: 'Daire', span: 4, kind: 'wide', year: '2025' },
  { id: 'p8', name: 'Acıbadem Bahçeli', loc: 'İstanbul / Kadıköy', img: PHOTOS_X.l2, cat: 'Daire', span: 6, kind: 'wide', year: '2025' },
  { id: 'p9', name: 'Göcek Sahil Villası', loc: 'Muğla / Göcek', img: PHOTOS_X.d1, cat: 'Drone', span: 6, kind: 'wide', year: '2025' },
  { id: 'p10', name: 'Maslak Office', loc: 'İstanbul / Sarıyer', img: PHOTOS_X.o1, cat: 'Ofis', span: 4, kind: 'tall', year: '2024' },
  { id: 'p11', name: 'Alaçatı Taş Ev', loc: 'İzmir / Çeşme', img: PHOTOS_X.b2, cat: 'Villa', span: 4, kind: 'tall', year: '2024' },
  { id: 'p12', name: 'Suadiye Penthouse', loc: 'İstanbul / Kadıköy', img: PHOTOS_X.v5, cat: 'Daire', span: 4, kind: 'tall', year: '2024' },
  { id: 'p13', name: 'Kalamış Sahil', loc: 'İstanbul / Kadıköy', img: PHOTOS_X.l3, cat: 'Drone', span: 8, kind: 'wide', year: '2024' },
  { id: 'p14', name: 'Nişantaşı Klasik', loc: 'İstanbul / Şişli', img: PHOTOS_X.bath, cat: 'Daire', span: 4, kind: 'sq', year: '2024' },
  { id: 'p15', name: 'Bilkent Plaza', loc: 'Ankara', img: PHOTOS_X.o2, cat: 'Ofis', span: 6, kind: 'wide', year: '2024' },
  { id: 'p16', name: 'Yalıkavak Marina', loc: 'Muğla / Bodrum', img: PHOTOS_X.d2, cat: 'Drone', span: 6, kind: 'wide', year: '2024' },
  { id: 'p17', name: 'Ortaköy Yalı', loc: 'İstanbul / Boğaz', img: PHOTOS_X.v1, cat: 'Villa', span: 7, kind: 'wide', year: '2023' },
  { id: 'p18', name: 'Beykoz Vadi', loc: 'İstanbul / Beykoz', img: PHOTOS_X.k2, cat: 'Daire', span: 5, kind: 'wide', year: '2023' },
];

const PORTFOLIO_CATEGORIES = ['Villa', 'Daire', 'Dubleks', 'Drone', 'Ofis'];

type BlogBlock = ['p' | 'h2' | 'h3' | 'pull', string];

const BLOG_POSTS: Array<{
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cat: string;
  date: string;
  read: string;
  cover: string;
  author: string;
  authorRole: string;
  authorInit: string;
  tags: string[];
  body: BlogBlock[];
}> = [
  {
    id: 'post-1',
    slug: 'iyi-emlak-fotografinin-7-kurali',
    title: 'İyi bir emlak fotoğrafının 7 kuralı',
    excerpt:
      'Profesyonel emlak fotoğrafçılığında ilanı öne çıkaran şey teknikten önce gözdür. Bu yazıda yıllar içinde geliştirdiğimiz prensipleri paylaşıyoruz.',
    cat: 'Rehber',
    date: '08 Mayıs 2026',
    read: '6 dk okuma',
    cover: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
    author: 'Mehmet Aksoy',
    authorRole: 'Kurucu Fotoğrafçı',
    authorInit: 'M',
    tags: ['Teknik', 'Kompozisyon', 'Işık'],
    body: [
      ['p', 'Emlak fotoğrafçılığı yalnızca güzel kareler yakalamak değildir. Asıl mesele; potansiyel alıcının ekrandaki görseli "evim olabilir" hissine çevirmektir. Bu hissi yaratan ise teknikten önce kompozisyon, ışık ve sahne hazırlığıdır.'],
      ['h2', '01. Doğru saatte gelin'],
      ['p', 'Mülkün cephesi güneye bakıyorsa öğleden sonra; doğuya bakıyorsa sabah erken çekim yapılmalı. Tepe noktasında güneş, pencerelerden içeri sert ve dağınık ışık atar; sonuç olarak iç mekanlar yanmış görünür.'],
      ['h2', '02. Geniş ama abartısız lens'],
      ['p', '14–24mm aralığı standart. 14mm altına inerseniz duvarlar bükülür, tavan yere paralel olmaz; ilan görseli "balon" gibi görünür. Kullanıcı yanlış orantı algılar ve güveni sarsılır.'],
      ['pull', '"Mülkün gerçek halini abartmadan, en iyi haliyle göstermek; pazarlamanın değil, dürüstlüğün gereğidir."'],
      ['h2', '03. Tripod, hep tripod'],
      ['p', 'Elden çekim ne kadar steady olursanız olun, HDR birleştirmede hizalama hatası yapar. Her oda için aynı sehpa yüksekliği — ortalama 1.20m — ilanın bütünlüğünü sağlar.'],
      ['h2', '04. Sahne hazırlığını mülk sahibine bırakmayın'],
      ['p', 'Oyuncak, çamaşır, eski tencere; hepsini önceden toplayın. Sahip "evim toplu zaten" derken biz 30 kalem fazlalık görürüz. Yumuşak bir hatırlatma ile çekimi 1 saat erteleyip mülkü hazır görmek, sonradan retouch’tan iyidir.'],
      ['h2', '05. HDR — ama görünmez olsun'],
      ['p', 'HDR teknik bir araçtır; estetik bir stil değil. Üç-beş kareyi birleştirip çıkan görsel; insan gözünün gördüğüne yakın olmalı. Renkler patlamamalı, gökyüzü tropikal mavi olmamalı, gölge detayları doğal kalmalı.'],
      ['h2', '06. Pencerelerden bakın'],
      ['p', 'İçeriden çekim yaparken pencere camından dışarı görünen manzara, ilanın hidden gem’ine dönüşür. Boğaz, deniz, park, koru — bunları gösterin. Kapalı perde, yarım fiyat demektir.'],
      ['h2', '07. Mülk değil, yaşam tarzı satın'],
      ['p', 'Son ve en önemli kural: Bir alıcı 60 m² daireyi değil, o dairede oturup kahve içme hayalini satın alır. Kompozisyonunuz bu hayali çağrıştırmalı. Boş kareler yerine; aralanmış perdeyi, masaya bırakılmış bir kitabı, taze çiçeği fotoğraflayın.'],
    ],
  },
  {
    id: 'post-2',
    slug: 'drone-cekiminde-yasal-cerceve',
    title: 'Drone çekiminde yasal çerçeve: Türkiye için hızlı rehber',
    excerpt:
      'SHGM lisansı, uçuş izinleri, yasak bölgeler. Emlak çekimi için drone uçururken bilmeniz gereken her şey.',
    cat: 'Hukuki',
    date: '24 Nisan 2026',
    read: '4 dk okuma',
    cover: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80',
    author: 'Selin Kaya',
    authorRole: 'Operasyon Direktörü',
    authorInit: 'S',
    tags: ['Drone', 'SHGM', 'Yasal'],
    body: [
      ['p', 'Drone ile emlak çekimi yapacaksanız önce SHGM kayıt zorunluluğunu yerine getirmeniz şart. 500 gram altı drone’lar bile sicil sistemine kaydedilmek zorunda.'],
      ['h2', 'Lisans gerektiren durumlar'],
      ['p', 'Ticari amaçla — yani müşteri için — uçurulan tüm drone’lar IHA-1 sertifikalı pilot ister. Sertifika SHGM onaylı eğitim merkezlerinden alınır; teorik + pratik sınavla.'],
      ['h2', 'Yasak bölgeler'],
      ['p', 'Havalimanı 9 km yakını, askeri tesisler, cezaevleri, başkanlık binaları ve protokol bölgeleri kesin yasak. Bunlar dışında belediyeden veya ilgili müdürlükten zone bazlı izin gerekebilir.'],
      ['pull', '"Drone’u uçurmadan önce 5 dakikanızı SHGM uygulamasına ayırmak; çekim sonrası 5.000 TL ceza yememenizi sağlar."'],
      ['h2', 'Emlak için pratik öneriler'],
      ['p', 'Site içi mülklerde site yönetiminden yazılı izin alın. Komşu balkonlarına dron yöneltmek "gizliliği ihlal" suçudur — ekstra dikkat. Çekim önce konut sakinine bilgi verilmesi profesyonel etiğin gereğidir.'],
    ],
  },
  {
    id: 'post-3',
    slug: 'sanal-staging-bos-ev-yuksek-fiyat',
    title: 'Sanal staging: Boş ev, yüksek fiyat',
    excerpt:
      'Boş bir mülkün ortalama satış süresi 2.3× daha uzundur. Sanal staging ile dijital olarak döşenmiş ilanlar nasıl çalışır?',
    cat: 'Pazarlama',
    date: '11 Nisan 2026',
    read: '5 dk okuma',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    author: 'Mehmet Aksoy',
    authorRole: 'Kurucu Fotoğrafçı',
    authorInit: 'M',
    tags: ['Staging', 'Pazarlama', 'CGI'],
    body: [
      ['p', 'Boş mülk satıldığında alıcı odanın boyutunu yanlış algılar; küçük gibi görünür. Sanal staging — gerçek fotoğraf üzerine 3D mobilya yerleştirme — bu sorunu üç stilde çözüyor.'],
      ['h2', 'Üç farklı stil, tek mülk'],
      ['p', 'Aynı boş salon için modern minimal, klasik ve boho-skandinav versiyonlar üretiyoruz. İlanı farklı kitlelere farklı ilan başlığıyla yayınlamak conversion oranını ortalama 1.8× artırıyor.'],
      ['h2', 'Etik sınır'],
      ['p', 'Sanal staging mevcut yapıyı değiştirmemeli — sadece taşınabilir mobilyaları eklemeli. Duvar yıkmak, balkon kapatmak, manzara değiştirmek aldatıcı pazarlamadır.'],
    ],
  },
  {
    id: 'post-4',
    slug: '360-sanal-tur-yatirimcilar-icin',
    title: '360° sanal tur: Yurt dışı yatırımcı için yeni standart',
    excerpt:
      'İstanbul lüks segmentinde alıcıların %62’si artık ilk ziyareti uzaktan yapıyor. 360° tur teknolojisi neden vazgeçilmez hale geldi?',
    cat: 'Trend',
    date: '02 Nisan 2026',
    read: '7 dk okuma',
    cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
    author: 'Ayşe Demir',
    authorRole: 'Lüks Segment Uzmanı',
    authorInit: 'A',
    tags: ['VR', '360°', 'Lüks'],
    body: [
      ['p', 'Pandemi ile başlayan dijital görüntüleme alışkanlığı, lüks gayrimenkul segmentinde kalıcı standart haline geldi. Körfez ve Avrupa’dan İstanbul’a yatırım yapan alıcıların büyük çoğunluğu mülke fiziken adım atmadan ön karar veriyor.'],
      ['h2', 'Teknoloji'],
      ['p', 'Matterport Pro3 ve Insta360 X4 kullanıyoruz. 200 m² bir daire için ortalama 60 dakika çekim, 24 saat işlem süresi. Çıktı; web tarayıcıda ve VR gözlükte oynatılan adım adım gezinilebilen 3D model.'],
      ['h2', 'Conversion etkisi'],
      ['p', '2025 portföyümüzde 360° tur yayınlanan ilanların ilk 30 günde alınan teklif sayısı, sadece fotoğraf yayınlananlara göre 2.4 kat fazla. Satış kapanış süresi ise ortalama 41 gün → 17 gün.'],
    ],
  },
  {
    id: 'post-5',
    slug: 'gece-cekimi-isiklar-acik-ev',
    title: 'Gece çekimi: Işıklar açık, ev satılır',
    excerpt:
      'Twilight saatte yapılan dış cephe çekimleri, lüks segmentte tıklama oranını ikiye katlıyor. Pratik teknik notlar.',
    cat: 'Teknik',
    date: '18 Mart 2026',
    read: '4 dk okuma',
    cover: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80',
    author: 'Burak Şahin',
    authorRole: 'Teknik Direktör',
    authorInit: 'B',
    tags: ['HDR', 'Twilight', 'Cephe'],
    body: [
      ['p', 'Gün batımından 20–35 dakika sonra başlayan "blue hour"; gökyüzünü derin lacivert, ev içlerini sıcak amber yapar. Bu kontrast emlak fotoğrafının en güçlü ifadesidir.'],
      ['h2', 'Pratik checklist'],
      ['p', 'Bir saat önce mülke gelin. Tüm iç mekan ışıklarını açın; bahçe ve havuz aydınlatmasını test edin. ISO 100, f/8, 4–8 saniye pozlamayla 5–7 farklı poz alıp HDR’da birleştirin.'],
    ],
  },
  {
    id: 'post-6',
    slug: 'mulk-sahibi-icin-cekim-hazirligi',
    title: 'Mülk sahipleri için: Çekim öncesi 24 saat',
    excerpt:
      'Çekim günü gelmeden önce yapmanız gereken on adım. Profesyonel sonucu hazırlık belirler.',
    cat: 'Rehber',
    date: '03 Mart 2026',
    read: '5 dk okuma',
    cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    author: 'Selin Kaya',
    authorRole: 'Operasyon Direktörü',
    authorInit: 'S',
    tags: ['Hazırlık', 'Mülk Sahibi'],
    body: [
      ['p', 'Mülkün yatırım değerini görselleyen bir çekim için hazırlık, fotoğrafçı kadar mülk sahibinin de işi.'],
      ['h2', 'Listemiz'],
      ['p', 'Tüm yataklar düzlenmiş, banyo havluları katlanmış, mutfak tezgahı tamamen boş, evcil hayvan eşyaları görünmez konumda olmalı. Yumuşak detaylar — taze çiçek, kitap, bir bardak şarap — sahneye hayat katar ama abartılmamalı.'],
    ],
  },
];

// ---------------------------------------------------------------------------
// Portable Text conversion
// ---------------------------------------------------------------------------

type PortableBlock =
  | {
      _type: 'block';
      _key: string;
      style: 'normal' | 'h2' | 'h3';
      markDefs: unknown[];
      children: Array<{
        _type: 'span';
        _key: string;
        text: string;
        marks: string[];
      }>;
    }
  | {
      _type: 'pullQuote';
      _key: string;
      text: string;
    };

function blocksFromTuples(tuples: BlogBlock[]): PortableBlock[] {
  return tuples.map(([tag, text]) => {
    if (tag === 'pull') {
      return {
        _type: 'pullQuote' as const,
        _key: key(),
        text,
      };
    }
    const style = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'normal';
    return {
      _type: 'block' as const,
      _key: key(),
      style,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          _key: key(),
          text,
          marks: [],
        },
      ],
    };
  });
}

// ---------------------------------------------------------------------------
// Seeders
// ---------------------------------------------------------------------------

async function seedPortfolioCategories() {
  console.log('[seed] portfolio categories…');
  for (const name of PORTFOLIO_CATEGORIES) {
    const slug = slugify(name);
    await writeClient.createOrReplace({
      _id: `category-${slug}`,
      _type: 'portfolioCategory',
      name,
      slug: { _type: 'slug', current: slug },
    });
  }
  console.log(`  → ${PORTFOLIO_CATEGORIES.length} created/updated`);
}

async function seedBlogCategories() {
  const cats = Array.from(new Set(BLOG_POSTS.map((p) => p.cat)));
  console.log('[seed] blog categories…');
  for (const name of cats) {
    const slug = slugify(name);
    await writeClient.createOrReplace({
      _id: `category-blog-${slug}`,
      _type: 'blogCategory',
      name,
      slug: { _type: 'slug', current: slug },
    });
  }
  console.log(`  → ${cats.length} created/updated`);
  return cats;
}

async function seedAuthors() {
  // Dedupe by author name. Keep first occurrence's role + initial.
  const seen = new Map<string, { role: string; initial: string }>();
  for (const p of BLOG_POSTS) {
    if (!seen.has(p.author)) {
      seen.set(p.author, { role: p.authorRole, initial: p.authorInit });
    }
  }
  console.log('[seed] authors…');
  for (const [name, meta] of seen) {
    const slug = slugify(name);
    await writeClient.createOrReplace({
      _id: `author-${slug}`,
      _type: 'author',
      name,
      role: meta.role,
      initial: meta.initial,
    });
  }
  console.log(`  → ${seen.size} created/updated`);
}

async function seedSiteSettings() {
  console.log('[seed] siteSettings…');
  const [hero1, hero2] = await Promise.all([
    uploadImageFromUrl(PHOTOS.hero, 'hero1.jpg'),
    uploadImageFromUrl(PHOTOS.hero2, 'hero2.jpg'),
  ]);

  await writeClient.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Fotograf',
    tagline: 'Emlak fotoğrafçılığı stüdyosu',
    footerDescription:
      "Türkiye'nin önde gelen emlak fotoğrafçılığı stüdyosu. İstanbul, Ankara, İzmir ve Bodrum'da hizmet veriyoruz.",
    contact: {
      phone: '+90 (212) 000 00 00',
      email: 'hello@fotograf.com',
      address: 'Maslak, İstanbul',
    },
    social: {
      instagram: '',
      behance: '',
      youtube: '',
      linkedin: '',
    },
    sectionVisibility: {
      ticker: true,
      services: true,
      portfolio: true,
      beforeAfter: true,
      process: true,
      pricing: true,
      testimonials: true,
      finalCta: true,
    },
    hero: {
      eyebrow: "İstanbul · 2017'den beri",
      headlineLine1: 'Mülkünüzü ',
      headlineHighlight: 'hak ettiği',
      headlineLine2: ' gibi gösterelim.',
      subtitle:
        'Profesyonel emlak fotoğrafçılığı, drone, sanal tur ve cinematic video. Daha hızlı satış, daha yüksek görüntülenme, daha az pazarlık.',
      ...(hero1 ? { image1: hero1 } : {}),
      ...(hero2 ? { image2: hero2 } : {}),
      featuredProjectName: 'Bebek Yalı Dairesi',
      featuredProjectMeta: 'NO. 047 · 2026',
      stats: [
        { _key: key(), label: 'Tamamlanan Proje', value: '240+' },
        { _key: key(), label: 'Şehir', value: '38' },
        { _key: key(), label: 'Deneyim', value: '9 yıl' },
        { _key: key(), label: 'Ort. Görüntülenme Artışı', value: '2.4×' },
      ],
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
  });
  console.log('  → siteSettings created/updated');
}

async function seedTickerItems() {
  console.log('[seed] ticker items…');
  for (let i = 0; i < TICKER.length; i++) {
    const text = TICKER[i];
    await writeClient.createOrReplace({
      _id: `ticker-${i + 1}`,
      _type: 'tickerItem',
      text,
      order: i,
    });
  }
  console.log(`  → ${TICKER.length} created/updated`);
}

async function seedServices() {
  console.log('[seed] services…');
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await writeClient.createOrReplace({
      _id: `service-${s.n}`,
      _type: 'service',
      order: i,
      number: s.n,
      title: s.title,
      description: s.desc,
      tag: s.tag,
    });
  }
  console.log(`  → ${SERVICES.length} created/updated`);
}

async function seedProcessSteps() {
  console.log('[seed] process steps…');
  for (let i = 0; i < PROCESS.length; i++) {
    const step = PROCESS[i];
    await writeClient.createOrReplace({
      _id: `process-${step.n}`,
      _type: 'processStep',
      order: i,
      number: step.n,
      title: step.t,
      description: step.d,
      time: step.time,
    });
  }
  console.log(`  → ${PROCESS.length} created/updated`);
}

async function seedPricingTiers() {
  console.log('[seed] pricing tiers…');
  for (let i = 0; i < TIERS.length; i++) {
    const t = TIERS[i];
    const priceType: 'fixed' | 'custom' = t.price === 'Özel' ? 'custom' : 'fixed';
    const period = priceType === 'fixed' ? '/ proje' : '/ teklif';
    const ctaLabel = t.featured
      ? 'Hemen rezervasyon'
      : priceType === 'custom'
        ? 'Teklif al'
        : 'Bu paketi seç';

    await writeClient.createOrReplace({
      _id: `tier-${slugify(t.name)}`,
      _type: 'pricingTier',
      order: i,
      name: t.name,
      tag: t.tag,
      priceType,
      price: t.price,
      currency: '₺',
      period,
      features: t.feats,
      featured: t.featured ?? false,
      ctaLabel,
    });
  }
  console.log(`  → ${TIERS.length} created/updated`);
}

async function seedTestimonials() {
  console.log('[seed] testimonials…');
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i];
    await writeClient.createOrReplace({
      _id: `testimonial-${slugify(t.name)}`,
      _type: 'testimonial',
      order: i,
      quote: t.quote,
      name: t.name,
      role: t.role,
      initial: t.initial,
      rating: 5,
    });
  }
  console.log(`  → ${TESTIMONIALS.length} created/updated`);
}

async function seedBeforeAfterPairs() {
  console.log('[seed] before/after pairs…');
  for (let i = 0; i < BA_PAIRS.length; i++) {
    const pair = BA_PAIRS[i];
    const [before, after] = await Promise.all([
      uploadImageFromUrl(pair.before, `${pair.id}-before.jpg`),
      uploadImageFromUrl(pair.after, `${pair.id}-after.jpg`),
    ]);
    if (!before || !after) {
      console.warn(`  → skipping ${pair.id}: image upload failed`);
      continue;
    }
    await writeClient.createOrReplace({
      _id: `ba-${pair.id}`,
      _type: 'beforeAfterPair',
      label: pair.label,
      before,
      after,
      order: i,
    });
  }
  console.log(`  → ${BA_PAIRS.length} processed`);
}

async function seedPortfolioProjects() {
  console.log('[seed] portfolio projects…');
  let count = 0;
  for (const p of ALL_PROJECTS) {
    const image = await uploadImageFromUrl(p.img, `${p.id}.jpg`);
    if (!image) {
      console.warn(`  → skipping ${p.name}: image upload failed`);
      continue;
    }
    const homeIdx = PROJECTS_HOME.indexOf(p.name);
    const featuredOnHome = homeIdx !== -1;
    const homeOrder = featuredOnHome ? homeIdx : 0;
    const projectSlug = slugify(p.name);

    await writeClient.createOrReplace({
      _id: `project-${projectSlug}`,
      _type: 'portfolioProject',
      name: p.name,
      slug: { _type: 'slug', current: projectSlug },
      location: p.loc,
      category: {
        _type: 'reference',
        _ref: `category-${slugify(p.cat)}`,
      },
      year: p.year,
      mainImage: image,
      kind: p.kind,
      span: p.span,
      featuredOnHome,
      homeOrder,
    });
    count++;
  }
  console.log(`  → ${count}/${ALL_PROJECTS.length} created/updated`);
}

async function seedBlogPosts() {
  console.log('[seed] blog posts…');
  let count = 0;
  for (const post of BLOG_POSTS) {
    const cover = await uploadImageFromUrl(post.cover, `${post.slug}-cover.jpg`);
    if (!cover) {
      console.warn(`  → skipping ${post.slug}: cover upload failed`);
      continue;
    }
    await writeClient.createOrReplace({
      _id: `post-${post.slug}`,
      _type: 'blogPost',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt,
      category: {
        _type: 'reference',
        _ref: `category-blog-${slugify(post.cat)}`,
      },
      publishedAt: parseTrDate(post.date),
      readTime: post.read,
      cover,
      author: {
        _type: 'reference',
        _ref: `author-${slugify(post.author)}`,
      },
      tags: post.tags,
      body: blocksFromTuples(post.body),
    });
    count++;
  }
  console.log(`  → ${count}/${BLOG_POSTS.length} created/updated`);
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🌱 Seeding Sanity dataset…\n');
  const start = Date.now();

  // 1. Reference data first (no foreign deps).
  await seedPortfolioCategories();
  await seedBlogCategories();
  await seedAuthors();

  // 2. Singletons + lists.
  await seedSiteSettings();
  await seedTickerItems();
  await seedServices();
  await seedProcessSteps();
  await seedPricingTiers();
  await seedTestimonials();
  await seedBeforeAfterPairs();

  // 3. Documents that reference the above.
  await seedPortfolioProjects();
  await seedBlogPosts();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log('\n┌─────────────────────────────────┬────────┐');
  console.log('│ Type                            │ Count  │');
  console.log('├─────────────────────────────────┼────────┤');
  console.log(`│ portfolioCategory               │ ${String(PORTFOLIO_CATEGORIES.length).padStart(6)} │`);
  console.log(`│ blogCategory                    │ ${String(new Set(BLOG_POSTS.map((p) => p.cat)).size).padStart(6)} │`);
  console.log(`│ author                          │ ${String(new Set(BLOG_POSTS.map((p) => p.author)).size).padStart(6)} │`);
  console.log(`│ siteSettings                    │ ${'1'.padStart(6)} │`);
  console.log(`│ tickerItem                      │ ${String(TICKER.length).padStart(6)} │`);
  console.log(`│ service                         │ ${String(SERVICES.length).padStart(6)} │`);
  console.log(`│ processStep                     │ ${String(PROCESS.length).padStart(6)} │`);
  console.log(`│ pricingTier                     │ ${String(TIERS.length).padStart(6)} │`);
  console.log(`│ testimonial                     │ ${String(TESTIMONIALS.length).padStart(6)} │`);
  console.log(`│ beforeAfterPair                 │ ${String(BA_PAIRS.length).padStart(6)} │`);
  console.log(`│ portfolioProject                │ ${String(ALL_PROJECTS.length).padStart(6)} │`);
  console.log(`│ blogPost                        │ ${String(BLOG_POSTS.length).padStart(6)} │`);
  console.log('├─────────────────────────────────┼────────┤');
  console.log(`│ images uploaded (deduped)       │ ${String(imageCache.size).padStart(6)} │`);
  console.log(`│ elapsed (s)                     │ ${elapsed.padStart(6)} │`);
  console.log('└─────────────────────────────────┴────────┘\n');

  console.log('✅ Seed complete.\n');
}

main().catch((err) => {
  console.error('\n[seed] FAILED:', err);
  process.exit(1);
});
