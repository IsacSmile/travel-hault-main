import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | Travel & Hault',
  description: 'Learn about Travel & Hault boutique travel agency, our core values, and our commitment to luxury experiential travel.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-20 border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
            Our Journey & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            Escape the City, Find Your Peace
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Travel & Hault was founded on a simple principle: travel shouldn't be about hurried checklists, but deep rest, unforgettable sights, and soul-nourishing peace.
          </p>
        </div>
      </section>

      {/* Main Story & Values Grid (WHITE background) */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
                Boutique Hospitality
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
                Crafting Memorable Journeys Across Mountains, Beaches & Heritage
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed font-sans">
                From Kashmir’s serene Dal Lake houseboats to Bali’s lush jungle infinity pools, our team designs customized luxury itineraries tailored specifically to your group size, travel rhythm, and preferences.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed font-sans">
                We handle every detail — private airport transfers, hand-vetted 4-star and boutique hotels, verified local drivers, and on-trip concierge assistance — so you can focus entirely on creating memories.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '100% Customized & Flexible Day Schedules',
                  'Pre-Vetted Handpicked Luxury Resorts & Boutique Stays',
                  '24/7 Dedicated On-Trip WhatsApp Assistance',
                  'Transparent Pricing with No Hidden Surcharges',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-[#051b2e]">
                    <CheckCircle2 className="w-5 h-5 text-[#b8934b] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
                alt="Travel & Hault Journey"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="bg-[#F5F0E6] p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#051b2e] text-[#c9a15a] flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#051b2e]">Tailored Experiences</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                No cookie-cutter group tours. Every itinerary is modified around your flights and style.
              </p>
            </div>

            <div className="bg-[#F5F0E6] p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#051b2e] text-[#c9a15a] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#051b2e]">Safety & Hygiene</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clean sanitized vehicles, verified local drivers, and secure payment processing.
              </p>
            </div>

            <div className="bg-[#F5F0E6] p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#051b2e] text-[#c9a15a] flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#051b2e]">Genuine Care</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our travel specialists remain on standby throughout your trip to assist anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white text-[#051b2e] p-12 rounded-3xl border border-gray-200 text-center space-y-6 shadow-xl">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to Plan Your Next Great Escape?
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Contact our travel experts today and let us build your custom trip itinerary.
            </p>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#051b2e] text-[#c9a15a] font-extrabold text-sm rounded-xl shadow-lg transition hover:bg-[#0a253e]"
              >
                <span>Get Free Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
