'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PackageCard from '@/components/public/PackageCard';
import { Compass, ArrowRight } from 'lucide-react';

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

interface HomeExploreTripsTabsProps {
  initialPackages: PackageItem[];
}

export default function HomeExploreTripsTabs({ initialPackages }: HomeExploreTripsTabsProps) {
  const [activeTab, setActiveTab] = useState<'Domestic' | 'International'>('Domestic');

  const filtered = initialPackages.filter((pkg) => pkg.type === activeTab);

  return (
    <div className="space-y-8">
      {/* Header & Tab Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/80 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#b8934b]" /> Curated Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1815]">
            Handcrafted Tour Packages
          </h2>
          <p className="text-sm text-gray-600">
            Discover bespoke travel itineraries with private transfers, 4-star stays, and expert guides.
          </p>
        </div>

        {/* Custom Pill Toggle Switcher (Matching attached screenshot) */}
        <div className="bg-[#f0ede6]/80 p-1.5 rounded-full flex items-center shrink-0 self-start md:self-auto shadow-inner border border-gray-200/60">
          {(['Domestic', 'International'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black shadow-md shadow-black/5 scale-100'
                    : 'text-gray-500 hover:text-black bg-transparent'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Packages Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-200 shadow-sm">
          No {activeTab.toLowerCase()} tour packages available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}

      {/* Bottom Action */}
      <div className="text-center pt-4">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] bg-[#1a1815] hover:bg-[#2b2722] text-[#c9a15a] font-bold text-sm rounded-full transition-all duration-150 shadow-sm hover:-translate-y-px active:translate-y-0"
        >
          <span>View All Tour Packages</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
