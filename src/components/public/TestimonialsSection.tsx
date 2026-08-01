'use client';

import React from 'react';
import { Star, Quote, MessageSquare } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: any[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" /> Verified Guest Reviews
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1815]">
          Stories From Our Travelers
        </h2>
        <p className="text-sm text-gray-600">
          Read real experiences shared by couples, families, and solo adventurers who booked with Travel & Hault.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-8 border border-[#b8934b]/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
          >
            <Quote className="w-10 h-10 text-[#b8934b]/20 absolute top-6 right-6" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-sm text-gray-700 font-sans leading-relaxed italic">
                "{t.reviewText}"
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-6">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1a1815]">{t.name}</h4>
                <span className="text-xs text-gray-400">{t.sourceLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
