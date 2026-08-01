'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  HelpCircle,
  Package,
  CreditCard,
  RefreshCw,
  FileText,
  MessageCircle,
} from 'lucide-react';

interface FAQAccordionSectionProps {
  faqs: any[];
}

const iconCategoryMap: Record<string, any> = {
  'Packages & Customization': Package,
  'Booking & Payments': CreditCard,
  'Cancellations & Refunds': RefreshCw,
  'Visa & Travel Info': FileText,
  General: HelpCircle,
};

export default function FAQAccordionSection({ faqs }: FAQAccordionSectionProps) {
  // First item open by default as shown in reference
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter homepage FAQs if showOnHomepage is set, otherwise fallback
  const displayFaqs =
    faqs && faqs.length > 0
      ? faqs.filter((f) => f.showOnHomepage !== false)
      : [];

  // Extract distinct categories
  const categories = [
    'All',
    ...Array.from(new Set(displayFaqs.map((f) => f.category || 'General'))),
  ];

  // Filter based on active category
  const filteredFaqs = displayFaqs.filter((f) => {
    if (activeCategory === 'All') return true;
    return (f.category || 'General') === activeCategory;
  });

  return (
    <div className="space-y-12 font-sans max-w-5xl mx-auto">
      {/* 1. Top Decorative Image Banner */}
      <div className="relative w-full h-[240px] sm:h-[320px] lg:h-[360px] rounded-[32px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Scenic Pangong Lake travel landscape"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Heading & Subtext Block (Centered) */}
      <div className="text-center max-w-2xl mx-auto space-y-3 px-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1a1815] tracking-tight font-sans">
          Frequently Asked Questions
        </h2>

        <p className="text-sm sm:text-base text-gray-500 font-sans leading-relaxed">
          These are the most common questions our travelers ask about our tours.
        </p>

        <p className="text-xs sm:text-sm text-gray-500 font-sans pt-1">
          Can&apos;t find what you&apos;re looking for?{' '}
          <Link
            href="/contact#contact-form"
            className="font-bold text-[#1a1815] underline underline-offset-4 hover:text-[#b8934b] transition inline-block min-h-[44px] py-1"
          >
            Chat to our friendly team!
          </Link>
        </p>
      </div>

      {/* 3. Category Filter Pills (Centered & Horizontally Scrollable on Mobile) */}
      <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 px-4 no-scrollbar">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={`cat-pill-${cat}-${idx}`}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
                isActive
                  ? 'bg-[#1a1815] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. FAQ List (Centered Contained Max-Width ~780px) */}
      <div className="max-w-3xl mx-auto divide-y divide-gray-100 border-t border-b border-gray-100 px-4">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm font-medium">
            No questions in this category.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const IconComponent = iconCategoryMap[faq.category] || HelpCircle;

            return (
              <div key={faq.id || idx} className="py-5 sm:py-6 transition-all">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-gray-200/80 bg-gray-50/80 flex items-center justify-center text-gray-700 shrink-0 group-hover:bg-gray-100 transition shadow-2xs">
                      <IconComponent className="w-5 h-5 text-gray-700" />
                    </div>

                    {/* Question Text */}
                    <h3 className="font-bold text-sm sm:text-lg text-[#1a1815] font-sans leading-snug group-hover:text-[#b8934b] transition">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Plain Chevron Icon (No circle background) */}
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-black' : 'group-hover:text-black'
                    }`}
                  />
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="pl-14 sm:pl-15 pr-4 pt-3 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed space-y-2 animate-in fade-in duration-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
