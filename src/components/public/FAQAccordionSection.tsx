'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface FAQAccordionSectionProps {
  faqs: any[];
}

export default function FAQAccordionSection({ faqs }: FAQAccordionSectionProps) {
  // Accordion-exclusive: single open item at a time for optimal mobile/desktop scroll depth
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Filter homepage FAQs if showOnHomepage is set, otherwise default to first 6 items
  const displayFaqs =
    faqs && faqs.length > 0
      ? faqs.filter((f) => f.showOnHomepage !== false).slice(0, 6)
      : [];

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Grid: 2-Column Desktop (>1024px) / Stacked Single-Column on Tablet & Mobile (<1024px) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Desktop) / Top Section (Mobile & Tablet) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 block font-sans">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-black tracking-tight leading-[1.12] font-sans">
              All You Should Know Before Embarking on Your Journey
            </h2>
          </div>

          {/* "Didn't see your question?" Strip (Tablet & Mobile: Left-aligned below heading) */}
          <div className="block lg:hidden space-y-1">
            <h4 className="font-bold text-sm text-black font-sans">
              Didn&apos;t see your question?
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              See more{' '}
              <Link
                href="/faqs"
                className="font-bold text-black underline underline-offset-4 hover:text-[#b8934b] transition inline-block py-1 min-h-[44px] leading-tight"
              >
                FAQs
              </Link>{' '}
              or Our team is here to help — just{' '}
              <Link
                href="/contact#contact-form"
                className="font-bold text-black underline underline-offset-4 hover:text-[#b8934b] transition inline-block py-1 min-h-[44px] leading-tight"
              >
                reach out
              </Link>{' '}
              and we&apos;ll reply shortly.
            </p>
          </div>

          {/* Destination Photo (Mobile/Tablet: ~4:3 aspect ratio, full-width / Desktop: Tall crop filling left column) */}
          <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[480px] rounded-2xl sm:rounded-[32px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              alt="Pangong Lake Kashmir scenic landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column (Desktop) / Bottom Section (Mobile & Tablet) */}
        <div className="lg:col-span-7 space-y-6">
          {/* "Didn't see your question?" Strip (Desktop: Right-aligned above accordion) */}
          <div className="hidden lg:flex flex-col text-right space-y-1 pb-1">
            <h4 className="font-bold text-base text-black font-sans">
              Didn&apos;t see your question?
            </h4>
            <p className="text-sm text-gray-500 font-sans leading-relaxed">
              See more{' '}
              <Link
                href="/faqs"
                className="font-bold text-black underline underline-offset-4 hover:text-[#b8934b] transition"
              >
                FAQs
              </Link>{' '}
              or Our team is here to help — just{' '}
              <Link
                href="/contact#contact-form"
                className="font-bold text-black underline underline-offset-4 hover:text-[#b8934b] transition"
              >
                reach out
              </Link>{' '}
              and we&apos;ll reply shortly.
            </p>
          </div>

          {/* Accordion Pills Stack */}
          <div className="space-y-3.5">
            {displayFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1a1815] font-sans transition min-h-[48px] sm:min-h-[64px]"
                  >
                    <span className="leading-snug font-sans">{faq.question}</span>
                    <div
                      className={`w-9 h-9 rounded-full bg-gray-100/90 border border-gray-200/80 flex items-center justify-center text-gray-700 shrink-0 transition-all duration-300 ${
                        isOpen ? 'rotate-180 bg-[#b8934b] text-white border-transparent' : ''
                      }`}
                      aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
                    >
                      <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed border-t border-gray-100 pt-4 animate-in fade-in duration-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
