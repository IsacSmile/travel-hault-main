'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

interface FAQAccordionSectionProps {
  faqs: any[];
}

export default function FAQAccordionSection({ faqs }: FAQAccordionSectionProps) {
  // Only one open item at a time for clean UX
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Filter homepage FAQs if showOnHomepage is set, otherwise take first 6
  const displayFaqs =
    faqs && faqs.length > 0
      ? faqs.filter((f) => f.showOnHomepage !== false).slice(0, 6)
      : [];

  return (
    <div className="space-y-8 font-sans">
      {/* Desktop 2-Column Layout / Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Eyebrow + Title + Destination Image) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 block font-sans">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-[1.15] font-sans">
              All You Should Know Before Embarking on Your Journey
            </h2>
          </div>

          {/* Tall Scenic Destination Photo (Matching attached screenshot) */}
          <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[460px] rounded-[28px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
              alt="Pangong Lake Kashmir scenic landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column (Top Strip + Accordion List) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Strip (1:1 matching reference image) */}
          <div className="flex flex-col justify-end text-left lg:text-right space-y-1 pb-2">
            <h4 className="font-bold text-sm text-black font-sans">
              Didn&apos;t see your question?
            </h4>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              See more{' '}
              <Link href="/faqs" className="font-bold text-black underline underline-offset-2 hover:text-[#b8934b] transition">
                FAQs
              </Link>{' '}
              or Our team is here to help — just{' '}
              <Link href="/contact#contact-form" className="font-bold text-black underline underline-offset-2 hover:text-[#b8934b] transition">
                reach out
              </Link>{' '}
              and we&apos;ll reply shortly.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
            {displayFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1a1815] font-sans transition min-h-[56px]"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <div
                      className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#b8934b] text-white' : ''
                      }`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed border-t border-gray-100 pt-3 animate-in fade-in duration-200">
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
