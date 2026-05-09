import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'beforeAfterPair',
  title: 'Önce / Sonra',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      description: 'Örn: "Salon — Bebek"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'before',
      title: 'Önce',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'after',
      title: 'Sonra',
      type: 'image',
      options: { hotspot: true },
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
    select: { title: 'label', media: 'after' },
  },
});
