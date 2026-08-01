'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: string;
  name: string;
  reviewText: string;
  avatar?: string;
  initial?: string;
  color?: string;
}
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const avatarColors = [
  'bg-teal-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-slate-500',
];

// Rich fallback testimonial dataset matching reference screenshot if DB has few items
const defaultTestimonials = [
  {
    id: 't1',
    name: 'Rithvik Kaki',
    reviewText: 'Our trip with Travel & Hault was truly unforgettable. From Delhi to Agra, Jaipur, Mathura, and Udaipur, everything was handled seamlessly.',
    initial: 'R',
    color: 'bg-slate-400',
  },
  {
    id: 't2',
    name: 'Kaki venkata chalapati',
    reviewText: 'Our experience with Travel & Hault was exceptional. Based in Delhi, they organized a wonderful Golden Triangle circuit with clean cars and drivers.',
    initial: 'K',
    color: 'bg-teal-600',
  },
  {
    id: 't3',
    name: 'Kaki Venkata Chalapati',
    reviewText: 'Superb hospitality and prompt response throughout our family vacation across Rajasthan. Driver was polite and hotels were 4-star.',
    initial: 'K',
    color: 'bg-blue-500',
  },
  {
    id: 't4',
    name: 'Adil',
    reviewText: '- Amazing time and fantastic and clean experience\n- Everything was seamless with the private cab transfers and hotel check-ins.',
    initial: 'A',
    color: 'bg-blue-600',
  },
  {
    id: 't5',
    name: 'Anwar Meah',
    reviewText: 'We travel to India (Delhi) this December and booked with Travel & Hault in September. Excellent planning and prompt WhatsApp support.',
    initial: 'A',
    color: 'bg-pink-600',
  },
  {
    id: 't6',
    name: '1214u',
    reviewText: 'We booked direct with Travel & Hault to visit the Golden Triangle, Udaipur, and Kashmir. The houseboat stay was breathtaking.',
    initial: '1',
    color: 'bg-amber-600',
  },
  {
    id: 't7',
    name: 'A Hus',
    reviewText: 'Went to India Dec 2022 and used Travel & Hault. They were brilliant in every department, from picking us up at 2 AM to customizing sights.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 't8',
    name: 'Aweitslulu',
    reviewText: 'High quality 5-star experience throughout our Kerala backwaters and Munnar tea estate honeymoon package.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
];

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Combine DB testimonials with rich fallback list to form two staggered rows
  const list = testimonials && testimonials.length >= 6 ? testimonials : defaultTestimonials;

  // Split into Row 1 & Row 2 for staggered two-row layout
  const half = Math.ceil(list.length / 2);
  const row1 = list.slice(0, half);
  const row2 = list.slice(half);

  // Duplicate arrays for smooth infinite continuous scrolling
  const row1Extended = [...row1, ...row1, ...row1];
  const row2Extended = [...row2, ...row2, ...row2];

  return (
    <div className="space-y-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight font-sans">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-sans">
            Hear from our adventurers about their recent travel experiences
          </p>
        </div>

        <Link
          href="/about"
          className="text-sm font-extrabold text-black hover:text-[#b8934b] transition shrink-0 underline underline-offset-4 font-sans sm:mt-3"
        >
          See All Testimonials
        </Link>
      </div>

      {/* Staggered Two-Row Fast Marquee Carousel Container */}
      <div
        className="relative overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Soft Fade Gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

        <div className="space-y-5">
          {/* Row 1 (Fast Marquee Left - 12s) */}
          <div
            className={`flex gap-5 transition-all duration-700 ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
            style={{
              animation: 'infiniteDriftLeft 12s linear infinite',
            }}
          >
            {row1Extended.map((item, idx) => (
              <TestimonialCard key={`r1-${item.id}-${idx}`} item={item} colorIndex={idx} />
            ))}
          </div>

          {/* Row 2 (Fast Marquee Right - 14s) */}
          <div
            className={`flex gap-5 pl-12 transition-all duration-700 ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
            style={{
              animation: 'infiniteDriftRight 14s linear infinite',
            }}
          >
            {row2Extended.map((item, idx) => (
              <TestimonialCard key={`r2-${item.id}-${idx}`} item={item} colorIndex={idx + 3} />
            ))}
          </div>
        </div>
      </div>

      {/* Infinite Drift CSS Animation Keyframes */}
      <style jsx global>{`
        @keyframes infiniteDriftLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        @keyframes infiniteDriftRight {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Testimonial Card Component
   ───────────────────────────────────────────────── */
function TestimonialCard({ item, colorIndex }: { item: Testimonial; colorIndex: number }) {
  const initial = item.initial || item.name.charAt(0).toUpperCase();
  const bgColor = item.color || avatarColors[colorIndex % avatarColors.length];

  return (
    <div className="w-[310px] sm:w-[340px] shrink-0 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 font-sans">
      <div className="flex items-center gap-3">
        {item.avatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.avatar}
            alt={item.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full ${bgColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
          >
            {initial}
          </div>
        )}

        <h4 className="font-bold text-sm text-[#1a1815] truncate font-sans">{item.name}</h4>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-sans">
        {item.reviewText}
      </p>
    </div>
  );
}
