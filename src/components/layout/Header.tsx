'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import SearchModal from '@/components/public/SearchModal';
import {
  Compass,
  Heart,
  Search,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const tripThemesList = [
  { name: 'Honeymoon Special', slug: 'honeymoon-special', desc: 'Romantic villas & candlelit beach suppers' },
  { name: 'Beach Getaways', slug: 'beach-getaways', desc: 'Turquoise ocean water sports & island hopping' },
  { name: 'Luxury Tours', slug: 'luxury-tours', desc: '5-star resorts, private transfers & concierge' },
  { name: 'Spiritual Journeys', slug: 'spiritual-journeys', desc: 'Ancient heritage temples & meditation retreats' },
  { name: 'Wildlife & Nature', slug: 'wildlife-nature', desc: 'Thrilling national park safaris & nature walks' },
  { name: 'Budget Travel', slug: 'budget-travel', desc: 'Smart high-value itineraries for budget explorers' },
  { name: 'Weekend Trips', slug: 'weekend-trips', desc: 'Quick 2-to-3 day refreshers from city hustle' },
];

export default function Header() {
  const pathname = usePathname();
  const { wishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileThemesOpen, setMobileThemesOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const isHome = pathname === '/';

  // Scroll listener (triggers at 60px scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Scrolled state or interior pages without hero slider
  const isScrolledPillState = isScrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isScrolledPillState ? 'pt-3 px-3 sm:px-6' : 'pt-0 px-0'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-300 ease-in-out ${
            isScrolledPillState
              ? 'max-w-7xl bg-white text-black rounded-full shadow-2xl border border-gray-200/80 px-6 py-3'
              : 'w-full bg-transparent text-white px-6 sm:px-10 py-5 border-b border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo: Icon + Wordmark */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow transition-all duration-300 group-hover:scale-105 ${
                  isScrolledPillState ? 'bg-black text-[#c9a15a]' : 'bg-[#c9a15a] text-[#051b2e]'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif font-extrabold text-base sm:text-lg tracking-wider leading-none transition-colors duration-300 ${
                    isScrolledPillState ? 'text-black' : 'text-white'
                  }`}
                >
                  TRAVEL & HAULT
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold mt-0.5 text-[#b8934b]">
                  TOUR • TRAVEL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Black text when scrolled) */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link
                href="/"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/about'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                About
              </Link>

              {/* Trip Themes Mega-Menu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  className={`text-xs uppercase font-extrabold tracking-wider flex items-center gap-1 py-1 transition-colors duration-300 ${
                    pathname.startsWith('/trip-themes')
                      ? 'text-[#b8934b]'
                      : isScrolledPillState
                      ? 'text-black hover:text-[#b8934b]'
                      : 'text-white/90 hover:text-[#c9a15a]'
                  }`}
                >
                  Trip Themes
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? 'rotate-180 text-[#b8934b]' : ''
                    }`}
                  />
                </button>

                {megaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-2 pb-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8934b] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#b8934b]" /> Curated Theme Collections
                      </span>
                    </div>
                    {tripThemesList.map((theme) => (
                      <Link
                        key={theme.slug}
                        href={`/trip-themes/${theme.slug}`}
                        onClick={() => setMegaMenuOpen(false)}
                        className="p-3 rounded-xl hover:bg-gray-50 transition flex flex-col group border border-transparent hover:border-gray-200"
                      >
                        <span className="text-sm font-bold text-black group-hover:text-[#b8934b] transition">
                          {theme.name}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">{theme.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/packages"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/packages'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                Packages
              </Link>

              <Link
                href="/destinations"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/destinations'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                Destinations
              </Link>

              <Link
                href="/gallery"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/gallery'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                Gallery
              </Link>

              <Link
                href="/faqs"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/faqs'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                FAQs
              </Link>

              <Link
                href="/contact"
                className={`text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 ${
                  pathname === '/contact'
                    ? 'text-[#b8934b]'
                    : isScrolledPillState
                    ? 'text-black hover:text-[#b8934b]'
                    : 'text-white/90 hover:text-[#c9a15a]'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Right Controls */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setSearchModalOpen(true)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isScrolledPillState
                    ? 'border-gray-300 text-black hover:border-black bg-gray-50'
                    : 'border-white/40 text-white hover:border-[#c9a15a] hover:text-[#c9a15a] bg-transparent'
                }`}
                title="Search trips"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                href="/wishlist"
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isScrolledPillState
                    ? 'border-gray-300 text-black hover:border-black bg-gray-50'
                    : 'border-white/40 text-white hover:border-[#c9a15a] hover:text-[#c9a15a] bg-transparent'
                }`}
                title="My Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b8934b] text-white text-[9px] font-extrabold flex items-center justify-center shadow">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  isScrolledPillState
                    ? 'border-gray-300 text-black bg-gray-50'
                    : 'border-white/40 text-white bg-transparent'
                }`}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                href="/wishlist"
                className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  isScrolledPillState
                    ? 'border-gray-300 text-black bg-gray-50'
                    : 'border-white/40 text-white bg-transparent'
                }`}
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b8934b] text-white text-[9px] font-extrabold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  isScrolledPillState ? 'text-black' : 'text-white'
                }`}
                title="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 overflow-y-auto lg:hidden animate-in slide-in-from-right duration-300 text-black font-sans h-[100dvh]">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black text-[#c9a15a] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base text-black">TRAVEL & HAULT</span>
                <span className="text-[8px] text-[#b8934b] font-bold tracking-widest">TOUR • TRAVEL</span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-black rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4 flex-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold hover:text-[#b8934b]"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold hover:text-[#b8934b]"
            >
              About Us
            </Link>

            {/* Mobile Accordion */}
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={() => setMobileThemesOpen(!mobileThemesOpen)}
                className="w-full flex items-center justify-between text-base font-bold text-[#b8934b]"
              >
                <span>Trip Themes</span>
                <ChevronDown className={`w-4 h-4 transition ${mobileThemesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileThemesOpen && (
                <div className="mt-2 space-y-2 pl-3 border-l-2 border-[#b8934b]/30">
                  {tripThemesList.map((theme) => (
                    <Link
                      key={theme.slug}
                      href={`/trip-themes/${theme.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-gray-700 hover:text-black py-1"
                    >
                      {theme.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold hover:text-[#b8934b] pt-3 border-t border-gray-200"
            >
              Tour Packages
            </Link>
            <Link
              href="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold hover:text-[#b8934b]"
            >
              Destinations
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold hover:text-[#b8934b]"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold hover:text-[#b8934b]"
            >
              Contact Us
            </Link>
          </nav>

          <div className="pt-6 border-t border-gray-200 space-y-3">
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-sm font-bold text-black border border-gray-200"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#b8934b]" /> My Wishlist
              </span>
              <span className="px-2 py-0.5 bg-[#b8934b] text-white text-xs rounded-full font-extrabold">
                {wishlist.length}
              </span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 bg-black text-[#c9a15a] font-extrabold text-sm text-center rounded-xl block shadow-lg"
            >
              Plan Custom Itinerary
            </Link>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
