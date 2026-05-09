import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'tickerItem',
  title: 'Hizmet Şeridi Öğesi',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Metin',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      initialValue: 0,
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
    select: { title: 'text' },
  },
});
