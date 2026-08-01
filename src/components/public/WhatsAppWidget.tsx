'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Popup Card */}
      {open && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-[#1a1815] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm">Travel & Hault Concierge</h4>
                <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online Now
                </span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-gray-50 text-xs text-gray-700 space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm leading-relaxed">
              Hello! 👋 Planning a holiday to Kashmir, Bali, Kerala or Europe? Message our team for instant customized quotes.
            </div>

            <a
              href="https://wa.me/919876543210?text=Hello%20Travel%20%26%20Hault!%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Start WhatsApp Chat
            </a>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 relative group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c9a15a] border-2 border-white text-[9px] font-extrabold flex items-center justify-center text-[#1a1815]">
          1
        </span>
      </button>
    </div>
  );
}
