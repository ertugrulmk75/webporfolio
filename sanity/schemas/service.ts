import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Hizmet',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sıralama',
      description: 'Küçükten büyüğe doğru sıralanır.',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'number',
      title: 'Numara',
      description: 'Örn: "01", "02"',
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
      name: 'tag',
      title: 'Etiket',
      description: 'Kısa etiket. Örn: "İç Mekan", "Drone"',
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
    select: { title: 'title', subtitle: 'tag', number: 'number' },
    prepare({ title, subtitle, number }) {
      return {
        title: number ? `${number} · ${title}` : title,
        subtitle,
      };
    },
  },
});
