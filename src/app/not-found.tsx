'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Compass, Search, ArrowRight, MapPin } from 'lucide-react';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/public/WhatsAppWidget';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <WishlistProvider>
      <Header />
      <main className="min-h-screen bg-[#F5F0E6]">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-16 sm:py-20 text-center">

          {/* ── Illustration + 404 numerals ── */}
          <div className="relative flex items-center justify-center mb-8 sm:mb-10 select-none">
            {/* Decorative route dots — left */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 hidden sm:flex flex-col gap-2 opacity-30">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-[#c9a15a] block" />
              ))}
            </span>

            {/* "404" text integrated into illustration area */}
            <div className="relative flex flex-col items-center">
              {/* Large stylised "404" */}
              <div className="relative flex items-center gap-2 sm:gap-4">
                {/* 4 */}
                <span
                  className="font-serif font-black text-[#051b2e] leading-none select-none"
                  style={{ fontSize: 'clamp(80px, 18vw, 160px)' }}
                >
                  4
                </span>

                {/* Compass illustration in the middle "0" position */}
                <div
                  className="relative flex-shrink-0 flex items-center justify-center"
                  style={{ width: 'clamp(80px, 17vw, 155px)', height: 'clamp(80px, 17vw, 155px)' }}
                >
                  <img
                    src="/404-illustration.png"
                    alt="Compass with question mark needle"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>

                {/* 4 */}
                <span
                  className="font-serif font-black text-[#051b2e] leading-none select-none"
                  style={{ fontSize: 'clamp(80px, 18vw, 160px)' }}
                >
                  4
                </span>
              </div>

              {/* Gold underline accent */}
              <div className="flex gap-1.5 mt-2">
                <div className="h-1 w-20 rounded-full bg-[#c9a15a]" />
                <div className="h-1 w-5 rounded-full bg-[#c9a15a] opacity-40" />
              </div>
            </div>

            {/* Decorative route dots — right */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 hidden sm:flex flex-col gap-2 opacity-30">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-[#c9a15a] block" />
              ))}
            </span>
          </div>

          {/* ── Heading & copy ── */}
          <div className="max-w-xl mx-auto mb-8 sm:mb-10 space-y-3">
            <h1 className="font-serif font-extrabold text-[#051b2e] leading-tight"
                style={{ fontSize: 'clamp(22px, 5vw, 38px)' }}>
              Looks Like You&apos;ve Wandered Off the Map
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-sans">
              The page you&apos;re looking for might have been moved, renamed, or never existed.
              <br className="hidden sm:inline" />
              Let&apos;s get you back on track.
            </p>
          </div>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto mb-10 sm:mb-12">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#051b2e] hover:bg-[#0a253e] text-white font-extrabold text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#051b2e]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>

            <Link
              href="/packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white border-2 border-[#051b2e] text-[#051b2e] hover:bg-[#051b2e] hover:text-white font-extrabold text-sm rounded-xl transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass className="w-4 h-4" />
              Browse Packages
            </Link>
          </div>

          {/* ── Search Bar ── */}
          <div className="w-full max-w-sm mx-auto space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Or search for a destination / package:
            </p>
            <form
              onSubmit={handleSearch}
              className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden focus-within:border-[#c9a15a] transition-colors"
            >
              <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Bali, Kashmir, Maldives..."
                className="w-full pl-11 pr-14 py-3.5 bg-transparent text-sm text-[#051b2e] placeholder-gray-400 outline-none font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 w-9 h-9 rounded-xl bg-[#c9a15a] hover:bg-[#b8934b] text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Search packages"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* ── Quick navigation chips ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10 max-w-lg mx-auto">
            {[
              { label: 'Destinations', href: '/destinations' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'About Us', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'FAQs', href: '/faqs' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 hover:border-[#c9a15a] hover:text-[#c9a15a] text-gray-600 text-xs font-bold rounded-full transition-all duration-150 shadow-sm"
              >
                <MapPin className="w-3 h-3" />
                {label}
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </WishlistProvider>
  );
}
