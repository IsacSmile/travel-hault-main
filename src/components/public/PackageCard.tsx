'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Clock, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

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

interface PackageCardProps {
  pkg: PackageItem;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(pkg.id);

  const images = JSON.parse(pkg.imagesJson || '[]');
  const mainImg =
    images[0] ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

  const defaultVariantLabel = pkg.variants?.[0]?.label || 'Custom Duration';

  return (
    <div className="bg-white rounded-3xl border border-[#b8934b]/20 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      {/* Image Container with Wishlist Heart Overlay */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainImg}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-[#1a1815]/90 text-[#c9a15a] text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow">
            {pkg.type}
          </span>
          {pkg.featured && (
            <span className="bg-[#c9a15a] text-[#1a1815] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#1a1815]" /> Featured
            </span>
          )}
        </div>

        {/* Wishlist Heart Overlay Top-Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(pkg.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-md ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-black/40 hover:bg-black/70 text-white backdrop-blur-md'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Duration Badge Bottom Left */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md">
          <Clock className="w-3.5 h-3.5 text-[#c9a15a]" />
          <span>{defaultVariantLabel}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-mono text-[#b8934b] font-bold">{pkg.tripCode}</span>
            <span>{pkg.destinationsCount} {pkg.destinationsCount === 1 ? 'Destination' : 'Destinations'}</span>
          </div>

          <Link href={`/packages/${pkg.slug}`}>
            <h3 className="font-serif font-bold text-lg text-[#1a1815] group-hover:text-[#b8934b] transition line-clamp-1">
              {pkg.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
            {pkg.shortDescription}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            {(() => {
              const variantPrices = (pkg.variants || [])
                .map((v) => Number(v.price))
                .filter((p: number) => p > 0);
              const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(pkg.price || 0);
              const minVariant = (pkg.variants || []).find((v) => Number(v.price) === minPrice);
              const activeUnit = minVariant?.priceUnit || pkg.priceUnit || 'per person';
              const originalVal = minVariant?.originalPrice || pkg.originalPrice;

              if (minPrice > 0) {
                return (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      {variantPrices.length > 0 ? 'Starting from' : 'Pricing'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-extrabold text-[#1a1815]">
                        ₹{minPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">/ {activeUnit}</span>
                      {originalVal && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{Number(originalVal).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
              return (
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Pricing</span>
                  <span className="text-sm font-bold text-[#1a1815]">Price On Request</span>
                </div>
              );
            })()}
          </div>

          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2 min-h-[44px] bg-[#1a1815] hover:bg-[#2b2722] text-[#c9a15a] font-bold text-xs rounded-full transition-all duration-150 shadow-sm hover:-translate-y-px active:translate-y-0"
          >
            <span>Explore Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
