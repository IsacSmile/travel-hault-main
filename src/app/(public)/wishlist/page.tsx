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
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-16 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#b8934b] fill-[#b8934b]" /> Saved Favorites
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            My Travel Wishlist
          </h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            Review your favorited packages and destinations. Submit a single bulk enquiry for all your selected trips.
          </p>
        </div>
      </section>

      {/* Wishlist Client (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WishlistClient allPackages={allPackages} allDestinations={allDestinations} />
        </div>
      </section>
    </div>
  );
}
