import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'portfolioProject',
  title: 'Portfolyo Projesi',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Proje Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'location',
      title: 'Konum',
      description: 'Örn: "İstanbul / Boğaz"',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'portfolioCategory' }],
    }),
    defineField({
      name: 'year',
      title: 'Yıl',
      description: 'Örn: "2026"',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Ana Görsel',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Açıklama',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'kind',
      title: 'Görsel Tipi',
      description: 'Grid yerleşim tipi.',
      type: 'string',
      options: {
        list: [
          { title: 'Uzun (Tall)', value: 'tall' },
          { title: 'Geniş (Wide)', value: 'wide' },
          { title: 'Kare (Square)', value: 'sq' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'span',
      title: 'Grid Span',
      description: '4 ile 8 arası bir değer.',
      type: 'number',
      initialValue: 4,
      validation: (Rule) => Rule.min(4).max(8),
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Ana Sayfada Göster',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'homeOrder',
      title: 'Ana Sayfa Sıralaması',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Ana Sayfa Sıralaması (Artan)',
      name: 'homeOrderAsc',
      by: [
        { field: 'homeOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Yıl (Azalan)',
      name: 'yearDesc',
      by: [
        { field: 'year', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'location', media: 'mainImage' },
  },
});
