import React from 'react';
import { prisma } from '@/lib/prisma';
import DestinationCard from '@/components/public/DestinationCard';
import PageHeader from '@/components/public/PageHeader';

export const metadata = {
  title: 'Travel Destinations | Travel & Hault',
  description: 'Explore world destinations covered by Travel & Hault curated holiday packages.',
};

export const revalidate = 60;

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations' },
  ];

  const showingCount = {
    start: 1,
    end: destinations.length,
    total: destinations.length,
    label: 'DESTINATIONS',
  };

  return (
    <div className="pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          breadcrumbs={breadcrumbs}
          title="Explore Destinations"
          subtext="From valley lakes to tropical islands, explore popular travel regions and discover top attractions."
          showingCount={showingCount}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      </div>
    </div>
  );
}
