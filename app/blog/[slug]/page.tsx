import { notFound } from 'next/navigation';
import {
  blogPostQuery,
  blogPostSlugsQuery,
  siteSettingsQuery,
  blogListQuery,
} from '@/sanity/lib/queries';
import BlogPostClient from '@/components/blog/BlogPostClient';
import { safeFetch } from '@/lib/safeFetch';
import type { BlogPost, BlogListData, SiteSettings } from '@/types/sanity';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await safeFetch<string[]>(blogPostSlugsQuery);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await safeFetch<BlogPost | null>(blogPostQuery, { slug });
  if (!post) {
    return { title: 'Yazı bulunamadı — Fotograf' };
  }
  return {
    title: `${post.title} — Fotograf`,
    description: post.excerpt ?? '',
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings, list] = await Promise.all([
    safeFetch<BlogPost | null>(blogPostQuery, { slug }),
    safeFetch<SiteSettings | null>(siteSettingsQuery),
    safeFetch<BlogListData | null>(blogListQuery),
  ]);

  if (!post) notFound();

  const allPosts = list?.posts ?? [];
  const related = allPosts.filter((p) => p._id !== post._id).slice(0, 3);

  return (
    <BlogPostClient post={post} related={related} settings={settings ?? {}} />
  );
}
