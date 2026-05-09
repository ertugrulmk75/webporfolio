import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'booking',
  title: 'Rezervasyon Talebi',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Durum',
      type: 'string',
      options: {
        list: [
          { title: 'Yeni', value: 'new' },
          { title: 'İletişim Kuruldu', value: 'contacted' },
          { title: 'Planlandı', value: 'scheduled' },
          { title: 'Tamamlandı', value: 'done' },
          { title: 'İptal', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Gönderim Zamanı',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'name',
      title: 'Ad Soyad',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'services',
      title: 'Hizmetler',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'propertyType',
      title: 'Mülk Tipi',
      type: 'string',
    }),
    defineField({
      name: 'meters',
      title: 'Metrekare',
      type: 'number',
    }),
    defineField({
      name: 'city',
      title: 'Şehir / Konum',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Not',
      type: 'text',
      rows: 4,
    }),
  ],
  orderings: [
    {
      title: 'Yeni → Eski',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'city', status: 'status', date: 'submittedAt' },
    prepare({ title, subtitle, status, date }) {
      const d = date ? new Date(date).toLocaleDateString('tr-TR') : '';
      const statusLabel: Record<string, string> = {
        new: '🆕',
        contacted: '📞',
        scheduled: '📅',
        done: '✅',
        cancelled: '❌',
      };
      const tag = statusLabel[status as string] ?? '';
      return {
        title: `${tag} ${title || '—'}`.trim(),
        subtitle: [d, subtitle].filter(Boolean).join(' · '),
      };
    },
  },
});
