'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

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
    <footer className="bg-white text-[#1a1815] border-t border-gray-200 font-sans pt-12 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. TOP STRIP (1:1 matching reference screenshot) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          {/* Tagline */}
          <h3 className="font-extrabold text-xl sm:text-2xl text-[#1a1815] font-sans tracking-tight max-w-xs leading-tight">
            Leading the way in adventure
          </h3>

          {/* Social Icons Row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
              </svg>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
              title="X / Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
              title="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
              title="WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </a>
          </div>

          {/* Thin Vertical Divider */}
          <div className="hidden lg:block w-px h-10 bg-gray-200 mx-2" />

          {/* Newsletter Input Field */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="font-extrabold text-sm sm:text-base text-[#1a1815] font-sans shrink-0">
              Join our <br className="hidden sm:inline" /> Newsletter
            </span>

            {subscribed ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Thanks — you&apos;re subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center w-full sm:w-[310px]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your e-mail"
                  className="w-full pl-5 pr-14 py-3 bg-white border border-gray-200 rounded-full text-xs text-[#1a1815] placeholder-gray-400 outline-none focus:border-[#051b2e] shadow-2xs font-sans"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-[#051b2e] hover:bg-[#0a253e] text-white flex items-center justify-center transition shadow-xs"
                  aria-label="Submit newsletter email"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 2. FOUR-COLUMN MAIN FOOTER BLOCK (1:1 matching reference image) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 text-xs font-sans">
          {/* Column 1 — Brand (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#051b2e] text-[#c9a15a] flex items-center justify-center font-bold shadow">
                <Compass className="w-5 h-5" />
              </div>
              <div className="font-serif font-bold text-lg text-[#051b2e] tracking-wider uppercase">
                Travel & Hault
              </div>
            </Link>

            <p className="text-gray-600 leading-relaxed font-sans pr-2 sm:pr-6">
              Travel & Hault is a trusted tour and travel agency based in Delhi, India. We specialize in customized domestic and international tour packages for individuals, families, and groups. With years of experience, we have served thousands of satisfied customers from around the world.
            </p>
          </div>

          {/* Column 2 — Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 block">
              CONTACT
            </span>

            <div className="space-y-2.5 text-gray-700 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>+91 98765 43210 &nbsp;|&nbsp; +91 98765 43211</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <a href="mailto:hello@travelhault.com" className="hover:text-[#b8934b] transition">
                  hello@travelhault.com
                </a>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span className="leading-normal">
                  Suite 402, Signature Towers, MG Road, New Delhi - 110001
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 block">
                WORKING HOURS
              </span>
              <p className="text-gray-700 font-bold">Monday – Sunday: 9:00 AM – 8:00 PM</p>
            </div>
          </div>

          {/* Column 3 — Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 block">
              QUICK LINKS
            </span>

            <ul className="space-y-2 font-medium text-gray-700">
              <li>
                <Link href="/" className="hover:text-[#b8934b] transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#b8934b] transition">About Us</Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-[#b8934b] transition">Tour Packages</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#b8934b] transition">My Wishlist</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#b8934b] transition">FAQs</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#b8934b] transition">Gallery</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#b8934b] transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Popular Highlights (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 block">
              POPULAR HIGHLIGHTS
            </span>

            <ul className="space-y-2 font-medium text-gray-700">
              <li>
                <Link href="/destinations/kerala" className="hover:text-[#b8934b] transition">Kerala Backwaters</Link>
              </li>
              <li>
                <Link href="/destinations/kashmir" className="hover:text-[#b8934b] transition">Kashmir Valley Escape</Link>
              </li>
              <li>
                <Link href="/destinations/rajasthan" className="hover:text-[#b8934b] transition">Rajasthan Heritage Tour</Link>
              </li>
              <li>
                <Link href="/trip-themes/honeymoon-special" className="hover:text-[#b8934b] transition">Honeymoon Specials</Link>
              </li>
              <li>
                <Link href="/trip-themes/beach-getaways" className="hover:text-[#b8934b] transition">Beach Getaways</Link>
              </li>
              <li>
                <Link href="/trip-themes/spiritual-journeys" className="hover:text-[#b8934b] transition">Spiritual Journeys</Link>
              </li>
              <li>
                <Link href="/packages?type=International" className="hover:text-[#b8934b] transition">International Escapes</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. BOTTOM BAR (1:1 matching reference screenshot) */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4 font-sans">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} Travel & Hault. All rights reserved.</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-gray-700">GSTIN: 07ADZPL9107F1Z3</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap font-medium">
            <Link href="/legal/privacy" className="hover:text-[#b8934b] transition">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link href="/legal/terms" className="hover:text-[#b8934b] transition">Terms of Service</Link>
            <span className="text-gray-300">|</span>
            <Link href="/legal/cancellation" className="hover:text-[#b8934b] transition">Cancellation Policy</Link>
            <span className="text-gray-300">|</span>
            <Link href="/legal/cookie" className="hover:text-[#b8934b] transition">Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Live Chat Widget (Bottom-Right) */}
      <a
        href="https://wa.me/919876543210?text=Hi%20Travel%20%26%20Hault!%20I%20want%20to%20plan%20a%20trip."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#051b2e] text-[#c9a15a] hover:bg-[#0a253e] flex items-center justify-center shadow-2xl border border-[#c9a15a]/30 transition-transform duration-300 hover:scale-110"
        title="Chat with Travel Specialist on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
}
