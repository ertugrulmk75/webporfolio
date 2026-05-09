// portfolio-data.jsx — extended portfolio with all projects + categories

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

const PORTFOLIO_CATS = ['Tümü', 'Villa', 'Daire', 'Dubleks', 'Drone', 'Ofis'];

Object.assign(window, { ALL_PROJECTS, PORTFOLIO_CATS });
