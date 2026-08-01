import React from 'react';
import { prisma } from '@/lib/prisma';
import GalleryClient from '@/components/public/GalleryClient';
import PageHeader from '@/components/public/PageHeader';

export const metadata = {
  title: 'Travel Gallery | Travel & Hault',
  description: 'View real traveler photos and scenery moments captured across Travel & Hault destinations.',
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Gallery' },
  ];

  const showingCount = {
    start: 1,
    end: images.length,
    total: images.length,
    label: 'PHOTOS',
  };

  return (
    <div className="pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          breadcrumbs={breadcrumbs}
          title="Travel Photo Gallery"
          subtext="Inspiring visual moments captured by our guests across beaches, snow peaks, backwaters, and heritage palaces."
          showingCount={showingCount}
        />

        <div className="mt-8">
          <GalleryClient images={images} />
        </div>
      </div>
    </div>
  );
}
