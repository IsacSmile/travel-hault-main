'use client';

import React from 'react';
import { Compass, ShieldCheck, Headphones, Award, Sparkles } from 'lucide-react';

interface TrustBadgesSectionProps {
  badges: any[];
}

const iconMap: Record<string, any> = {
  Compass,
  ShieldCheck,
  Headphones,
  Award,
};

export default function TrustBadgesSection({ badges }: TrustBadgesSectionProps) {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b] inline-flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Why Choose Us
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1815]">
          The Travel & Hault Promise
        </h2>
        <p className="text-sm text-gray-600">
          We combine local expertise, transparent pricing, and 24/7 dedicated service so you can relax completely.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge) => {
          const IconComponent = iconMap[badge.icon] || ShieldCheck;
          return (
            <div
              key={badge.id}
              className="bg-[#f4efe6] border border-[#b8934b]/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group hover:bg-[#1a1815] hover:text-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#1a1815] text-[#c9a15a] flex items-center justify-center mb-4 group-hover:bg-[#c9a15a] group-hover:text-[#1a1815] transition duration-300 shadow">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1815] group-hover:text-white transition">
                {badge.title}
              </h3>
              <p className="text-xs text-gray-600 group-hover:text-gray-300 transition mt-2 leading-relaxed">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
