'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface DestinationCarouselProps {
  destinations: any[];
}

export default function DestinationCarousel({ destinations }: DestinationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    const cardWidth = el.children[0]?.getBoundingClientRect().width || 280;
    const gap = 24;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(0, idx), destinations.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [destinations.length]);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 280;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el || !el.children[index]) return;
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 280;
    const gap = 24;
    el.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel">
      {/* Equal Spaced Horizontal Scroll Row */}
      <div
        ref={scrollRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {destinations.map((dest) => (
          <DestinationCardItem key={dest.id} dest={dest} />
        ))}
      </div>

      {/* Desktop Navigation Arrows (Equal Spaced Layout) */}
      {canScrollLeft && (
        <button
          onClick={() => scrollTo('left')}
          className="absolute left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-xl flex items-center justify-center text-gray-700 hover:text-black hover:scale-110 transition-all duration-300 hidden sm:flex"
          aria-label="Previous destination"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scrollTo('right')}
          className="absolute right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-xl flex items-center justify-center text-gray-700 hover:text-black hover:scale-110 transition-all duration-300 hidden sm:flex"
          aria-label="Next destination"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {destinations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === idx ? 'w-7 h-2.5 bg-[#b8934b]' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Destination Card Item (Equal Spacing)
   ───────────────────────────────────────────────── */
function DestinationCardItem({ dest }: { dest: any }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(dest.id);

  return (
    <div className="shrink-0 snap-start w-[240px] sm:w-[280px] lg:w-[300px] space-y-3 group">
      {/* Card Image Container */}
      <Link
        href={`/destinations/${dest.slug}`}
        className="relative block w-full h-[320px] sm:h-[380px] lg:h-[400px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-100 border border-gray-200/80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(dest.id);
          }}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white backdrop-blur-sm'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>
      </Link>

      {/* Destination Name — Clean Centered Label Below */}
      <div className="text-center pt-1 space-y-0.5">
        <Link href={`/destinations/${dest.slug}`}>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-[#051b2e] group-hover:text-[#b8934b] transition-colors duration-300">
            {dest.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 font-medium">{dest.stateOrCountry}</p>
      </div>
    </div>
  );
}
