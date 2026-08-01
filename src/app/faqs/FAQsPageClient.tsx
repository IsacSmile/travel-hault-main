'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FAQsPageClientProps {
  initialFaqs: any[];
}

export default function FAQsPageClient({ initialFaqs }: FAQsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', ...Array.from(new Set(initialFaqs.map((f) => f.category || 'General')))];

  const filteredFaqs = initialFaqs.filter((f) => {
    if (activeCategory === 'All') return true;
    return (f.category || 'General') === activeCategory;
  });

  return (
    <div className="space-y-10 font-sans">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat, idx) => (
          <button
            key={`faq-cat-${cat}-${idx}`}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(0);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-[#051b2e] text-[#c9a15a] shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-200 font-medium">
          No FAQs found in this category.
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-[#1a1815] font-sans transition min-h-[56px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-md shrink-0">
                      {faq.category || 'General'}
                    </span>
                    <span className="leading-snug">{faq.question}</span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#b8934b] text-white' : ''
                    }`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-600 font-sans leading-relaxed border-t border-gray-100 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Contact Strip (Matching specs) */}
      <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 text-center space-y-3 max-w-3xl mx-auto mt-12">
        <h3 className="text-xl font-bold text-black font-sans flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#b8934b]" /> Didn&apos;t see your question?
        </h3>
        <p className="text-sm text-gray-600 font-sans leading-relaxed">
          Our dedicated travel team is available 24/7 to answer any custom itinerary queries.
        </p>
        <div className="pt-2">
          <Link
            href="/contact#contact-form"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow transition"
          >
            <span>Reach Out To Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
