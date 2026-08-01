import React from 'react';
import { prisma } from '@/lib/prisma';
import DestinationCard from '@/components/public/DestinationCard';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'Travel Destinations | Travel & Hault',
  description: 'Explore world destinations covered by Travel & Hault curated holiday packages.',
};

export const revalidate = 60;

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-16 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#b8934b]" /> Destination Directory
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            From valley lakes to tropical islands, explore popular travel regions and discover top attractions.
          </p>
        </div>
      </section>

      {/* Grid (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
