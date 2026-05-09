import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'blogCategory',
  title: 'Blog Kategorisi',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Kategori Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'slug.current' },
  },
});
