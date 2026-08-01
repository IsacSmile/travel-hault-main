import React from 'react';
import { prisma } from '@/lib/prisma';
import GalleryClient from '@/components/public/GalleryClient';
import { Camera } from 'lucide-react';

export const metadata = {
  title: 'Travel Gallery | Travel & Hault',
  description: 'View real traveler photos and scenery moments captured across Travel & Hault destinations.',
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-16 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#b8934b]" /> Photo Journal
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            Travel Photo Gallery
          </h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            Inspiring visual moments captured by our guests across beaches, snow peaks, backwaters, and heritage palaces.
          </p>
        </div>
      </section>

      {/* Gallery Client (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryClient images={images} />
        </div>
      </section>
    </div>
  );
}
