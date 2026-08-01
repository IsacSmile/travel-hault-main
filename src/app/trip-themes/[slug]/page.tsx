import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PackageCard from '@/components/public/PackageCard';
import { Sparkles } from 'lucide-react';

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

  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="relative bg-[#F5F0E6] text-[#051b2e] py-20 border-b border-gray-200/60 overflow-hidden">
        {theme.bannerImage && (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={theme.bannerImage} alt={theme.name} className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E6] via-[#F5F0E6]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#b8934b]" /> Theme Collection
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#051b2e]">
            {theme.name}
          </h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">{theme.description}</p>
        </div>
      </section>

      {/* Packages Grid (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {packages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-[#F5F0E6] rounded-3xl border border-gray-200">
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
      </section>
    </div>
  );
}
