'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import EnquiryModal from '@/components/public/EnquiryModal';
import PackageCard from '@/components/public/PackageCard';
import {
  ChevronRight, ChevronLeft, ChevronDown, Heart, Send, Clock, Users, MapPin,
  Star, CheckCircle2, XCircle, AlertCircle, ZoomIn, Shield, Phone, Building, Sparkles, X
} from 'lucide-react';

interface AttractionItem {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  categoryBadge: string;
  stateOrCountry: string;
  aboutText: string;
  bestTimeToVisit?: string;
  idealDuration?: string;
  weatherInfo?: string;
  attractions?: AttractionItem[];
}

interface PackageVariantItem {
  id?: string;
  label: string;
  price: string | number;
  priceUnit?: string;
  originalPrice?: string | number | null;
  itineraryDays: Array<{
    id?: string;
    dayNumber: number;
    title: string;
    description: string;
    imagesJson?: string | null;
  }>;
}

interface PackageDetailItem {
  id: string;
  title: string;
  tripCode: string;
  type: string;
  shortDescription: string;
  longDescription: string;
  imagesJson: string;
  highlightsJson: string;
  inclusionsJson: string;
  exclusionsJson: string;
  importantNotesJson: string;
  groupSizeMax: number;
  groupSizeAvg: number;
  tourStyle: string;
  accommodationType: string;
  themes?: Array<{
    theme: {
      slug: string;
      name: string;
    };
    themeId: string;
  }>;
  destinations?: Array<{
    destination: DestinationItem;
  }>;
  variants?: PackageVariantItem[];
  price?: string | number;
  priceUnit?: string;
  originalPrice?: string | number | null;
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

interface PackageDetailViewProps {
  pkg: PackageDetailItem;
  relatedPackages?: PackageItem[];
}

export default function PackageDetailView({ pkg, relatedPackages = [] }: PackageDetailViewProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const galleryImages: string[] = (() => {
    try { return JSON.parse(pkg.imagesJson || '[]'); } catch { return []; }
  })();
  const fallback = '/images/placeholder.jpg';

  const highlights: string[] = (() => {
    try { return JSON.parse(pkg.highlightsJson || '[]'); } catch { return []; }
  })();
  const inclusions: string[] = (() => {
    try { return JSON.parse(pkg.inclusionsJson || '[]'); } catch { return []; }
  })();
  const exclusions: string[] = (() => {
    try { return JSON.parse(pkg.exclusionsJson || '[]'); } catch { return []; }
  })();
  const importantNotes: string[] = (() => {
    try { return JSON.parse(pkg.importantNotesJson || '[]'); } catch { return []; }
  })();

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg = useCallback(() => {
    setLightboxIdx(i => (i - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length, setLightboxIdx]);

  const nextImg = useCallback(() => {
    setLightboxIdx(i => (i + 1) % galleryImages.length);
  }, [galleryImages.length, setLightboxIdx]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'ArrowRight') nextImg();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, prevImg, nextImg]);

  // Mobile carousel state
  const [carouselIdx, setCarouselIdx] = useState(0);

  const variants = pkg.variants || [];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = variants[selectedVariantIndex] || { itineraryDays: [], label: '' };

  const destinations = (pkg.destinations || []).map((d) => d.destination).filter(Boolean);

  const [openDay, setOpenDay] = useState<number | null>(1);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [showLongDesc, setShowLongDesc] = useState(false);

  // Interactive Mosaic Gallery State: 5 images slots
  const [mosaicIndices, setMosaicIndices] = useState<number[]>([0, 1, 2, 3, 4]);

  // Handle clicking on any image in the grid: swap clicked image into center slot (index 2 in mosaic array)
  const handleImageClick = (clickedSlotIndex: number) => {
    // If center image clicked, do nothing or retain
    if (clickedSlotIndex === 2) return;
    
    setMosaicIndices(prev => {
      const next = [...prev];
      // Swap clicked slot index with center slot index (position 2)
      const temp = next[2];
      next[2] = next[clickedSlotIndex];
      next[clickedSlotIndex] = temp;
      return next;
    });
  };

  const getImgUrl = (slotIndex: number) => {
    const imgIndex = mosaicIndices[slotIndex] % galleryImages.length;
    return galleryImages[imgIndex] || fallback;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-20 space-y-8">

      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium pt-2 flex-wrap">
        <Link href="/" className="hover:text-[#b8934b] transition">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <Link href="/packages" className="hover:text-[#b8934b] transition">Packages</Link>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-[#1a1815] font-semibold truncate max-w-[200px]">{pkg.title}</span>
        {activeVariant.label && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-[#b8934b] font-semibold truncate">{activeVariant.label}</span>
          </>
        )}
      </nav>

      {/* ── GALLERY — Desktop Mosaic / Mobile Carousel ── */}
      {/* Mobile Carousel */}
      <div className="block lg:hidden relative rounded-2xl overflow-hidden bg-gray-100 h-[260px] sm:h-[340px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={galleryImages[carouselIdx]}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <button onClick={() => openLightbox(carouselIdx)} className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/60 transition">
          <ZoomIn className="w-4 h-4" />
        </button>
        {galleryImages.length > 1 && (
          <>
            <button onClick={() => setCarouselIdx(i => (i - 1 + galleryImages.length) % galleryImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/60 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCarouselIdx(i => (i + 1) % galleryImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/60 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {galleryImages.map((_, i) => (
                <button key={i} onClick={() => setCarouselIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === carouselIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop 5-image Mosaic */}
      <div className="hidden lg:grid grid-cols-[1fr_2fr_1fr] grid-rows-2 gap-2.5 h-[480px] rounded-2xl overflow-hidden">
        {/* Left col — 2 stacked */}
        <div className="grid grid-rows-2 gap-2.5 row-span-2">
          {[0, 1].map((slotIdx) => (
            <button
              key={slotIdx}
              onClick={() => handleImageClick(slotIdx)}
              className="relative group overflow-hidden bg-gray-200 w-full h-full cursor-pointer"
              title="Click to view in center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImgUrl(slotIdx)}
                alt={`Gallery ${slotIdx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                <span className="text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                  Click to view
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Center — full-height hero (Main Big Image) */}
        <div className="relative group overflow-hidden row-span-2 bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImgUrl(2)}
            alt="Main Big Image"
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>

        {/* Right col — 2 stacked */}
        <div className="grid grid-rows-2 gap-2.5 row-span-2">
          {[3, 4].map((slotIdx) => (
            <button
              key={slotIdx}
              onClick={() => handleImageClick(slotIdx)}
              className="relative group overflow-hidden bg-gray-200 w-full h-full cursor-pointer"
              title="Click to view in center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImgUrl(slotIdx)}
                alt={`Gallery ${slotIdx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                <span className="text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                  Click to view
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── TITLE BLOCK ── */}
      <div className="space-y-3">
        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#1a1815] text-[#c9a15a] text-[11px] font-bold px-3 py-1 rounded-full">
            {pkg.type} Tour
          </span>
          <span className="font-mono text-[11px] font-bold text-gray-600 bg-[#f4efe6] px-3 py-1 rounded-full border border-[#b8934b]/20">
            {pkg.tripCode}
          </span>
          {pkg.themes?.map((t) => (
            <Link key={t.themeId} href={`/trip-themes/${t.theme?.slug}`}
              className="text-[11px] font-semibold text-[#b8934b] bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-full transition">
              {t.theme?.name}
            </Link>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1815] leading-tight">
          {pkg.title}
        </h1>

        {destinations.length > 0 && (
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            {destinations.map((d) => d.name).join(' · ')}
          </p>
        )}

        {/* Short description with See More */}
        <div className="text-sm text-gray-600 leading-relaxed max-w-3xl">
          <span className={showLongDesc ? '' : 'line-clamp-2'}>
            {pkg.shortDescription}
          </span>
          {pkg.shortDescription?.length > 120 && (
            <button onClick={() => setShowLongDesc(v => !v)} className="ml-1 text-[#b8934b] font-semibold text-xs hover:underline">
              {showLongDesc ? 'Show Less' : 'See More'}
            </button>
          )}
        </div>
      </div>

      {/* ── QUICK STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Clock className="w-5 h-5 text-[#b8934b]" />, label: 'Duration', value: activeVariant.label || `${pkg.groupSizeMax > 0 ? pkg.groupSizeMax : '—'} Days` },
          { icon: <Users className="w-5 h-5 text-[#b8934b]" />, label: 'Group Size', value: `Max ${pkg.groupSizeMax}, Avg ${pkg.groupSizeAvg}` },
          { icon: <Sparkles className="w-5 h-5 text-[#b8934b]" />, label: 'Tour Style', value: pkg.tourStyle },
          { icon: <Building className="w-5 h-5 text-[#b8934b]" />, label: 'Accommodation', value: pkg.accommodationType },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5 shadow-sm">
            {stat.icon}
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{stat.label}</span>
            <span className="font-bold text-sm text-[#1a1815] leading-tight">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID: Content + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">

        {/* ──── LEFT MAIN CONTENT ──── */}
        <div className="space-y-10 min-w-0">

          {/* Trip Overview */}
          {pkg.longDescription && (
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Trip Overview</h2>
              <div className={`text-sm text-gray-700 leading-relaxed ${showLongDesc ? '' : 'line-clamp-5'}`}>
                {pkg.longDescription}
              </div>
              {pkg.longDescription.length > 300 && (
                <button onClick={() => setShowLongDesc(v => !v)} className="text-[#b8934b] text-xs font-bold hover:underline">
                  {showLongDesc ? 'Show Less' : 'Read More'}
                </button>
              )}
            </section>
          )}

          {/* Tour Highlights */}
          {highlights.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Tour Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Star className="w-4 h-4 text-[#b8934b] shrink-0 mt-0.5 fill-[#b8934b]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Included */}
          {inclusions.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">What&apos;s Included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Exclusions */}
          {exclusions.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Exclusions</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {exclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Important Notes */}
          {importantNotes.length > 0 && (
            <section className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-xl font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Important Notes
              </h2>
              <ul className="space-y-2">
                {importantNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Itinerary */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#1a1815]">Itinerary</h2>
              {activeVariant.label && (
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {activeVariant.label}
                </span>
              )}
            </div>

            {activeVariant.itineraryDays?.length > 0 ? (
              <div className="space-y-2">
                {activeVariant.itineraryDays.map((day) => {
                  const isOpen = openDay === day.dayNumber;
                  const dayImgs: string[] = JSON.parse(day.imagesJson || '[]');
                  return (
                    <div key={day.id || day.dayNumber} className="border border-gray-200 rounded-xl overflow-hidden transition-all">
                      <button
                        onClick={() => setOpenDay(isOpen ? null : day.dayNumber)}
                        className="w-full px-5 py-4 flex items-center justify-between gap-4 bg-[#f9f6f1] hover:bg-[#f4efe6] transition text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 w-9 h-9 rounded-xl bg-[#1a1815] text-[#c9a15a] font-bold text-xs flex items-center justify-center">
                            {day.dayNumber}
                          </span>
                          <span className="font-semibold text-sm text-[#1a1815] truncate">{day.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[#b8934b] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 py-5 bg-white border-t border-gray-100 space-y-4 text-sm text-gray-700 leading-relaxed">
                          <p className="whitespace-pre-wrap">{day.description}</p>
                          {dayImgs.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {dayImgs.map((img, i) => (
                                <button key={i} onClick={() => openLightbox(galleryImages.indexOf(img) >= 0 ? galleryImages.indexOf(img) : 0)} className="h-28 rounded-lg overflow-hidden border border-gray-200 group relative">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={img} alt={`Day ${day.dayNumber}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                </button>
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
              <p className="text-sm text-gray-500 italic">Custom day-by-day itinerary prepared upon enquiry.</p>
            )}
          </section>
        </div>

        {/* ──── RIGHT STICKY SIDEBAR ──── */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-[#b8934b]/25 shadow-xl overflow-hidden">

            {/* Destinations Covered */}
            {destinations.length > 0 && (
              <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-2">Destinations Covered</span>
                <div className="flex flex-wrap gap-1.5">
                  {destinations.map((d, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a1815] bg-[#f4efe6] border border-[#b8934b]/20 px-2.5 py-1 rounded-full">
                      <MapPin className="w-3 h-3 text-[#b8934b]" /> {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Duration Variant Selector */}
            {variants.length > 1 && (
              <div className="px-6 py-4 border-b border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-2">Choose Duration</span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, idx: number) => (
                    <button
                      key={v.id || idx}
                      onClick={() => { setSelectedVariantIndex(idx); setOpenDay(1); }}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition ${
                        selectedVariantIndex === idx
                          ? 'bg-[#1a1815] text-[#c9a15a] border-[#1a1815] shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#b8934b] hover:text-[#b8934b]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price + CTA */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">Quote &amp; Booking</span>
                {(() => {
                  const currentVariantPrice = Number(activeVariant.price || 0);
                  const currentVariantOriginal = activeVariant.originalPrice ? Number(activeVariant.originalPrice) : null;
                  const currentVariantUnit = activeVariant.priceUnit || pkg.priceUnit || 'per person';

                  const displayPrice = currentVariantPrice > 0 ? currentVariantPrice : Number(pkg.price || 0);
                  const displayOriginal = currentVariantPrice > 0 ? currentVariantOriginal : (pkg.originalPrice ? Number(pkg.originalPrice) : null);
                  const displayUnit = currentVariantPrice > 0 ? currentVariantUnit : (pkg.priceUnit || 'per person');

                  if (displayPrice > 0) {
                    return (
                      <div className="mt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-bold text-3xl text-[#1a1815]">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400 font-bold">/ {displayUnit}</span>
                        </div>
                        {displayOriginal && (
                          <div className="text-sm text-gray-400 line-through">
                            ₹{displayOriginal.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div className="font-serif font-bold text-3xl text-[#1a1815] mt-1">Price On Request</div>
                  );
                })()}
                <p className="text-xs text-gray-500 mt-1">Custom quote based on your dates, travelers &amp; preferences.</p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#b8934b] shrink-0 mt-0.5" />
                  <span>Premium Stays Included</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#b8934b] shrink-0 mt-0.5" />
                  <span>Sightseeing by Private AC Vehicle</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Shield className="w-3.5 h-3.5 text-[#b8934b] shrink-0 mt-0.5" />
                  <span>24/7 Ground Tour Coordinator</span>
                </div>
              </div>

              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full py-3.5 bg-[#1a1815] hover:bg-[#2b2722] text-[#c9a15a] font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Book Now
              </button>

              <button
                onClick={() => toggleWishlist(pkg.id)}
                className={`w-full py-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                  isInWishlist(pkg.id)
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#b8934b] hover:text-[#b8934b]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(pkg.id) ? 'fill-red-500' : ''}`} />
                {isInWishlist(pkg.id) ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>
            </div>

            {/* Need Custom Itinerary */}
            <div className="px-6 py-4 bg-[#f9f6f1] border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-600 font-medium">Need a custom itinerary?</p>
              <Link href="/contact"
                className="w-full py-2.5 border border-[#1a1815] text-[#1a1815] text-xs font-bold rounded-xl hover:bg-[#1a1815] hover:text-white transition flex items-center justify-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED PACKAGES ── */}
      {relatedPackages.length > 0 && (
        <section className="pt-12 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] block">More Trips</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1815]">Recommended For You</h2>
            </div>
            <Link href="/packages" className="text-xs font-bold text-[#1a1815] hover:text-[#b8934b] flex items-center gap-1 transition">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPackages.map(rPkg => <PackageCard key={rPkg.id} pkg={rPkg} />)}
          </div>
        </section>
      )}

      {/* ── MOBILE STICKY BOTTOM CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#1a1815] border-t border-[#c9a15a]/30 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Quote</span>
          {(() => {
            const currentVariantPrice = Number(activeVariant.price || 0);
            const currentVariantUnit = activeVariant.priceUnit || pkg.priceUnit || 'per person';
            const displayPrice = currentVariantPrice > 0 ? currentVariantPrice : Number(pkg.price || 0);

            if (displayPrice > 0) {
              return (
                <div className="flex items-baseline gap-1">
                  <span className="font-serif font-bold text-white text-base">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold">/ {currentVariantUnit}</span>
                </div>
              );
            }
            return (
              <span className="font-serif font-bold text-white text-base">Price On Request</span>
            );
          })()}
        </div>
        <button
          onClick={() => setEnquiryModalOpen(true)}
          className="px-6 py-3 bg-[#c9a15a] text-[#1a1815] font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" /> Book Now
        </button>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-10">
            <X className="w-6 h-6" />
          </button>

          <button onClick={e => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button onClick={e => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-10">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={galleryImages[lightboxIdx]}
            alt={`Photo ${lightboxIdx + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {galleryImages.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightboxIdx ? 'bg-white w-5' : 'bg-white/30'}`} />
            ))}
          </div>

          <div className="absolute bottom-4 right-4 text-white/50 text-xs font-medium">
            {lightboxIdx + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        packageItem={pkg}
        defaultType="PackageBooking"
      />
    </div>
  );
}
