import React from 'react';
import { prisma } from '@/lib/prisma';
import PackagesListingClient from '@/components/public/PackagesListingClient';
import { Compass } from 'lucide-react';

export const metadata = {
  title: 'All Tour Packages | Travel & Hault',
  description: 'Browse all luxury domestic and international holiday tour packages handcrafted by Travel & Hault.',
};

export const revalidate = 60;

export default async function PackagesPage() {
  const [packages, themes, destinations, settings] = await Promise.all([
    prisma.package.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        variants: { include: { itineraryDays: true } },
        themes: { include: { theme: true } },
        destinations: { include: { destination: true } },
      },
    }),
    prisma.theme.findMany({ orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ orderBy: { name: 'asc' } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ]);

  const perPage = settings?.packagesPerPage || 9;

  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Header Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-16 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#b8934b]" /> Bespoke Itineraries
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            All Tour Packages
          </h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            Discover curated mountain retreats, island honeymoons, and royal heritage journeys. Select your preferred trip to view detailed itineraries.
          </p>
        </div>
      </section>

      {/* Package Grid with Filters & Pagination (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PackagesListingClient
            initialPackages={packages}
            themes={themes}
            destinations={destinations}
            perPage={perPage}
          />
        </div>
      </section>
    </div>
  );
}
