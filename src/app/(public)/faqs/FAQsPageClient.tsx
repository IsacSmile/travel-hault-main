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

interface FAQsPageClientProps {
  initialFaqs: any[];
}

const iconCategoryMap: Record<string, any> = {
  'Packages & Customization': Package,
  'Booking & Payments': CreditCard,
  'Cancellations & Refunds': RefreshCw,
  'Visa & Travel Info': FileText,
  General: HelpCircle,
};

export default function FAQsPageClient({ initialFaqs }: FAQsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    'All',
    ...Array.from(new Set((initialFaqs || []).map((f) => f.category || 'General'))),
  ];

  const filteredFaqs = (initialFaqs || []).filter((f) => {
    if (activeCategory === 'All') return true;
    return (f.category || 'General') === activeCategory;
  });

  return (
    <div className="space-y-12 font-sans max-w-4xl mx-auto">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 px-4 no-scrollbar">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={`faq-page-cat-${cat}-${idx}`}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
                isActive
                  ? 'bg-[#051b2e] text-[#c9a15a] shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Accordion Row List */}
      <div className="max-w-3xl mx-auto divide-y divide-gray-100 border-t border-b border-gray-100 px-4">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm font-medium">
            No questions found in this category.
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

                  {/* Plain Chevron Icon */}
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

      {/* Support Strip */}
      <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 text-center space-y-3 max-w-2xl mx-auto mt-8">
        <h3 className="text-xl font-bold text-black font-sans flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#b8934b]" /> Still have questions?
        </h3>
        <p className="text-sm text-gray-600 font-sans leading-relaxed">
          Can&apos;t find what you&apos;re looking for? Please reach out to our friendly travel team.
        </p>
        <div className="pt-2">
          <Link
            href="/contact#contact-form"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow transition"
          >
            <span>Chat To Our Friendly Team</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
