'use client';

import React, { useState } from 'react';
import { X, MapPin, ZoomIn } from 'lucide-react';

interface GalleryImage {
  id: string;
  image: string;
  caption?: string;
  category?: string;
  categoryBadge?: string;
  locationTag?: string;
  location?: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  // Extract unique categories safely
  const rawCategories = (images || []).map((img) => img.categoryBadge || img.category || 'General').filter(Boolean);
  const categories = ['All', ...Array.from(new Set(rawCategories))];

  const filteredImages = (images || []).filter((img) => {
    if (activeCategory === 'All') return true;
    const cat = img.categoryBadge || img.category || 'General';
    return cat === activeCategory;
  });

  return (
    <div className="space-y-8">
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat, idx) => (
          <button
            key={`cat-${cat}-${idx}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-[#1a1815] text-[#c9a15a] shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Masonry / Grid */}
      {filteredImages.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-200">
          No photos found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((g, idx) => (
            <div
              key={g.id || `img-${idx}`}
              onClick={() => setLightboxImg(g)}
              className="group relative rounded-3xl overflow-hidden h-72 bg-gray-900 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.image}
                alt={g.caption || 'Gallery Image'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-between opacity-90 group-hover:opacity-100 transition">
                <div className="flex justify-end">
                  <span className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#c9a15a] uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {g.locationTag || 'Destination'}
                  </span>
                  <p className="text-xs text-white font-medium line-clamp-1">{g.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1a1815] rounded-3xl overflow-hidden shadow-2xl border border-[#c9a15a]/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full transition z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImg.image}
                alt={lightboxImg.caption || 'Gallery Zoom'}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-[#1a1815] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c9a15a] block">
                  {lightboxImg.locationTag}
                </span>
                <p className="text-sm text-gray-200 mt-0.5">{lightboxImg.caption}</p>
              </div>

              <span className="text-xs bg-[#c9a15a] text-[#1a1815] font-extrabold px-3 py-1 rounded-full">
                {lightboxImg.categoryBadge || lightboxImg.category || 'General'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
