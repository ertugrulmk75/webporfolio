import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Yazar',
  type: 'document',
  fields: [
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
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
  },
});
