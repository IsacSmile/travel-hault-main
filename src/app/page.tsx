import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroSlider from '@/components/public/HeroSlider';
import DestinationCarousel from '@/components/public/DestinationCarousel';
import TrustBadgesSection from '@/components/public/TrustBadgesSection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import FAQAccordionSection from '@/components/public/FAQAccordionSection';
import HomeExploreTripsTabs from '@/components/public/HomeExploreTripsTabs';
import { ArrowRight, Camera } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [slides, packages, destinations, trustBadges, testimonials, faqs, gallery] =
    await Promise.all([
      prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
      prisma.package.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          variants: { include: { itineraryDays: true } },
          destinations: { include: { destination: true } },
        },
      }),
      prisma.destination.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.trustBadge.findMany({ orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.fAQItem.findMany({ orderBy: { order: 'asc' } }),
      prisma.galleryImage.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
    ]);

  return (
    <div className="space-y-0">
      {/* Hero Photo Section */}
      <HeroSlider slides={slides} />

      {/* Section 1: Explore Packages (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeExploreTripsTabs initialPackages={packages} />
        </div>
      </section>

      {/* Section 2: Explore Iconic Destinations — Equal Spaced Carousel (WHITE background #FFFFFF) */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 lg:mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
                Explore Iconic Destinations
              </h2>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                From the snow-capped Himalayas to tropical beaches, discover India&apos;s incredible diversity with our handpicked destinations.
              </p>
            </div>

            <Link
              href="/destinations"
              className="text-sm font-bold text-[#051b2e] hover:text-[#b8934b] transition flex items-center gap-1.5 shrink-0 underline underline-offset-4 decoration-[#b8934b]/40 hover:decoration-[#b8934b] py-2 px-1 -mx-1 rounded-lg"
            >
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Equal Spaced Destination Carousel */}
          <DestinationCarousel destinations={destinations} />
        </div>
      </section>

      {/* Section 3: Visual Travel Diary (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#b8934b]" /> Captured Moments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
              Visual Travel Diary
            </h2>
            <p className="text-sm text-gray-600">
              A glance at real moments captured across pristine backwaters, snow summits, and desert sands.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((g: any) => (
              <div
                key={g.id}
                className="relative group rounded-3xl overflow-hidden h-60 bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt={g.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-extrabold text-[#c9a15a] uppercase tracking-wider">
                    {g.locationTag}
                  </span>
                  <p className="text-xs text-white font-medium line-clamp-1">{g.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow-md transition"
            >
              <span>View Full Gallery</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Guest Reviews (WHITE background) */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsSection testimonials={testimonials} />
        </div>
      </section>

      {/* Section 5: Trust Badges (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadgesSection badges={trustBadges} />
        </div>
      </section>

      {/* Section 6: FAQ Accordion (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQAccordionSection faqs={faqs} />
        </div>
      </section>
    </div>
  );
}
