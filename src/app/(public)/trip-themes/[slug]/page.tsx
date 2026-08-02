import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PackageCard from '@/components/public/PackageCard';
import PageHeader from '@/components/public/PageHeader';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = await prisma.theme.findUnique({ where: { slug } });
  return {
    title: theme ? `${theme.name} Packages | Travel & Hault` : 'Trip Theme',
  };
}

export const revalidate = 60;

export default async function TripThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const theme = await prisma.theme.findUnique({
    where: { slug },
    include: {
      packages: {
        include: {
          package: {
            include: {
              variants: { include: { itineraryDays: true } },
              destinations: { include: { destination: true } },
            },
          },
        },
      },
    },
  });

  if (!theme) notFound();

  const packages = theme.packages.map((tp) => tp.package);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Trip Themes', href: '/packages' },
    { label: theme.name },
  ];

  const showingCount =
    packages.length > 0
      ? {
          start: 1,
          end: packages.length,
          total: packages.length,
          label: 'PACKAGES IN THIS THEME',
        }
      : undefined;

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          breadcrumbs={breadcrumbs}
          title={theme.name}
          subtext={theme.description || `Explore our handpicked ${theme.name} tour packages.`}
          showingCount={showingCount}
        />

        <div className="mt-8">
          {packages.length === 0 ? (
            <div className="p-16 text-center text-gray-500 bg-[#F5F0E6] rounded-3xl border border-gray-200">
              No packages tagged under this theme yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
