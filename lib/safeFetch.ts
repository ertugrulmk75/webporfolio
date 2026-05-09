import { client } from '@/sanity/lib/client';

/**
 * Wraps client.fetch in a try/catch so the build/dev server doesn't crash
 * when Sanity is not yet configured (placeholder env, fresh project, etc.).
 * Returns the fallback (or null) on any error.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T | null = null,
): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      const msg = (err as { message?: string })?.message ?? String(err);
      console.warn(`[safeFetch] Sanity fetch failed: ${msg}`);
    }
    return fallback;
  }
}

export const EMPTY_HOME_DATA = {
  settings: {},
  ticker: [],
  services: [],
  processSteps: [],
  pricingTiers: [],
  testimonials: [],
  beforeAfter: [],
  homeProjects: [],
};

export const EMPTY_BLOG_LIST = {
  posts: [],
  categories: [],
  settings: {},
};

export const EMPTY_PORTFOLIO_DATA = {
  projects: [],
  categories: [],
  settings: {},
};
