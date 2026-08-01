'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQAccordionSectionProps {
  faqs: any[];
}

export default function FAQAccordionSection({ faqs }: FAQAccordionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Got Questions?
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1815]">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-gray-600">
          Everything you need to know about booking, customized itineraries, and travel support.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-3xl border border-[#b8934b]/20 shadow-sm overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-lg text-[#1a1815] hover:text-[#b8934b] transition"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#b8934b] transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-700 font-sans leading-relaxed border-t border-gray-100 pt-4 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
