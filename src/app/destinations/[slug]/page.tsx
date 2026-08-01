import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DestinationDetailView from '@/components/public/DestinationDetailView';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) return { title: 'Destination Not Found' };
  return {
    title: `${dest.name} Travel Guide & Packages | Travel & Hault`,
    description: dest.aboutText,
  };
}

export const revalidate = 60;

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const dest = await prisma.destination.findUnique({
    where: { slug },
    include: { attractions: true },
  });

  if (!dest) notFound();

  // Find related packages that include this destination
  const relatedPackages = await prisma.package.findMany({
    where: {
      destinations: {
        some: { destinationId: dest.id },
      },
    },
    take: 6,
    include: {
      variants: { include: { itineraryDays: true } },
      destinations: { include: { destination: true } },
    },
  });

  return (
    <div className="pt-28 pb-20">
      <DestinationDetailView dest={dest} relatedPackages={relatedPackages} />
    </div>
  );
}
