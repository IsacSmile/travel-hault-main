'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Phone, Mail, MapPin, Clock, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/public/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white text-[#051b2e] border-t border-gray-200 font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#051b2e] text-[#c9a15a] flex items-center justify-center font-bold shadow">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-[#051b2e] tracking-wide block">
                  Travel & Hault
                </span>
                <span className="text-[10px] text-[#b8934b] uppercase tracking-widest font-bold block mt-0.5">
                  Escape the City, Find Your Peace
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-700 leading-relaxed pr-4">
              Travel & Hault is a boutique travel agency dedicated to crafting bespoke mountain getaways, tropical island escapes, and hand-tailored luxury honeymoons around the globe.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#b8934b] block">
                Subscribe to Insider Travel Deals
              </span>
              {subscribed ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" /> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-[#051b2e] placeholder-gray-400 outline-none focus:border-[#b8934b] shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl transition shadow"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-gray-700">
              <li>
                <Link href="/" className="hover:text-[#b8934b] transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#b8934b] transition">About Us</Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-[#b8934b] transition">All Tour Packages</Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[#b8934b] transition">Destinations</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#b8934b] transition">Travel Gallery</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#b8934b] transition">My Wishlist</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#b8934b] transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Highlights */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
              Popular Highlights
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-gray-700">
              <li>
                <Link href="/destinations/kashmir" className="hover:text-[#b8934b] transition">Kashmir Valley</Link>
              </li>
              <li>
                <Link href="/destinations/bali" className="hover:text-[#b8934b] transition">Bali Tropics</Link>
              </li>
              <li>
                <Link href="/destinations/kerala" className="hover:text-[#b8934b] transition">Kerala Backwaters</Link>
              </li>
              <li>
                <Link href="/destinations/rajasthan" className="hover:text-[#b8934b] transition">Royal Rajasthan</Link>
              </li>
              <li>
                <Link href="/destinations/dubai" className="hover:text-[#b8934b] transition">Futuristic Dubai</Link>
              </li>
              <li>
                <Link href="/destinations/switzerland" className="hover:text-[#b8934b] transition">Swiss Alps</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
              Reach Out
            </h4>
            <div className="space-y-3 text-xs text-gray-700 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#b8934b] shrink-0 mt-0.5" />
                <span>Suite 402, Signature Towers, MG Road, New Delhi 110001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#b8934b] shrink-0" />
                <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#b8934b] shrink-0" />
                <a href="mailto:hello@travelhault.com" className="hover:underline">hello@travelhault.com</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#b8934b] shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:30 AM - 7:00 PM (IST)</span>
              </div>
            </div>

            {/* Social SVGs */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#051b2e] text-[#051b2e] hover:text-[#c9a15a] border border-gray-300 flex items-center justify-center transition shadow-sm" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#051b2e] text-[#051b2e] hover:text-[#c9a15a] border border-gray-300 flex items-center justify-center transition shadow-sm" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#051b2e] text-[#051b2e] hover:text-[#c9a15a] border border-gray-300 flex items-center justify-center transition shadow-sm" title="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#051b2e] text-[#051b2e] hover:text-[#c9a15a] border border-gray-300 flex items-center justify-center transition shadow-sm" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <p>© {new Date().getFullYear()} Travel & Hault. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link href="/legal/privacy" className="hover:text-[#b8934b] transition">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-[#b8934b] transition">Terms of Service</Link>
            <Link href="/legal/cancellation" className="hover:text-[#b8934b] transition">Cancellation Policy</Link>
            <Link href="/legal/cookie" className="hover:text-[#b8934b] transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
