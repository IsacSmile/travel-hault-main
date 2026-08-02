'use client';

import React, { useState, useEffect, useRef } from 'react';
import TextCaptcha from '@/components/public/TextCaptcha';
import { isValidEmail } from '@/lib/validation';
import {
  X,
  Send,
  CheckCircle2,
  Compass,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Plus,
  Minus,
  MapPin,
  BedDouble,
  ChevronDown,
  Sparkles,
  Clock,
  Wallet,
  MessageSquare,
} from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageItem?: {
    id?: string;
    title: string;
  } | null;
  defaultType?: string; // "PackageBooking" | "CustomItinerary"
}

const QUICK_DESTINATIONS = [
  'Kashmir & Ladakh',
  'Kerala Backwaters',
  'Rajasthan Heritage',
  'Himachal Pradesh',
  'Goa Beach Holiday',
  'Dubai Luxury',
  'Thailand Escape',
];

export default function EnquiryModal({
  isOpen,
  onClose,
  packageItem,
  defaultType = 'PackageBooking',
}: EnquiryModalProps) {
  const isBooking = defaultType === 'PackageBooking';

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNo, setPhoneNo] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [hotelType, setHotelType] = useState('4 Star (Premium)');
  const [numRooms, setNumRooms] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [destinationsOfInterest, setDestinationsOfInterest] = useState(packageItem?.title || '');
  const [budgetRange, setBudgetRange] = useState('Premium Comfort');
  const [duration, setDuration] = useState('6 to 8 Days');
  const [message, setMessage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [travelerDropdownOpen, setTravelerDropdownOpen] = useState(false);

  const travelerRef = useRef<HTMLDivElement>(null);

  // Synchronize initial destination if packageItem changes
  useEffect(() => {
    if (packageItem?.title) {
      setDestinationsOfInterest(packageItem.title);
    }
  }, [packageItem]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (travelerRef.current && !travelerRef.current.contains(event.target as Node)) {
        setTravelerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submitted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [submitted, countdown]);

  useEffect(() => {
    if (submitted && countdown <= 0) {
      onClose();
      setSubmitted(false);
      // Reset state
      setName('');
      setEmail('');
      setPhoneNo('');
      setArrivalDate('');
      setDepartureDate('');
      setAdults(1);
      setChildren(0);
      setHotelType('4 Star (Premium)');
      setNumRooms(1);
      setPickupLocation('');
      setDropLocation('');
      setDestinationsOfInterest('');
      setBudgetRange('Premium Comfort');
      setDuration('6 to 8 Days');
      setMessage('');
    }
  }, [submitted, countdown, onClose]);

  if (!isOpen) return null;

  // Live trip length calculation
  const getTripDays = () => {
    if (!arrivalDate || !departureDate) return null;
    const arr = new Date(arrivalDate);
    const dep = new Date(departureDate);
    if (isNaN(arr.getTime()) || isNaN(dep.getTime())) return null;
    const diff = dep.getTime() - arr.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  };

  const tripDays = getTripDays();

  // Date Formatting Helper
  const formatDateFriendly = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalTravelers = adults + children;

  const handleQuickDestinationSelect = (destName: string) => {
    if (!destinationsOfInterest) {
      setDestinationsOfInterest(destName);
    } else if (!destinationsOfInterest.includes(destName)) {
      setDestinationsOfInterest(`${destinationsOfInterest}, ${destName}`);
    }
  };

  // Validation & Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Basic Required fields validation
    if (!name.trim()) return setErrorMessage('Full Name is required.');
    if (!email.trim()) return setErrorMessage('Email Address is required.');
    if (!phoneNo.trim()) return setErrorMessage('Phone Number is required.');

    // 2. Strict Email format validation
    if (!isValidEmail(email.trim())) {
      return setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
    }

    // 3. Captcha Security Verification
    if (!captchaInput.trim() || captchaInput.toUpperCase().trim() !== captchaCode.toUpperCase().trim()) {
      setCaptchaError(true);
      return setErrorMessage('Incorrect security captcha code. Please type the characters shown in the image.');
    }
    setCaptchaError(false);

    // 3. Date Validations
    if (isBooking) {
      if (!arrivalDate) return setErrorMessage('Arrival Date is required.');
      if (!departureDate) return setErrorMessage('Departure Date is required.');
      
      const arr = new Date(arrivalDate);
      const dep = new Date(departureDate);
      if (dep <= arr) {
        return setErrorMessage('Departure Date must be at least one day after the Arrival Date.');
      }
    } else {
      // General CustomItinerary preferred date validation
      if (!arrivalDate) return setErrorMessage('Preferred Travel Date is required.');
      if (!destinationsOfInterest.trim()) return setErrorMessage('Please specify your Destinations of Interest.');
    }

    // 4. Travelers check
    if (totalTravelers < 1) {
      return setErrorMessage('At least 1 traveler is required.');
    }

    setLoading(true);

    try {
      const fullPhone = `${countryCode} ${phoneNo.trim()}`;
      const payload = {
        type: defaultType,
        name: name.trim(),
        email: email.trim(),
        phone: fullPhone,
        message: message.trim(),
        packageId: packageItem?.id || null,
        preferredDate: isBooking
          ? `${formatDateFriendly(arrivalDate)} to ${formatDateFriendly(departureDate)}`
          : `${formatDateFriendly(arrivalDate)} (${duration})`,
        arrivalDate: arrivalDate || null,
        departureDate: isBooking ? (departureDate || null) : null,
        numTravelers: `${totalTravelers} Traveler${totalTravelers > 1 ? 's' : ''} (${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''})`,
        hotelType: hotelType,
        numRooms: isBooking ? numRooms : null,
        pickupLocation: isBooking ? pickupLocation.trim() : null,
        dropLocation: isBooking ? dropLocation.trim() : null,
        budgetRange: budgetRange,
        destinationsOfInterest: destinationsOfInterest.trim() || packageItem?.title || 'Custom Itinerary Plan',
      };

      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCountdown(5);
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Submission failed. Please check your fields and try again.');
      }
    } catch (err) {
      console.error('Enquiry client submit error:', err);
      setErrorMessage('A network error occurred. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 sm:rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#051b2e] text-white px-6 py-5 relative shrink-0 flex items-center gap-4 border-b border-[#c9a15a]/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-11 h-11 rounded-2xl bg-[#c9a15a] text-[#051b2e] flex items-center justify-center font-bold shrink-0 shadow-lg">
            {isBooking ? <Compass className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <div className="pr-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c9a15a] block mb-0.5">
              {isBooking ? 'Direct Package Booking Request' : 'Bespoke Tour Customizer'}
            </span>
            <h2 className="text-base sm:text-xl font-bold font-serif line-clamp-1">
              {isBooking
                ? packageItem ? `Book: ${packageItem.title}` : 'Direct Tour Booking'
                : packageItem ? `Customize: ${packageItem.title}` : 'Plan Your Custom Itinerary'}
            </h2>
          </div>
        </div>

        {/* Success View */}
        {submitted ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-5 font-sans">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-serif text-gray-900">Custom Itinerary Received!</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-gray-900">{name}</strong>. Our custom trip architect is building your personalized itinerary for <strong>{destinationsOfInterest || packageItem?.title || 'your trip'}</strong> and will send a custom proposal shortly.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-gray-400">
              Auto-closing in {countdown} seconds...
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-8 py-3 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow-lg transition"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-gray-50/30 font-sans">
            
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 max-h-[calc(100vh-140px)] sm:max-h-[calc(90vh-140px)]">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 2 & 3. Email & Phone (Two column on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                      Phone Number *
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] focus-within:border-[#c9a15a] transition">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-gray-50 border-r border-gray-200 px-3 text-xs font-extrabold text-gray-700 outline-none cursor-pointer focus:bg-gray-100 min-h-[44px]"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+968">🇴🇲 +968</option>
                        <option value="+974">🇶🇦 +974</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value.replace(/[^0-9\s\-]/g, ''))}
                          placeholder="Enter your phone..."
                          className="w-full pl-9 pr-4 py-3 text-sm outline-none border-none min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {!isBooking && (
                  /* Custom Itinerary Specific: Destinations of Interest */
                  <div className="space-y-2 bg-amber-50/40 p-4 rounded-2xl border border-[#c9a15a]/30">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-[#051b2e] tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c9a15a]" /> Destinations of Interest *
                      </label>
                      <input
                        type="text"
                        required
                        value={destinationsOfInterest}
                        onChange={(e) => setDestinationsOfInterest(e.target.value)}
                        placeholder="e.g. Kashmir Valley, Pahalgam, Gulmarg..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5">
                        Quick Add Destinations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_DESTINATIONS.map((dest) => (
                          <button
                            key={dest}
                            type="button"
                            onClick={() => handleQuickDestinationSelect(dest)}
                            className="px-2.5 py-1 bg-white hover:bg-[#051b2e] text-gray-700 hover:text-[#c9a15a] border border-gray-200 rounded-lg text-[11px] font-bold transition shadow-sm active:scale-95"
                          >
                            + {dest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                      {isBooking ? 'Arrival Date *' : 'Preferred Travel Date / Month *'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[#c9a15a]" />
                      <input
                        type="date"
                        required
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                      />
                    </div>
                  </div>

                  {isBooking ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                        Departure Date * {tripDays ? <span className="text-[#c9a15a] font-black">({tripDays} Days)</span> : ''}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[#c9a15a]" />
                        <input
                          type="date"
                          required
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          min={arrivalDate || new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                        Approx Duration
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] appearance-none shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                        >
                          <option value="3 to 5 Days">3 to 5 Days</option>
                          <option value="6 to 8 Days">6 to 8 Days</option>
                          <option value="9 to 12 Days">9 to 12 Days</option>
                          <option value="14+ Days">14+ Days (Extended)</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Travelers Stepper Selector */}
                <div className="space-y-1.5" ref={travelerRef}>
                  <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                    Number of Travelers *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setTravelerDropdownOpen(!travelerDropdownOpen)}
                      className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none text-left flex justify-between items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] hover:border-gray-300 transition min-h-[44px]"
                    >
                      <span>
                        {totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}{' '}
                        <span className="text-gray-400 font-medium">
                          ({adults} Adult{adults > 1 ? 's' : ''}
                          {children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''})
                        </span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${travelerDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {travelerDropdownOpen && (
                      <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
                        {/* Adults Stepper */}
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-bold text-gray-900">Adults</div>
                            <div className="text-xs text-gray-400">Ages 12 or above</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-extrabold w-4 text-center">{adults}</span>
                            <button
                              type="button"
                              onClick={() => setAdults(adults + 1)}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Children Stepper */}
                        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                          <div>
                            <div className="text-sm font-bold text-gray-900">Children</div>
                            <div className="text-xs text-gray-400">Ages 2 to 11</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-extrabold w-4 text-center">{children}</span>
                            <button
                              type="button"
                              onClick={() => setChildren(children + 1)}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hotel Category & Budget Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                      Hotel Category
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <select
                        value={hotelType}
                        onChange={(e) => setHotelType(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] appearance-none shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                      >
                        <option value="3 Star (Standard)">3 Star (Standard)</option>
                        <option value="4 Star (Premium)">4 Star (Premium)</option>
                        <option value="5 Star (Luxury)">5 Star (Luxury)</option>
                        <option value="Boutique / Heritage">Boutique / Heritage</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {!isBooking ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                        Budget Range
                      </label>
                      <div className="relative">
                        <Wallet className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <select
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] appearance-none shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                        >
                          <option value="Standard Value">Standard / Value</option>
                          <option value="Premium Comfort">Premium Comfort</option>
                          <option value="Luxury Experience">Luxury Experience</option>
                          <option value="Flexible Budget">Flexible Budget</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                        Number of Rooms
                      </label>
                      <div className="relative">
                        <BedDouble className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min={1}
                          value={numRooms}
                          onChange={(e) => setNumRooms(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {isBooking && (
                  /* Pickup & Drop Locations for Direct Package Booking */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                        Pickup Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          placeholder="e.g. Airport / Railway Stn"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                        Drop Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={dropLocation}
                          onChange={(e) => setDropLocation(e.target.value)}
                          placeholder="e.g. Airport / Hotel"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Message & Custom Requirements */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Special Requests & Travel Notes
                  </label>
                  <textarea
                    rows={isBooking ? 3 : 4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isBooking
                        ? 'Tell us about special requirements, group discounts, or custom arrangements...'
                        : 'Tell us about flight details, celebration plans (honeymoon, birthday), preferred sightseeing activities, or custom requests...'
                    }
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition resize-y min-h-[75px]"
                  />
                </div>

                {/* Security Captcha Verification */}
                <TextCaptcha
                  value={captchaInput}
                  onChange={setCaptchaInput}
                  onCodeGenerated={setCaptchaCode}
                  error={captchaError}
                />
              </div>
            </div>

            {/* Submit Button Docks */}
            {/* Mobile Sticky Dock */}
            <div className="block sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 p-4 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.04)] z-20">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 min-h-[44px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isBooking ? <Send className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isBooking ? 'Send Booking Request' : 'Request Custom Itinerary Quote'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Desktop Dock */}
            <div className="hidden sm:block p-5 bg-white border-t border-gray-100 shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isBooking ? <Send className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isBooking ? 'Send Booking Request' : 'Request Custom Itinerary Quote'}</span>
                  </>
                )}
              </button>
            </div>
            
          </form>
        )}

      </div>
    </div>
  );
}
