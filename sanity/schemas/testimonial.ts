import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Yorum',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'quote',
      title: 'Yorum Metni',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'İsim',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol / Ünvan',
      type: 'string',
    }),
    defineField({
      name: 'initial',
      title: 'Baş Harf',
      description: 'Avatar yoksa baş harf gösterilir.',
      type: 'string',
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rating',
      title: 'Puan',
      description: '1 ile 5 arası.',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
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
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
  },
});
