import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pricingTier',
  title: 'Fiyat Paketi',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'name',
      title: 'Paket Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Alt Başlık (Etiket)',
      type: 'string',
    }),
    defineField({
      name: 'priceType',
      title: 'Fiyat Tipi',
      type: 'string',
      options: {
        list: [
          { title: 'Sabit Fiyat', value: 'fixed' },
          { title: 'Özel / Teklife Bağlı', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'fixed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Fiyat',
      description: 'Örn: "4.500" ya da "Özel"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currency',
      title: 'Para Birimi',
      type: 'string',
      initialValue: '₺',
    }),
    defineField({
      name: 'period',
      title: 'Periyot',
      description: 'Örn: "/ proje"',
      type: 'string',
      initialValue: '/ proje',
    }),
    defineField({
      name: 'features',
      title: 'Özellikler',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'Öne Çıkan',
      description: 'Vurgulanan paket olarak gösterilir.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'Bu paketi seç',
    }),
  ],
  orderings: [
    {
      title: 'Sıralama (Artan)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tag',
      price: 'price',
      currency: 'currency',
      featured: 'featured',
    },
    prepare({ title, subtitle, price, currency, featured }) {
      const priceStr = price ? `${currency || ''}${price}` : '';
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: [subtitle, priceStr].filter(Boolean).join(' · '),
      };
    },
  },
});
