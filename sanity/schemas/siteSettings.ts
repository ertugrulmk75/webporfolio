import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  groups: [
    { name: 'general', title: 'Genel', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'contact', title: 'İletişim' },
    { name: 'social', title: 'Sosyal Medya' },
    { name: 'sections', title: 'Bölüm Görünürlüğü' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site Başlığı',
      description: 'Tarayıcı sekmelerinde ve <title> etiketinde gösterilir.',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Slogan / Meta Description',
      description: 'Kısa açıklama. Meta description olarak kullanılır.',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Açıklaması',
      description: 'Footer bölümünde gösterilecek tanıtım metni.',
      type: 'text',
      rows: 3,
      group: 'general',
    }),

    // Contact
    defineField({
      name: 'contact',
      title: 'İletişim Bilgileri',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'phone',
          title: 'Telefon',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'E-posta',
          type: 'string',
          validation: (Rule) =>
            Rule.email().error('Geçerli bir e-posta adresi giriniz.'),
        }),
        defineField({
          name: 'address',
          title: 'Adres',
          type: 'string',
        }),
      ],
    }),

    // Social
    defineField({
      name: 'social',
      title: 'Sosyal Medya',
      description: 'Boş bırakılan ağlar sitede gizlenir.',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'behance',
          title: 'Behance',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
      ],
    }),

    // Section visibility
    defineField({
      name: 'sectionVisibility',
      title: 'Bölüm Görünürlüğü',
      description: 'Ana sayfada hangi bölümler görünsün?',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'ticker',
          title: 'Hizmet Şeridi',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'services',
          title: 'Hizmetler',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'portfolio',
          title: 'Portfolyo',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'beforeAfter',
          title: 'Önce/Sonra',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'process',
          title: 'Süreç',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'pricing',
          title: 'Fiyatlandırma',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'testimonials',
          title: 'Yorumlar',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'finalCta',
          title: 'Son CTA',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),

    // Hero
    defineField({
      name: 'hero',
      title: 'Hero Bölümü',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Üst Etiket (Eyebrow)',
          description: 'Örn: "İstanbul · 2017\'den beri"',
          type: 'string',
        }),
        defineField({
          name: 'headlineLine1',
          title: 'Başlık - 1. Satır',
          description: 'Örn: "Mülkünüzü"',
          type: 'string',
        }),
        defineField({
          name: 'headlineHighlight',
          title: 'Başlık - Vurgulu Kısım (italik)',
          description: 'Örn: "hak ettiği"',
          type: 'string',
        }),
        defineField({
          name: 'headlineLine2',
          title: 'Başlık - 2. Satır',
          description: 'Örn: "gibi gösterelim."',
          type: 'string',
        }),
        defineField({
          name: 'subtitle',
          title: 'Alt Başlık',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'image1',
          title: 'Ana Görsel',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'image2',
          title: 'İkinci Görsel',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'featuredProjectName',
          title: 'Öne Çıkan Proje Adı',
          description: 'Hero kartında görünür. Örn: "Bebek Yalı Dairesi"',
          type: 'string',
        }),
        defineField({
          name: 'featuredProjectMeta',
          title: 'Öne Çıkan Proje Meta',
          description: 'Örn: "NO. 047 · 2026"',
          type: 'string',
        }),
        defineField({
          name: 'stats',
          title: 'İstatistikler',
          description: 'Hero altındaki rakamlar.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'stat',
              title: 'İstatistik',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Etiket',
                  description: 'Örn: "Tamamlanan Proje"',
                  type: 'string',
                }),
                defineField({
                  name: 'value',
                  title: 'Değer',
                  description: 'Örn: "240+"',
                  type: 'string',
                }),
              ],
              preview: {
                select: { title: 'label', subtitle: 'value' },
              },
            }),
          ],
        }),
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Başlık',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Açıklama',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Görseli',
          description: 'Sosyal medya paylaşımlarında görünecek görsel.',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Ayarları' };
    },
  },
});
