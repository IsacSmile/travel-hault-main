'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  X as XIcon,
} from 'lucide-react';

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Settings State loaded from DB
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([
    '+91 98765 43210',
    '+91 98765 43211',
  ]);
  const [contactEmail, setContactEmail] = useState('hello@travelhault.com');
  const [address, setAddress] = useState(
    'Suite 402, Signature Towers, MG Road, New Delhi - 110001'
  );
  const [workingHours, setWorkingHours] = useState(
    'Monday – Sunday: 9:00 AM – 8:00 PM'
  );
  const [gstinNumber, setGstinNumber] = useState<string | null>(
    '07ADZPL9107F1Z3'
  );

  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([
    { id: '1', platform: 'Facebook', url: 'https://facebook.com', isActive: true },
    { id: '2', platform: 'Instagram', url: 'https://instagram.com', isActive: true },
    { id: '3', platform: 'X', url: 'https://twitter.com', isActive: true },
    { id: '4', platform: 'LinkedIn', url: 'https://linkedin.com', isActive: true },
    { id: '5', platform: 'Pinterest', url: 'https://pinterest.com', isActive: true },
    { id: '6', platform: 'WhatsApp', url: 'https://wa.me/919876543210', isActive: true },
    { id: '7', platform: 'Youtube', url: 'https://youtube.com', isActive: true },
    { id: '8', platform: 'TikTok', url: 'https://tiktok.com', isActive: true },
  ]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/manage/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.phoneNumbersJson) {
            const parsedPhone = JSON.parse(data.phoneNumbersJson);
            if (Array.isArray(parsedPhone) && parsedPhone.length > 0) {
              setPhoneNumbers(parsedPhone);
            }
          }
          if (data.email) setContactEmail(data.email);
          if (data.address) setAddress(data.address);
          if (data.workingHours) setWorkingHours(data.workingHours);
          if (typeof data.gstinNumber !== 'undefined') {
            setGstinNumber(data.gstinNumber);
          }

          if (data.socialLinksJson) {
            try {
              const parsedSocial = JSON.parse(data.socialLinksJson);
              if (Array.isArray(parsedSocial)) {
                setSocialLinks(parsedSocial);
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching site settings for footer', e);
      }
    }
    loadSettings();
  }, []);

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

  const activeSocialLinks = socialLinks.filter((s) => s.isActive);

  return (
    <footer className="bg-white text-[#1a1815] border-t border-gray-200 font-sans pt-12 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. TOP STRIP */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          {/* Tagline */}
          <h3 className="font-extrabold text-xl sm:text-2xl text-[#1a1815] font-sans tracking-tight max-w-xs leading-tight">
            Leading the way in adventure
          </h3>

          {/* Dynamic Social Icons Row */}
          {activeSocialLinks.length > 0 && (
            <div className="flex items-center gap-2.5 flex-wrap">
              {activeSocialLinks.map((s) => (
                <a
                  key={s.id || s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-black flex items-center justify-center text-gray-700 transition"
                  title={s.platform}
                >
                  {(() => {
                    const p = s.platform.toLowerCase();
                    switch (p) {
                      case 'facebook':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                          </svg>
                        );
                      case 'instagram':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        );
                      case 'x':
                      case 'twitter':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        );
                      case 'linkedin':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        );
                      case 'pinterest':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                          </svg>
                        );
                      case 'whatsapp':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        );
                      case 'messenger':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
                          </svg>
                        );
                      case 'youtube':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        );
                      case 'tiktok':
                        return (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                        );
                      default:
                        return (
                          <span className="text-xs font-bold font-sans">{s.platform.slice(0, 2).toUpperCase()}</span>
                        );
                    }
                  })()}
                </a>
              ))}
            </div>
          )}

          {/* Thin Vertical Divider */}
          {activeSocialLinks.length > 0 && <div className="hidden lg:block w-px h-10 bg-gray-200 mx-2" />}

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

        {/* 2. FOUR-COLUMN MAIN FOOTER BLOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 text-xs font-sans">
          {/* Column 1 — Brand */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group hover:scale-101 transition-transform duration-300">
              <Logo variant="full" color="original" height={45} />
            </Link>

            <p className="text-gray-600 leading-relaxed font-sans pr-2 sm:pr-6">
              Travel & Hault is a trusted tour and travel agency based in Delhi, India. We specialize in customized domestic and international tour packages for individuals, families, and groups. With years of experience, we have served thousands of satisfied customers from around the world.
            </p>
          </div>

          {/* Column 2 — Contact */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 block">
              CONTACT
            </span>

            <div className="space-y-2.5 text-gray-700 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>{phoneNumbers.join('  |  ')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-[#b8934b] transition">
                  {contactEmail}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span className="leading-normal">{address}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 block">
                WORKING HOURS
              </span>
              <p className="text-gray-700 font-bold">{workingHours}</p>
            </div>
          </div>

          {/* Column 3 — Quick Links */}
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

          {/* Column 4 — Popular Highlights */}
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

        {/* 3. BOTTOM BAR */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4 font-sans">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} Travel & Hault. All rights reserved.</span>
            {gstinNumber && (
              <>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-gray-700">GSTIN: {gstinNumber}</span>
              </>
            )}
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

      {/* Floating Speed-Dial Chat FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
        {/* Main toggle button */}
        <button
          onClick={() => setFabOpen((prev) => !prev)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            fabOpen
              ? 'bg-[#3a3f47] text-white rotate-0'
              : 'bg-[#051b2e] text-[#c9a15a] hover:bg-[#0a253e] border border-[#c9a15a]/30'
          }`}
          aria-label={fabOpen ? 'Close chat options' : 'Open chat options'}
          title={fabOpen ? 'Close' : 'Chat with us'}
        >
          <span
            className={`transition-transform duration-300 ${fabOpen ? 'rotate-0' : 'rotate-0'}`}
          >
            {fabOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </span>
        </button>

        {/* WhatsApp sub-button */}
        <a
          href="https://wa.me/919876543210?text=Hi%20Travel%20%26%20Hault!%20I%20want%20to%20plan%20a%20trip."
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg transition-all duration-300 ${
            fabOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
          }`}
          style={{ transitionDelay: fabOpen ? '80ms' : '0ms' }}
          aria-label="Chat on WhatsApp"
          title="WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* Messenger sub-button */}
        <a
          href="https://m.me/travelhault"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-lg transition-all duration-300 ${
            fabOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
          }`}
          style={{ transitionDelay: fabOpen ? '160ms' : '0ms' }}
          aria-label="Chat on Messenger"
          title="Messenger"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
