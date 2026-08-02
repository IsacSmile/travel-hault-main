'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import TextCaptcha from '@/components/public/TextCaptcha';
import { isValidEmail } from '@/lib/validation';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidEmail(email.trim())) {
      return setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
    }

    if (!captchaInput.trim() || captchaInput.toUpperCase().trim() !== captchaCode.toUpperCase().trim()) {
      setCaptchaError(true);
      return setErrorMessage('Incorrect security captcha code. Please type the characters shown in the image.');
    }
    setCaptchaError(false);

    setLoading(true);

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

    try {
      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: subject,
          name,
          email,
          phone: fullPhone,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-serif font-bold text-2xl text-gray-900">Message Sent!</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-gray-900">{name}</strong>. We have received your inquiry. Our travel desk will contact you at <strong className="text-gray-900">{countryCode} {phoneNumber}</strong> shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setPhoneNumber('');
            setMessage('');
          }}
          className="px-6 py-3 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#051b2e]">
          Send Us a Message
        </h2>
        <p className="text-xs text-gray-400 font-semibold uppercase mt-0.5 tracking-wider">
          Our travel advisors reply within 24 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ananya Sharma"
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#b8934b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition duration-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@example.com"
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#b8934b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">
              Phone / WhatsApp Number *
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#b8934b] font-semibold text-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+62">+62 (ID)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+966">+966 (SA)</option>
              </select>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#b8934b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">
              Enquiry Type *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#b8934b] font-medium text-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition duration-200"
            >
              <option value="General Enquiry">General Enquiry</option>
              <option value="Package Booking">Package Booking</option>
              <option value="Custom Itinerary Request">Custom Itinerary Request</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">
            Your Message *
          </label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about expected dates, number of travelers, budget per person, or hotel preferences..."
            className="w-full p-4 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#b8934b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition duration-200 resize-none"
          />
        </div>

        {/* Captcha Verification */}
        <TextCaptcha
          value={captchaInput}
          onChange={setCaptchaInput}
          onCodeGenerated={setCaptchaCode}
          error={captchaError}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
