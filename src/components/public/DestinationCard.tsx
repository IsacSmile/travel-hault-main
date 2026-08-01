'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface DestinationCardProps {
  dest: any;
}

export default function DestinationCard({ dest }: DestinationCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(dest.id);

  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-[#1a1815] border border-[#b8934b]/20 h-80 flex flex-col justify-between">
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dest.heroImage}
        alt={dest.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1815] via-[#1a1815]/30 to-black/30" />

      {/* Top Overlay Controls */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <span className="bg-[#1a1815]/80 text-[#c9a15a] text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-[#c9a15a]/30">
          {dest.categoryBadge}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(dest.id);
          }}
          className={`p-2.5 rounded-full transition-all duration-300 shadow-md ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-black/40 hover:bg-black/70 text-white backdrop-blur-md'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 p-5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[#c9a15a] font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{dest.stateOrCountry}</span>
        </div>

        <Link href={`/destinations/${dest.slug}`}>
          <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#c9a15a] transition">
            {dest.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
          {dest.aboutText}
        </p>

        <div className="pt-2">
          <Link
            href={`/destinations/${dest.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#c9a15a] hover:underline"
          >
            <span>Explore Destination</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
