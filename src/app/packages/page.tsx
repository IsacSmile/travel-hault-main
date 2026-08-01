import React from 'react';
import { prisma } from '@/lib/prisma';
import PackageCard from '@/components/public/PackageCard';
import { Compass } from 'lucide-react';

export const metadata = {
  title: 'All Tour Packages | Travel & Hault',
  description: 'Browse all luxury domestic and international holiday tour packages handcrafted by Travel & Hault.',
};

export const revalidate = 60;

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      variants: { include: { itineraryDays: true } },
      destinations: { include: { destination: true } },
    },
  });

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

      {/* Package Grid (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
