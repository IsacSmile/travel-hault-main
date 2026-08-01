'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQsPageClientProps {
  initialFaqs: any[];
}

export default function FAQsPageClient({ initialFaqs }: FAQsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    'All',
    ...Array.from(new Set((initialFaqs || []).map((f) => f.category || 'General'))),
  ];

  const filteredByCategory = (initialFaqs || []).filter((f) => {
    if (activeCategory === 'All') return true;
    return (f.category || 'General') === activeCategory;
  });

  const finalFiltered = filteredByCategory.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
      {/* ── LEFT COLUMN: CATEGORIES SIDEBAR ── */}
      <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-4">
        <h3 className="hidden lg:block text-xs font-black uppercase tracking-widest text-gray-400">
          Categories
        </h3>

        {/* Mobile View: Horizontal Scrollable Row */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 no-scrollbar">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={`mobile-faq-cat-${cat}-${idx}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0); // Reset first item open on cat switch
                }}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition duration-200 whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-[#F5F0E6] text-gray-900 border-[#F5F0E6] font-black'
                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Desktop View: Vertical List */}
        <div className="hidden lg:flex flex-col gap-1">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={`desktop-faq-cat-${cat}-${idx}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0); // Reset first item open on cat switch
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition duration-200 font-bold ${
                  isActive
                    ? 'bg-[#F5F0E6] text-gray-900 font-extrabold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT COLUMN: SEARCH + ACCORDIONS ── */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOpenIndex(0); // Open first matching result by default
            }}
            placeholder="Search questions or keywords..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200/80 rounded-2xl text-sm outline-none focus:border-[#b8934b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition duration-200"
          />
        </div>

        {/* Accordion list */}
        {finalFiltered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">No matching questions found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try adjusting your search terms or selecting a different category from the sidebar.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
              }}
              className="px-5 py-2.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {finalFiltered.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-sans font-bold text-gray-900 text-sm sm:text-base hover:text-[#b8934b] transition duration-200 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#051b2e] border-[#051b2e] text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-500'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="bg-[#F5F0E6]/30 border-t border-gray-100 p-5 sm:p-6 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Support Strip */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 text-center space-y-3 mt-8">
          <h3 className="text-xl font-bold text-black font-sans flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#b8934b]" /> Still have questions?
          </h3>
          <p className="text-sm text-gray-600 font-sans leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Please reach out to our friendly travel team.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow transition"
            >
              <span>Chat To Our Friendly Team</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
