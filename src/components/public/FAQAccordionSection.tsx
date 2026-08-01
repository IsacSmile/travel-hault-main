// src/components/public/FAQAccordionSection.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Luggage,
  Sliders,
  CalendarCheck,
  Shield,
  CreditCard,
  HelpCircle,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: string;
  category?: string;
  showOnHomepage?: boolean;
}

interface FAQAccordionSectionProps {
  faqs: FAQItem[];
}

// Custom inline SVG Passport Icon since it is not present in standard older lucide-react versions
const PassportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
    <path d="M6 21h14" />
    <path d="M6 18h14" />
    <circle cx="12" cy="11" r="3" />
    <path d="M12 8v6M9 11h6" />
    <path d="M8 5h2M14 5h2" />
  </svg>
);

// Map each exact question to its designated icon according to the spec
const questionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "What is included in your tour packages?": Luggage,
  "Can I customize a tour package?": Sliders,
  "How do I book a tour package?": CalendarCheck,
  "What is your cancellation policy?": Shield,
  "Do you provide visa assistance for international tours?": PassportIcon,
  "What payment methods do you accept?": CreditCard,
};

export default function FAQAccordionSection({
  faqs,
}: FAQAccordionSectionProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10 items-start">
        {displayFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const IconComponent =
            questionIconMap[faq.question] || HelpCircle;

          return (
            <div
              key={faq.id || idx}
              className={`p-5 md:p-6 rounded-2xl border transition-all duration-250 ease-out flex flex-col justify-between cursor-pointer select-none ${
                isOpen
                  ? "bg-[#F5EFE4] border-gray-200/50 shadow-[inset_0_4px_6px_rgba(0,0,0,0.04)]"
                  : "bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[2px]"
              }`}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              {/* Question Row (Always Visible) */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Category Topic Badge */}
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100/80 flex items-center justify-center text-[#b8934b] shrink-0 shadow-3xs">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Question Text */}
                  <h3 className="font-sans font-bold text-gray-900 text-sm sm:text-base leading-snug">
                    {faq.question}
                  </h3>
                </div>

                {/* Rotating Plus Icon Toggle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-250 ${
                    isOpen
                      ? "bg-[#051b2e] border-[#051b2e] text-white"
                      : "bg-gray-100 border-gray-200/50 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <Plus
                    className={`w-4 h-4 transform transition-transform duration-250 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {/* Smooth Answer Expansion */}
              {isOpen && (
                <div className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed pt-5 pl-14 border-t border-gray-100/50 mt-5 animate-in fade-in slide-in-from-top-2 duration-250">
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
