import { blogListQuery } from '@/sanity/lib/queries';
import BlogListClient from '@/components/blog/BlogListClient';
import { safeFetch, EMPTY_BLOG_LIST } from '@/lib/safeFetch';
import type { BlogListData } from '@/types/sanity';

export const revalidate = 60;

export const metadata = {
  title: 'Blog — Fotograf',
  description:
    'Emlak fotoğrafçılığı, drone, sanal tur ve pazarlama üzerine deneyimlerimiz, teknik notlar ve sektör analizleri.',
};

export default async function BlogPage() {
  const data =
    (await safeFetch<BlogListData>(blogListQuery)) ??
    (EMPTY_BLOG_LIST as unknown as BlogListData);
  return (
    <BlogListClient
      posts={data.posts ?? []}
      categories={data.categories ?? []}
      settings={data.settings ?? {}}
    />
  );
}
