import React from 'react';
import { prisma } from '@/lib/prisma';
import WishlistClient from '@/components/public/WishlistClient';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'My Wishlist | Travel & Hault',
  description: 'View your saved tour packages and destinations.',
};

export const revalidate = 0;

export default async function WishlistPage() {
  const [allPackages, allDestinations] = await Promise.all([
    prisma.package.findMany({
      include: {
        variants: { include: { itineraryDays: true } },
        destinations: { include: { destination: true } },
      },
    }),
    prisma.destination.findMany(),
  ]);

  return (
    <div className="pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WishlistClient allPackages={allPackages} allDestinations={allDestinations} />
      </div>
    </div>
  );
}
