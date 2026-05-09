import { homePageQuery } from '@/sanity/lib/queries';
import HomeClient from '@/components/home/HomeClient';
import { safeFetch, EMPTY_HOME_DATA } from '@/lib/safeFetch';
import type { HomePageData } from '@/types/sanity';

export const revalidate = 60;

export default async function HomePage() {
  const data =
    (await safeFetch<HomePageData>(homePageQuery)) ??
    (EMPTY_HOME_DATA as unknown as HomePageData);
  return <HomeClient data={data} />;
}
