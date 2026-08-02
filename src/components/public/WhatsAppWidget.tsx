'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface ChatWidgetSettings {
  whatsappNumber: string;
  whatsappEnabled: boolean;
  messengerLink: string;
  messengerEnabled: boolean;
}

// Custom official SVG icons for WhatsApp and Messenger
const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.454h.005c6.554 0 11.89-5.335 11.894-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

const MessengerIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.085-2.242c1.092.302 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.888-3.26-6.559 6.963z" />
  </svg>
);

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'messenger' | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<ChatWidgetSettings>({
    whatsappNumber: '+91 74075 24498',
    whatsappEnabled: true,
    messengerLink: 'travelhault',
    messengerEnabled: true,
  });

  useEffect(() => {
    let active = true;
    async function fetchSettings() {
      try {
        const res = await fetch('/api/public/settings', { cache: 'no-store' });
        if (res.ok && active) {
          const data = await res.json();
          setSettings({
            whatsappNumber: data.whatsappNumber || '+91 74075 24498',
            whatsappEnabled: data.whatsappEnabled !== undefined ? data.whatsappEnabled : true,
            messengerLink: data.messengerLink || 'travelhault',
            messengerEnabled: data.messengerEnabled !== undefined ? data.messengerEnabled : true,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchSettings();
    return () => {
      active = false;
    };
  }, []);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    // Keep open if user has an active chat popover card typed or focused
    if (activeChannel && userQuery.trim().length > 0) return;

    leaveTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setActiveChannel(null);
    }, 350);
  };

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = userQuery.trim()
      ? encodeURIComponent(userQuery.trim())
      : encodeURIComponent('Hello Travel & Hault! I would like to inquire about tour packages.');
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
    setOpen(false);
    setActiveChannel(null);
    setUserQuery('');
  };

  const handleSendMessenger = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let link = settings.messengerLink.trim();
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      if (link.startsWith('m.me/')) {
        link = `https://${link}`;
      } else {
        link = `https://m.me/${link}`;
      }
    }
    if (userQuery.trim()) {
      link += `?text=${encodeURIComponent(userQuery.trim())}`;
    }
    window.open(link, '_blank');
    setOpen(false);
    setActiveChannel(null);
    setUserQuery('');
  };

  // If both channels are disabled in admin settings, do not render widget
  if (!settings.whatsappEnabled && !settings.messengerEnabled) {
    return null;
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans group/widget"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Active Channel Popover Card */}
      {open && activeChannel && (
        <div className="mb-2.5 w-76 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div
            className={`p-3.5 text-white flex items-center justify-between ${
              activeChannel === 'whatsapp' ? 'bg-[#1a1815]' : 'bg-[#0084FF]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow ${
                  activeChannel === 'whatsapp' ? 'bg-emerald-500' : 'bg-white text-[#0084FF]'
                }`}
              >
                {activeChannel === 'whatsapp' ? (
                  <WhatsAppIcon className="w-4 h-4" />
                ) : (
                  <MessengerIcon className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs">
                  {activeChannel === 'whatsapp' ? 'WhatsApp Support' : 'Messenger Chat'}
                </h4>
                <span className="text-[9px] text-emerald-300 font-bold block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online & Responsive
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveChannel(null)}
              className="p-1 text-gray-300 hover:text-white rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form
            onSubmit={activeChannel === 'whatsapp' ? handleSendWhatsApp : handleSendMessenger}
            className="p-3 bg-gray-50 text-xs text-gray-700 space-y-2.5"
          >
            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-xs leading-relaxed text-[11px] text-gray-600">
              {activeChannel === 'whatsapp'
                ? 'Hi! 👋 How can we help with your trip? Type your query below to start a WhatsApp chat with our travel desk.'
                : 'Hi! 👋 Connect directly with our team on Facebook Messenger for instant answers.'}
            </div>

            <div className="relative">
              <textarea
                rows={2}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Type your message or trip questions..."
                className="w-full p-2.5 bg-white border border-gray-300 focus:border-[#c9a15a] rounded-xl text-xs outline-none resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 min-h-[40px] text-white font-bold text-xs rounded-full shadow-md transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 ${
                activeChannel === 'whatsapp'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-[#0084FF] hover:bg-[#006FDF]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {activeChannel === 'whatsapp' ? 'Send via WhatsApp' : 'Send via Messenger'}
              </span>
            </button>
          </form>
        </div>
      )}

      {/* Stacked Circular Action Buttons (shown on hover/expand) */}
      {open && (
        <div className="flex flex-col items-center gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Messenger Icon Button */}
          {settings.messengerEnabled && (
            <button
              onClick={() => setActiveChannel(activeChannel === 'messenger' ? null : 'messenger')}
              className={`w-10 h-10 rounded-full bg-[#0084FF] hover:bg-[#006FDF] text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 relative group ${
                activeChannel === 'messenger' ? 'ring-2 ring-blue-300 scale-110' : ''
              }`}
              title="Chat on Messenger"
            >
              <MessengerIcon className="w-4 h-4" />
              <span className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Messenger Chat
              </span>
            </button>
          )}

          {/* WhatsApp Icon Button */}
          {settings.whatsappEnabled && (
            <button
              onClick={() => setActiveChannel(activeChannel === 'whatsapp' ? null : 'whatsapp')}
              className={`w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 relative group ${
                activeChannel === 'whatsapp' ? 'ring-2 ring-emerald-300 scale-110' : ''
              }`}
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                WhatsApp Support
              </span>
            </button>
          )}
        </div>
      )}

      {/* Main Trigger Launcher Button (Small size, hover-triggered) */}
      <button
        onClick={() => {
          if (open) {
            setOpen(false);
            setActiveChannel(null);
          } else {
            setOpen(true);
          }
        }}
        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          open
            ? 'bg-[#1a1815] text-white hover:bg-black'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        }`}
        title={open ? 'Close Chat Menu' : 'Chat with Us'}
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#c9a15a] border-2 border-white text-[8px] font-extrabold flex items-center justify-center text-[#1a1815]">
              1
            </span>
          </>
        )}
      </button>
    </div>
  );
}
