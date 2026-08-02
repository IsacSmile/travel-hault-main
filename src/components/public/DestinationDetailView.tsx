'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PackageCard from '@/components/public/PackageCard';
import EnquiryModal from '@/components/public/EnquiryModal';
import { MapPin, Calendar, Thermometer, Send, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface AttractionItem {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface DestinationDetailItem {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  categoryBadge: string;
  stateOrCountry: string;
  aboutText: string;
  bestTimeToVisit: string;
  climate: string;
  attractions: AttractionItem[];
}

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

interface DestinationDetailViewProps {
  dest: DestinationDetailItem;
  relatedPackages: PackageItem[];
}

export default function DestinationDetailView({ dest, relatedPackages }: DestinationDetailViewProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(dest.id);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link href="/" className="hover:text-[#b8934b]">Home</Link>
        <span>/</span>
        <Link href="/destinations" className="hover:text-[#b8934b]">Destinations</Link>
        <span>/</span>
        <span className="text-[#1a1815] truncate">{dest.name}</span>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dest.heroImage} alt={dest.name} loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1815] via-[#1a1815]/40 to-black/30" />

        <button
          onClick={() => toggleWishlist(dest.id)}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition ${
            wishlisted ? 'bg-red-500 text-white scale-110' : 'bg-black/40 text-white backdrop-blur-md hover:bg-black/70'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        <div className="absolute bottom-8 left-8 right-8 z-10 text-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#c9a15a] text-[#1a1815] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {dest.categoryBadge}
            </span>
            <span className="text-xs font-bold text-[#c9a15a] flex items-center gap-1 bg-[#1a1815]/80 px-3 py-1 rounded-full backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5" /> {dest.stateOrCountry}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            {dest.name}
          </h1>
        </div>
      </div>

      {/* Quick Details & About Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: About Text */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#1a1815]">About {dest.name}</h2>
          <p className="text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
            {dest.aboutText}
          </p>
        </div>

        {/* Right: Quick Travel Essentials */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-lg text-[#1a1815] border-b pb-3">
            Travel Essentials
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 bg-[#f4efe6] p-4 rounded-2xl border border-[#b8934b]/20">
              <Calendar className="w-5 h-5 text-[#b8934b] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase text-gray-500 block mb-0.5">
                  Best Time To Visit
                </span>
                <span className="font-bold text-[#1a1815]">{dest.bestTimeToVisit}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#f4efe6] p-4 rounded-2xl border border-[#b8934b]/20">
              <Thermometer className="w-5 h-5 text-[#b8934b] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase text-gray-500 block mb-0.5">
                  Climate & Weather
                </span>
                <span className="font-bold text-[#1a1815]">{dest.climate}</span>
              </div>
            </div>

            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 min-h-[44px] bg-[#1a1815] hover:bg-[#2b2722] text-[#c9a15a] font-bold rounded-full transition-all duration-150 shadow-md hover:-translate-y-px active:translate-y-0"
            >
              <Send className="w-4 h-4" /> Plan Trip To {dest.name}
            </button>
          </div>
        </div>
      </div>

      {/* Top Attractions Grid */}
      {dest.attractions && dest.attractions.length > 0 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] block">
              Sightseeing Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1815]">
              Top Attractions in {dest.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dest.attractions.map((att: AttractionItem) => (
              <div
                key={att.id}
                className="bg-white rounded-3xl border border border-[#b8934b]/20 overflow-hidden shadow-sm hover:shadow-lg transition space-y-3 p-4"
              >
                <div className="h-44 rounded-2xl overflow-hidden bg-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={att.image} alt={att.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-[#1a1815]">{att.name}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {att.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Tour Packages */}
      {relatedPackages.length > 0 && (
        <div className="pt-12 border-t border-gray-200 space-y-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] block">
              Custom Itineraries
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1815]">
              Featured Tour Packages Including {dest.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      )}

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultType="CustomItinerary"
      />
    </div>
  );
}
