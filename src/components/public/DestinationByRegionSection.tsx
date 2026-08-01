'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface DestinationByRegionSectionProps {
  initialRegions?: any[];
}

const fallbackRegions = [
  {
    id: 'north-india',
    name: 'North India',
    badgesJson: JSON.stringify(['ALL ADVENTURES', 'DEALS']),
    states: 'Ladakh, Delhi, Uttar Pradesh, Uttarakhand, Himachal Pradesh, Punjab, Jammu & Kashmir',
    destinationCount: '+ 20 destinations',
    slug: 'north-india',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'south-india',
    name: 'South India',
    badgesJson: JSON.stringify(['NATURE', 'WELLNESS']),
    states: 'Kerala, Tamil Nadu, Karnataka',
    destinationCount: '+ 10 destinations',
    slug: 'south-india',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'west-india',
    name: 'West India',
    badgesJson: JSON.stringify(['BEACHES', 'HERITAGE']),
    states: 'Rajasthan, Goa',
    destinationCount: '+ 9 destinations',
    slug: 'west-india',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'east-india',
    name: 'East India',
    badgesJson: JSON.stringify(['HILLS', 'TEA GARDENS']),
    states: 'West Bengal',
    destinationCount: '+ 1 destinations',
    slug: 'east-india',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'central-india',
    name: 'Central India',
    badgesJson: JSON.stringify(['CULTURE', 'HISTORY']),
    states: 'Madhya Pradesh',
    destinationCount: '+ 1 destinations',
    slug: 'central-india',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'northeast-india',
    name: 'Northeast India',
    badgesJson: JSON.stringify(['MONASTERIES', 'SCENIC']),
    states: 'Sikkim',
    destinationCount: '+ 2 destinations',
    slug: 'northeast-india',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
];

export default function DestinationByRegionSection({ initialRegions }: DestinationByRegionSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const regionsData = initialRegions && initialRegions.length > 0 ? initialRegions : fallbackRegions;

  const handleMobileScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 270;
    const idx = Math.round(el.scrollLeft / (cardWidth + 16));
    setActiveIndex(Math.min(idx, regionsData.length - 1));
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight font-sans">
            Destination By Region
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-sans">
            Explore adventures across every corner of the incredible Indian subcontinent
          </p>
        </div>

        <Link
          href="/destinations"
          className="text-sm font-extrabold text-black hover:text-[#b8934b] transition shrink-0 underline underline-offset-4 font-sans sm:mt-3"
        >
          See All
        </Link>
      </div>

      {/* Desktop & Tablet 3x2 Grid (>=640px) */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {regionsData.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>

      {/* Mobile Swipeable Carousel (<640px) */}
      <div className="block sm:hidden space-y-4">
        <div
          ref={scrollRef}
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 pb-2"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {regionsData.map((region) => (
            <div key={region.id} className="shrink-0 snap-center w-[270px]">
              <RegionCard region={region} />
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {regionsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const el = scrollRef.current;
                if (el && el.children[idx]) {
                  el.children[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 h-2 bg-[#b8934b]' : 'w-2 h-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Region Card Item
   ───────────────────────────────────────────────── */
function RegionCard({ region }: { region: any }) {
  let badges: string[] = [];
  try {
    badges = typeof region.badgesJson === 'string' ? JSON.parse(region.badgesJson) : region.badges || [];
  } catch {
    badges = [];
  }

  return (
    <Link
      href={`/destinations?region=${region.slug}`}
      className="group block space-y-3 font-sans transition-all duration-300"
    >
      {/* Photo Container */}
      <div className="relative w-full h-[210px] sm:h-[230px] rounded-[28px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-sm group-hover:shadow-xl transition-all duration-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Top-Left Tag Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 flex-wrap">
          {badges.map((badge: string, idx: number) => (
            <span
              key={idx}
              className="bg-black/50 text-white backdrop-blur-md text-[10px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20 shadow-xs"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content Below Photo */}
      <div className="space-y-1 px-1">
        <h3 className="text-xl font-bold text-black font-sans group-hover:text-[#b8934b] transition-colors duration-300">
          {region.name}
        </h3>

        <p className="text-xs text-gray-500 font-medium line-clamp-1 font-sans">
          {region.states}
        </p>

        <div className="pt-1.5">
          <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-gray-200/70 shadow-xs">
            {region.destinationCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
