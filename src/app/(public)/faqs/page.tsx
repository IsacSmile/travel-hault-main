import React from 'react';
import { prisma } from '@/lib/prisma';
import FAQsPageClient from './FAQsPageClient';
import PageHeader from '@/components/public/PageHeader';

export const revalidate = 60;

export default async function FAQsPage() {
  const faqs = await prisma.fAQItem.findMany({
    orderBy: { order: 'asc' },
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'FAQs' },
  ];

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          breadcrumbs={breadcrumbs}
          title="Frequently Asked Questions"
          subtext="Everything you need to know about tour bookings, custom itineraries, cancellation policies, and travel preparation."
        />

        <div className="mt-8">
          <FAQsPageClient initialFaqs={faqs} />
        </div>
      </div>
    </div>
  );
}
