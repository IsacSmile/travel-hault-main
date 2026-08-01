'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface DestinationCarouselProps {
  destinations: any[];
}

export default function DestinationCarousel({ destinations }: DestinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  const total = destinations.length;

  // Track window resize for responsive card spacing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch / swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setIsSwiping(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Calculate position offset from center for each card
  const getCardStyle = (index: number) => {
    let offset = index - activeIndex;

    // Wrap around for circular carousel
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);

    // Only render cards within visible range (-2 to +2)
    if (absOffset > 2) {
      return { visible: false, style: {} };
    }

    // Scale: center = 1, adjacent = 0.85, outer = 0.72
    const scale = offset === 0 ? 1 : absOffset === 1 ? 0.85 : 0.72;

    // Height: center is tallest, sides progressively shorter
    const height = offset === 0 ? 420 : absOffset === 1 ? 360 : 300;

    // Horizontal translate: generous card spacing matching uploaded screenshot (320px on desktop)
    const cardGap = windowWidth < 640 ? 200 : windowWidth < 1024 ? 260 : 320;
    const spacing = offset * cardGap;

    // Z-index: center on top
    const zIndex = 10 - absOffset;

    // Opacity: edges fade slightly
    const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.75 : 0.45;

    return {
      visible: true,
      style: {
        transform: `translateX(${spacing}px) scale(${scale})`,
        height: `${height}px`,
        zIndex,
        opacity,
      },
    };
  };

  return (
    <div className="relative select-none">
      {/* Carousel Container — generous height for card breathing room */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '500px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {destinations.map((dest, index) => {
          const { visible, style } = getCardStyle(index);
          if (!visible) return null;

          const isActive = index === activeIndex;

          return (
            <CoverflowCard
              key={dest.id}
              dest={dest}
              isActive={isActive}
              style={style}
            />
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-600 hover:text-black hover:shadow-xl transition-all duration-300"
        aria-label="Previous destination"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-600 hover:text-black hover:shadow-xl transition-all duration-300"
        aria-label="Next destination"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots — spaced below cards */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {destinations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? 'w-7 h-2.5 bg-[#b8934b]'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Coverflow Card Component
   ───────────────────────────────────────────────── */
function CoverflowCard({
  dest,
  isActive,
  style,
}: {
  dest: any;
  isActive: boolean;
  style: React.CSSProperties;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(dest.id);

  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-500 ease-out"
      style={{
        ...style,
        width: 'clamp(220px, 28vw, 300px)',
      }}
    >
      {/* Card Image Container */}
      <Link
        href={`/destinations/${dest.slug}`}
        className="relative block w-full overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 group bg-gray-100"
        style={{ height: (style as any).height || 420 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Wishlist Heart — only shown on active card */}
        {isActive && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(dest.id);
            }}
            className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              wishlisted
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white backdrop-blur-sm'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
        )}
      </Link>

      {/* Destination Name — below the card with comfortable spacing */}
      <p
        className={`mt-4 text-center font-serif font-bold transition-all duration-300 ${
          isActive
            ? 'text-lg sm:text-xl text-[#051b2e]'
            : 'text-sm text-gray-400'
        }`}
      >
        {dest.name}
      </p>
    </div>
  );
}
