import type { Metadata } from 'next';
import { portfolioPageQuery } from '@/sanity/lib/queries';
import PortfolioClient from '@/components/portfolio/PortfolioClient';
import { safeFetch, EMPTY_PORTFOLIO_DATA } from '@/lib/safeFetch';
import type { PortfolioPageData } from '@/types/sanity';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Portfolyo — Fotograf',
};

export default async function PortfolyoPage() {
  const data =
    (await safeFetch<PortfolioPageData>(portfolioPageQuery)) ??
    (EMPTY_PORTFOLIO_DATA as unknown as PortfolioPageData);
  return <PortfolioClient data={data} />;
}
