import React from 'react';
import ContactForm from '@/components/public/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Travel & Hault',
  description: 'Reach out to Travel & Hault travel experts for customized trip itineraries, price quotes, and holiday planning.',
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-16 border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            Contact Travel & Hault
          </h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            Have questions about a package or need a custom trip designed? Our friendly travel specialists are standing by to help.
          </p>
        </div>
      </section>

      {/* Main Grid (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Column: Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-[#F5F0E6] p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#051b2e] border-b border-gray-300 pb-3">
                  Office Information
                </h3>

                <div className="space-y-4 text-xs text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#b8934b] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#051b2e]">Head Office</span>
                      <span>Suite 402, Signature Towers, MG Road, New Delhi 110001</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#b8934b] shrink-0" />
                    <div>
                      <span className="font-bold block text-[#051b2e]">Direct Phone</span>
                      <a href="tel:+919876543210" className="hover:underline text-blue-600 font-semibold">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#b8934b] shrink-0" />
                    <div>
                      <span className="font-bold block text-[#051b2e]">Email Address</span>
                      <a href="mailto:hello@travelhault.com" className="hover:underline text-blue-600 font-semibold">
                        hello@travelhault.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#b8934b] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#051b2e]">Operating Hours</span>
                      <span>Monday - Saturday: 9:30 AM - 7:00 PM (IST)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="bg-[#051b2e] text-white p-6 rounded-3xl border border-gray-800 shadow-lg space-y-3 text-center">
                <MessageSquare className="w-8 h-8 text-[#c9a15a] mx-auto" />
                <h4 className="font-serif font-bold text-lg">Need Quick Instant Reply?</h4>
                <p className="text-xs text-gray-300">
                  Chat directly with our holiday expert on WhatsApp for fast itineraries and quotes.
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
