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
    <div className="pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackagesListingClient
          initialPackages={packages}
          themes={themes}
          destinations={destinations}
          perPage={perPage}
        />
      </div>
    </div>
  );
}
