import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import FAQsPageClient from './FAQsPageClient';
import { HelpCircle } from 'lucide-react';

export const revalidate = 60;

export default async function FAQsPage() {
  const faqs = await prisma.fAQItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="bg-white min-h-screen font-sans pb-20">
      {/* Page Hero Banner */}
      <section className="bg-[#051b2e] text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#c9a15a] border border-[#c9a15a]/30 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#c9a15a]" /> Help & Support Center
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Everything you need to know about tour bookings, custom itineraries, cancellation policies, and travel preparation.
          </p>
        </div>
      </section>

      {/* Main FAQ Content Container */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <FAQsPageClient initialFaqs={faqs} />
      </section>
    </div>
  );
}
