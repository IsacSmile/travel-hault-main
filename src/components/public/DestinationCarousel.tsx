'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  categoryBadge: string;
  stateOrCountry: string;
  aboutText: string;
}

interface DestinationCarouselProps {
  destinations: DestinationItem[];
}

export default function DestinationCarousel({ destinations }: DestinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const total = destinations.length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setIsSwiping(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Calculate 3D Coverflow positioning
  const getCardStyle = (index: number) => {
    let offset = index - activeIndex;

    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);

    if (absOffset > 2) {
      return { visible: false, style: {} };
    }

    // Coverflow scale, height, spacing matching reference screenshot
    const scale = offset === 0 ? 1 : absOffset === 1 ? 0.84 : 0.72;
    const height = offset === 0 ? 440 : absOffset === 1 ? 360 : 300;
    // Equal card spacing between images across laptop screens
    const cardGap = windowWidth < 1024 ? 270 : 340;
    const spacing = offset * cardGap;
    const zIndex = 10 - absOffset;
    const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.75 : 0.4;

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

  /* ─────────────────────────────────────────────────
     MOBILE VIEW (<640px)
     ───────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div
          ref={mobileScrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 pb-2"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {destinations.map((dest) => (
            <div key={dest.id} className="shrink-0 snap-center w-[250px] space-y-2.5">
              <Link
                href={`/destinations/${dest.slug}`}
                className="relative block w-full h-[320px] rounded-[28px] overflow-hidden shadow-md bg-gray-100 border border-gray-200/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/90 text-gray-600 flex items-center justify-center shadow"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </Link>
              <p className="text-center font-bold text-base text-black">{dest.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────
     DESKTOP COVERFLOW CAROUSEL (>=640px)
     ───────────────────────────────────────────────── */
  return (
    <div className="relative select-none py-0">
      {/* Coverflow Container */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '460px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {destinations.map((dest, index) => {
          const { visible, style } = getCardStyle(index);
          if (!visible) return null;

          const isActive = index === activeIndex;

          return (
            <CoverflowCardItem
              key={dest.id}
              dest={dest}
              isActive={isActive}
              style={style}
            />
          );
        })}
      </div>

      {/* Navigation Arrow Buttons (Matching Screenshot) */}
      <button
        onClick={goPrev}
        className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-xl flex items-center justify-center text-gray-700 hover:text-black hover:scale-110 transition-all duration-300 hidden sm:flex"
        aria-label="Previous destination"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-xl flex items-center justify-center text-gray-700 hover:text-black hover:scale-110 transition-all duration-300 hidden sm:flex"
        aria-label="Next destination"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Coverflow Card Item
   ───────────────────────────────────────────────── */
function CoverflowCardItem({
  dest,
  isActive,
  style,
}: {
  dest: DestinationItem;
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
        width: 'clamp(230px, 26vw, 310px)',
      }}
    >
      {/* Card Image Box */}
      <Link
        href={`/destinations/${dest.slug}`}
        className="relative block w-full overflow-hidden rounded-[32px] shadow-xl hover:shadow-2xl transition-shadow duration-300 group bg-gray-100"
        style={{ height: style.height || 440 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Wishlist Heart Icon — on active card */}
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
                : 'bg-white text-gray-600 hover:text-red-500 backdrop-blur-sm'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
        )}
      </Link>

      {/* Destination Name Below Card */}
      <p
        className={`mt-4 text-center transition-all duration-300 ${
          isActive
            ? 'text-xl font-bold text-black font-sans'
            : 'text-sm font-medium italic text-gray-400 font-sans'
        }`}
      >
        {dest.name}
      </p>
    </div>
  );
}
