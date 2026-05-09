'use client';
import { useState } from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Ticker } from './Ticker';
import { Services } from './Services';
import { Portfolio } from './Portfolio';
import { BeforeAfter } from './BeforeAfter';
import { Process } from './Process';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { BookingModal } from '../booking/BookingModal';
import type { HomePageData } from '@/types/sanity';

export default function HomeClient({ data }: { data: HomePageData }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const onBook = () => setBookingOpen(true);
  const v = data.settings?.sectionVisibility ?? {};
  return (
    <>
      <Nav onBook={onBook} settings={data.settings} />
      <main id="main">
        <Hero onBook={onBook} hero={data.settings?.hero} variant="a" />
        {v.ticker !== false && <Ticker items={data.ticker} />}
        {v.services !== false && <Services services={data.services} />}
        {v.portfolio !== false && <Portfolio projects={data.homeProjects} />}
        {v.beforeAfter !== false && <BeforeAfter pairs={data.beforeAfter} />}
        {v.process !== false && <Process steps={data.processSteps} />}
        {v.pricing !== false && <Pricing tiers={data.pricingTiers} onBook={onBook} />}
        {v.testimonials !== false && <Testimonials items={data.testimonials} />}
        {v.finalCta !== false && (
          <FinalCTA onBook={onBook} phone={data.settings?.contact?.phone} />
        )}
      </main>
      <Footer settings={data.settings} />
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </>
  );
}
