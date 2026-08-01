'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import EnquiryModal from '@/components/public/EnquiryModal';
import PackageCard from '@/components/public/PackageCard';
import {
  Heart,
  MapPin,
  Clock,
  Users,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  CalendarCheck,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';

interface PackageDetailViewProps {
  pkg: any;
  relatedPackages: any[];
}

export default function PackageDetailView({ pkg, relatedPackages }: PackageDetailViewProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(pkg.id);

  const images = JSON.parse(pkg.imagesJson || '[]');
  const [activeImage, setActiveImage] = useState(
    images[0] ||
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  );

  const highlights = JSON.parse(pkg.highlightsJson || '[]');
  const inclusions = JSON.parse(pkg.inclusionsJson || '[]');
  const exclusions = JSON.parse(pkg.exclusionsJson || '[]');
  const importantNotes = JSON.parse(pkg.importantNotesJson || '[]');

  const variants = pkg.variants || [];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = variants[selectedVariantIndex] || { itineraryDays: [] };

  const [openDay, setOpenDay] = useState<number | null>(1);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [showLongDesc, setShowLongDesc] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link href="/" className="hover:text-[#b8934b]">Home</Link>
        <span>/</span>
        <Link href="/packages" className="hover:text-[#b8934b]">Packages</Link>
        <span>/</span>
        <span className="text-[#1a1815] truncate">{pkg.title}</span>
      </div>

      {/* Main Title & Header Info */}
      <div className="space-y-3 border-b border-gray-200 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[#1a1815] text-[#c9a15a] text-xs font-bold px-3.5 py-1 rounded-full">
            {pkg.type} Tour
          </span>
          <span className="font-mono text-xs font-bold text-gray-700 bg-[#f4efe6] px-3 py-1 rounded-full border border-[#b8934b]/20">
            Code: {pkg.tripCode}
          </span>
          {pkg.themes?.map((t: any) => (
            <Link
              key={t.themeId}
              href={`/trip-themes/${t.theme?.slug}`}
              className="text-xs font-semibold text-[#b8934b] bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-full transition"
            >
              {t.theme?.name}
            </Link>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1a1815] leading-tight">
          {pkg.title}
        </h1>

        <p className="text-base text-gray-700 font-sans leading-relaxed max-w-4xl">
          {pkg.shortDescription}
        </p>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden bg-gray-900 border border-gray-200 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={pkg.title}
            className="w-full h-full object-cover transition duration-500"
          />

          <button
            onClick={() => toggleWishlist(pkg.id)}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition ${
              wishlisted ? 'bg-red-500 text-white scale-110' : 'bg-black/40 text-white backdrop-blur-md hover:bg-black/70'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeImage === img ? 'border-[#b8934b] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Stats Grid */}
          <div className="bg-white p-6 rounded-3xl border border-[#b8934b]/20 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <MapPin className="w-5 h-5 text-[#b8934b] mx-auto" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Destinations
              </span>
              <span className="font-bold text-sm text-[#1a1815] block">
                {pkg.destinationsCount} {pkg.destinationsCount === 1 ? 'City' : 'Cities'}
              </span>
            </div>

            <div className="space-y-1">
              <Users className="w-5 h-5 text-[#b8934b] mx-auto" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Group Size
              </span>
              <span className="font-bold text-sm text-[#1a1815] block">
                Max {pkg.groupSizeMax} (Avg {pkg.groupSizeAvg})
              </span>
            </div>

            <div className="space-y-1">
              <Sparkles className="w-5 h-5 text-[#b8934b] mx-auto" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Tour Style
              </span>
              <span className="font-bold text-sm text-[#1a1815] block">{pkg.tourStyle}</span>
            </div>

            <div className="space-y-1">
              <Building className="w-5 h-5 text-[#b8934b] mx-auto" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Stay Category
              </span>
              <span className="font-bold text-sm text-[#1a1815] block">
                {pkg.accommodationType}
              </span>
            </div>
          </div>

          {/* Trip Overview Text Block */}
          {pkg.longDescription && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Trip Overview</h2>
              <div
                className={`text-sm text-gray-700 leading-relaxed font-sans ${
                  !showLongDesc ? 'line-clamp-4' : ''
                }`}
              >
                {pkg.longDescription}
              </div>
              {pkg.longDescription.length > 200 && (
                <button
                  onClick={() => setShowLongDesc(!showLongDesc)}
                  className="text-xs font-bold text-[#b8934b] hover:underline"
                >
                  {showLongDesc ? 'Show Less' : 'See More Story...'}
                </button>
              )}
            </div>
          )}

          {/* SELECT TOUR DURATION VARIANTS PICKER */}
          {variants.length > 0 && (
            <div className="bg-[#f4efe6] text-[#1a1815] p-8 rounded-3xl border border-[#b8934b]/30 shadow-md space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] block">
                  Step 1: Choose Your Itinerary Option
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Select Tour Duration</h2>
                <p className="text-xs text-gray-600">
                  Switch between duration variants to see custom day-by-day schedules.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {variants.map((v: any, idx: number) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={v.id || idx}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setOpenDay(1);
                      }}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#1a1815] text-[#c9a15a] border-[#1a1815] shadow-lg scale-105'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-sm">{v.label}</div>
                      {v.subtitle && <div className="text-[10px] opacity-80 mt-0.5">{v.subtitle}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DAY-BY-DAY ITINERARY */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1a1815]">
                  Day-by-Day Itinerary ({activeVariant.label})
                </h2>
                <p className="text-xs text-gray-500">Click any day to expand activities & photo stops.</p>
              </div>
            </div>

            {activeVariant.itineraryDays && activeVariant.itineraryDays.length > 0 ? (
              <div className="space-y-4">
                {activeVariant.itineraryDays.map((day: any) => {
                  const isOpen = openDay === day.dayNumber;
                  const dayImgs = JSON.parse(day.imagesJson || '[]');

                  return (
                    <div
                      key={day.id || day.dayNumber}
                      className="border border-gray-200 rounded-2xl overflow-hidden transition"
                    >
                      <button
                        onClick={() => setOpenDay(isOpen ? null : day.dayNumber)}
                        className="w-full p-5 text-left bg-[#f4efe6]/50 hover:bg-[#f4efe6] flex items-center justify-between gap-4 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[#1a1815] text-[#c9a15a] font-bold text-xs flex items-center justify-center shrink-0">
                            D{day.dayNumber}
                          </span>
                          <span className="font-serif font-bold text-base text-[#1a1815]">
                            {day.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-[#b8934b] transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-6 text-sm text-gray-700 font-sans space-y-4 bg-white border-t border-gray-100 animate-in fade-in duration-200">
                          <p className="leading-relaxed whitespace-pre-wrap">{day.description}</p>

                          {dayImgs.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              {dayImgs.map((img: string, i: number) => (
                                <div key={i} className="h-36 rounded-xl overflow-hidden border">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={img} alt="Day stop" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Custom day-by-day plan prepared upon enquiry.</p>
            )}
          </div>

          {/* Tour Highlights */}
          {highlights.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Tour Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                {highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#b8934b] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-200/80 space-y-3">
              <h3 className="font-serif font-bold text-lg text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What's Included
              </h3>
              <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                {inclusions.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/50 p-6 rounded-3xl border border-red-200/80 space-y-3">
              <h3 className="font-serif font-bold text-lg text-red-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" /> Exclusions
              </h3>
              <ul className="space-y-2 text-xs text-red-950 font-medium">
                {exclusions.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Important Notes */}
          {importantNotes.length > 0 && (
            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200/80 space-y-3">
              <h3 className="font-serif font-bold text-base text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" /> Important Tour Notes
              </h3>
              <ul className="space-y-2 text-xs text-amber-950">
                {importantNotes.map((note: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar CTA Card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-8 rounded-3xl border border-[#b8934b]/30 shadow-xl space-y-6">
            <div className="border-b pb-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">
                Quote & Booking
              </span>
              <div className="font-serif font-bold text-3xl text-[#1a1815]">
                Price On Request
              </div>
              <p className="text-xs text-gray-500">
                Custom quotes based on your exact dates, travelers count, and hotel preferences.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full py-4 bg-[#1a1815] hover:bg-[#2b2722] text-[#c9a15a] font-extrabold text-sm rounded-2xl transition shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Enquire Now
              </button>

              <button
                onClick={() => toggleWishlist(pkg.id)}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                  wishlisted
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-600' : ''}`} />
                <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b8934b]" /> 100% Customized Itineraries
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b8934b]" /> 24/7 On-Trip WhatsApp Support
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b8934b]" /> Zero Hidden Charges
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended For You */}
      {relatedPackages.length > 0 && (
        <div className="pt-16 border-t border-gray-200 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] block">
                More Trips
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1815]">
                Recommended For You
              </h2>
            </div>
            <Link
              href="/packages"
              className="text-xs font-bold text-[#1a1815] hover:text-[#b8934b] flex items-center gap-1"
            >
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPackages.map((rPkg) => (
              <PackageCard key={rPkg.id} pkg={rPkg} />
            ))}
          </div>
        </div>
      )}

      {/* Floating Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1a1815] border-t border-[#c9a15a]/30 z-40 lg:hidden flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] uppercase text-gray-400 block font-bold">Quote</span>
          <span className="font-serif font-bold text-white text-base">Price On Request</span>
        </div>

        <button
          onClick={() => setEnquiryModalOpen(true)}
          className="px-6 py-3 bg-[#c9a15a] text-[#1a1815] font-extrabold text-xs rounded-xl shadow"
        >
          Enquire Now
        </button>
      </div>

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        packageItem={pkg}
        defaultType="PackageBooking"
      />
    </div>
  );
}
