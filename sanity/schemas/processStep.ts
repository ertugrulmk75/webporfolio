import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'processStep',
  title: 'Süreç Adımı',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'number',
      title: 'Numara',
      description: 'Örn: "01"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'time',
      title: 'Süre',
      description: 'Örn: "1 gün", "2-3 saat"',
      type: 'string',
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
    select: { title: 'title', subtitle: 'time', number: 'number' },
    prepare({ title, subtitle, number }) {
      return {
        title: number ? `${number} · ${title}` : title,
        subtitle,
      };
    },
  },
});
