'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Briefcase,
  Calendar,
  RefreshCw,
  Shield,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

interface FAQAccordionSectionProps {
  faqs: any[];
}

const categoryIconMap: Record<string, any> = {
  'Packages & Customization': Briefcase,
  'Booking & Payments': CreditCard,
  'Cancellations & Refunds': RefreshCw,
  'Visa & Travel Info': Calendar,
  'Cookies & Privacy': Shield,
  General: HelpCircle,
};

export default function FAQAccordionSection({ faqs }: FAQAccordionSectionProps) {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Filter homepage FAQs, capped at 6 for a perfect 2x3 grid
  const displayFaqs = (faqs || [])
    .filter((f) => f.showOnHomepage !== false)
    .slice(0, 6);

  if (displayFaqs.length === 0) {
    return null;
  }

  return (
    <div className="relative py-8 overflow-hidden bg-white">
      {/* ── SOFT ACCENT GRADIENT BLOB ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-radial from-[#F5F0E6]/35 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6 mb-10">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#b8934b] block">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight font-sans">
            Got Questions? We&apos;ve Got Answers
          </h2>
          <p className="text-sm text-gray-500 font-sans max-w-xl">
            Everything you need to know before your next adventure with us.
          </p>
        </div>

        <Link
          href="/faqs"
          className="text-xs font-black uppercase tracking-widest text-gray-900 hover:text-[#b8934b] transition-colors duration-200 underline underline-offset-8 shrink-0 pb-1"
        >
          View All FAQs &rarr;
        </Link>
      </div>

      {/* ── EXPANDING CARD GRID (2 Columns × 3 Rows) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {displayFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const IconComponent = categoryIconMap[faq.category] || HelpCircle;

          return (
            <div
              key={faq.id || idx}
              className={`p-6 rounded-3xl border transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer select-none ${
                isOpen
                  ? 'bg-[#F5F0E6]/25 border-gray-200/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.015),0_4px_12px_rgba(0,0,0,0.005)]'
                  : 'bg-white border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
              }`}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              {/* Question Row (Always Visible) */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Category Topic Badge */}
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100/80 flex items-center justify-center text-[#b8934b] shrink-0 shadow-3xs">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Question Text */}
                  <h3 className="font-sans font-bold text-gray-900 text-sm sm:text-base leading-snug pt-1.5 pr-2">
                    {faq.question}
                  </h3>
                </div>

                {/* Rotating Plus Icon Toggle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 mt-1 ${
                    isOpen
                      ? 'bg-[#051b2e] border-[#051b2e] text-white'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  <Plus
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  />
                </div>
              </div>

              {/* Smooth Answer Expansion */}
              {isOpen && (
                <div className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed pt-5 pl-14 border-t border-gray-100/50 mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
