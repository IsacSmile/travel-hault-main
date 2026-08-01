'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface HeroSliderProps {
  slides: any[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides?.length || 0;

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused]);

  if (!slides || totalSlides === 0) return null;

  const activeSlide = slides[current];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      setCurrent((prev) => (prev + 1) % totalSlides);
    } else if (distance < -minSwipeDistance) {
      setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[550px] overflow-hidden bg-[#1a1815] font-sans selection:bg-[#c9a15a] selection:text-[#1a1815]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image Carousel */}
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.headline}
              className={`w-full h-full object-cover transition-transform duration-10000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Gradient Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/90" />
          </div>
        );
      })}

      {/* Editorial Content Block (Bottom-Left Aligned) */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col justify-end pb-20 sm:pb-24">
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Location Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#c9a15a] text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#c9a15a]" />
            <span>{activeSlide.locationTag}</span>
          </div>

          {/* Headline - Responsive 70px Max */}
          <h1
            className="font-serif text-white font-bold tracking-tight leading-[1.08] drop-shadow-xl"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 4.375rem)', // Max 70px (4.375rem)
            }}
          >
            {activeSlide.headline}
          </h1>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-gray-200/90 font-light leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none drop-shadow">
            {activeSlide.subtext}
          </p>

          {/* Minimalist Dot Progress Navigation */}
          {totalSlides > 1 && (
            <div className="pt-4 flex items-center gap-2.5 pb-[env(safe-area-inset-bottom)]">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === current
                      ? 'w-9 bg-[#c9a15a]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side Arrow Navigation (Desktop & Tablet) */}
      {totalSlides > 1 && (
        <div className="hidden sm:block">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides)}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition hover:scale-110 shadow-xl"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % totalSlides)}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition hover:scale-110 shadow-xl"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
