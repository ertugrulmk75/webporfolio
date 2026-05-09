import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('İçerik')
    .items([
      S.listItem()
        .title('Site Ayarları')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Ayarları')
        ),
      S.divider(),
      S.listItem()
        .title('Ana Sayfa')
        .child(
          S.list()
            .title('Ana Sayfa Bölümleri')
            .items([
              S.listItem()
                .title('Hizmet Şeridi (Ticker)')
                .child(
                  S.documentTypeList('tickerItem').title('Ticker Öğeleri')
                ),
              S.listItem()
                .title('Hizmetler')
                .child(S.documentTypeList('service').title('Hizmetler')),
              S.listItem()
                .title('Süreç Adımları')
                .child(
                  S.documentTypeList('processStep').title('Süreç Adımları')
                ),
              S.listItem()
                .title('Fiyatlandırma')
                .child(
                  S.documentTypeList('pricingTier').title('Fiyat Paketleri')
                ),
              S.listItem()
                .title('Yorumlar')
                .child(S.documentTypeList('testimonial').title('Yorumlar')),
              S.listItem()
                .title('Önce / Sonra Çiftleri')
                .child(
                  S.documentTypeList('beforeAfterPair').title(
                    'Önce / Sonra Çiftleri'
                  )
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Portfolyo')
        .child(
          S.list()
            .title('Portfolyo')
            .items([
              S.listItem()
                .title('Projeler')
                .child(
                  S.documentTypeList('portfolioProject').title(
                    'Portfolyo Projeleri'
                  )
                ),
              S.listItem()
                .title('Kategoriler')
                .child(
                  S.documentTypeList('portfolioCategory').title(
                    'Portfolyo Kategorileri'
                  )
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Rezervasyon Talepleri')
        .child(
          S.documentTypeList('booking')
            .title('Rezervasyon Talepleri')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Yazılar')
                .child(S.documentTypeList('blogPost').title('Blog Yazıları')),
              S.listItem()
                .title('Kategoriler')
                .child(
                  S.documentTypeList('blogCategory').title('Blog Kategorileri')
                ),
              S.listItem()
                .title('Yazarlar')
                .child(S.documentTypeList('author').title('Yazarlar')),
            ])
        ),
    ]);
