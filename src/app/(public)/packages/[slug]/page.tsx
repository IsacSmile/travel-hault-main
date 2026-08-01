import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PackageDetailView from '@/components/public/PackageDetailView';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
  });

  if (!pkg) return { title: 'Package Not Found' };

  return {
    title: `${pkg.title} | Travel & Hault`,
    description: pkg.shortDescription,
  };
}

export const revalidate = 60;

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      themes: { include: { theme: true } },
      destinations: { include: { destination: true }, orderBy: { order: 'asc' } },
      variants: { include: { itineraryDays: { orderBy: { dayNumber: 'asc' } } } },
    },
  });

  if (!pkg) notFound();

  // Fetch related packages
  const relatedPackages = await prisma.package.findMany({
    where: {
      id: { not: pkg.id },
      type: pkg.type,
    },
    take: 3,
    include: {
      variants: { include: { itineraryDays: true } },
      destinations: { include: { destination: true } },
    },
  });

  return (
    <div className="pt-28 pb-20">
      <PackageDetailView pkg={pkg} relatedPackages={relatedPackages} />
    </div>
  );
}
