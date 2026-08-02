'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import PackageCard from '@/components/public/PackageCard';
import DestinationCard from '@/components/public/DestinationCard';
import EnquiryModal from '@/components/public/EnquiryModal';
import { Heart, Trash2, Send, ArrowRight, X } from 'lucide-react';

interface PackageItem {
  id: string;
  title: string;
  tripCode: string;
  shortDescription: string;
  type: string;
  slug: string;
  imagesJson: string;
  featured?: boolean;
  variants?: Array<{
    label: string;
    price: string | number;
    priceUnit?: string;
    originalPrice?: string | number | null;
  }>;
  price?: string | number;
  priceUnit?: string;
  originalPrice?: string | number | null;
  destinationsCount?: number;
}

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  categoryBadge: string;
  stateOrCountry: string;
  aboutText: string;
}

interface WishlistClientProps {
  allPackages: PackageItem[];
  allDestinations: DestinationItem[];
}

export default function WishlistClient({ allPackages, allDestinations }: WishlistClientProps) {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const wishlistedPackages = allPackages.filter((p) => wishlist.includes(p.id));
  const wishlistedDestinations = allDestinations.filter((d) => wishlist.includes(d.id));

  const totalCount = wishlistedPackages.length + wishlistedDestinations.length;

  const wishlistedTitles = [
    ...wishlistedPackages.map((p) => p.title),
    ...wishlistedDestinations.map((d) => d.name),
  ].join(', ');

  if (totalCount === 0) {
    return (
      <div className="p-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-200 space-y-4 max-w-2xl mx-auto font-sans">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-2xl text-gray-900">Your Wishlist is Empty</h3>
        <p className="text-sm text-gray-600">
          Click the heart icon on any package or destination card while exploring to save it here.
        </p>
        <div className="pt-2">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1815] text-[#c9a15a] font-bold text-xs rounded-xl shadow"
          >
            <span>Explore Tour Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-sans">
      {/* Top Bulk Action Bar */}
      <div className="bg-[#1a1815] text-white p-6 rounded-3xl border border-[#c9a15a]/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#c9a15a] block">
            Wishlist Summary
          </span>
          <h2 className="font-serif text-2xl font-bold">
            {totalCount} Saved {totalCount === 1 ? 'Trip Item' : 'Trip Items'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearWishlist}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>

          <button
            onClick={() => setBulkModalOpen(true)}
            className="px-6 py-2.5 bg-[#c9a15a] hover:bg-[#b8934b] text-[#1a1815] font-extrabold text-xs rounded-xl transition shadow-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Enquire About All Wishlisted Items
          </button>
        </div>
      </div>

      {/* Wishlisted Packages */}
      {wishlistedPackages.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif font-bold text-2xl text-[#1a1815] border-b pb-3">
            Wishlisted Packages ({wishlistedPackages.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedPackages.map((pkg) => (
              <div key={pkg.id} className="relative group">
                <PackageCard pkg={pkg} />
                <button
                  onClick={() => toggleWishlist(pkg.id)}
                  className="absolute top-4 right-4 z-20 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition"
                  title="Remove from Wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlisted Destinations */}
      {wishlistedDestinations.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif font-bold text-2xl text-[#1a1815] border-b pb-3">
            Wishlisted Destinations ({wishlistedDestinations.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedDestinations.map((dest) => (
              <div key={dest.id} className="relative group">
                <DestinationCard dest={dest} />
                <button
                  onClick={() => toggleWishlist(dest.id)}
                  className="absolute top-4 right-14 z-20 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition"
                  title="Remove from Wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Enquiry Modal */}
      <EnquiryModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        defaultType="CustomItinerary"
        packageItem={{ title: `Bulk Wishlist: ${wishlistedTitles}` }}
      />
    </div>
  );
}
