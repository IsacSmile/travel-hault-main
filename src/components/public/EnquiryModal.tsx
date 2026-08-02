'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [hotelType, setHotelType] = useState('3 Star (Standard)');
  const [numRooms, setNumRooms] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [message, setMessage] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [travelerDropdownOpen, setTravelerDropdownOpen] = useState(false);

  const travelerRef = useRef<HTMLDivElement>(null);

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
      setHotelType('3 Star (Standard)');
      setNumRooms(1);
      setPickupLocation('');
      setDropLocation('');
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

  // Validation & Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Basic Required fields validation
    if (!name.trim()) return setErrorMessage('Full Name is required.');
    if (!email.trim()) return setErrorMessage('Email Address is required.');
    if (!phoneNo.trim()) return setErrorMessage('Phone Number is required.');

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setErrorMessage('Please enter a valid email address.');
    }

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
        // Map fields correctly to DB
        preferredDate: isBooking ? `${formatDateFriendly(arrivalDate)} to ${formatDateFriendly(departureDate)}` : formatDateFriendly(arrivalDate),
        arrivalDate: arrivalDate || null,
        departureDate: departureDate || null,
        numTravelers: `${totalTravelers} Traveler${totalTravelers > 1 ? 's' : ''} (${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''})`,
        hotelType: isBooking ? hotelType : null,
        numRooms: isBooking ? numRooms : null,
        pickupLocation: isBooking ? pickupLocation.trim() : null,
        dropLocation: isBooking ? dropLocation.trim() : null,
        destinationsOfInterest: packageItem?.title || 'Custom Plan',
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
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 sm:rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#051b2e] text-white px-6 py-5 relative shrink-0 flex items-center gap-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-[#c9a15a] text-[#051b2e] flex items-center justify-center font-bold shrink-0 shadow-inner">
            <Compass className="w-5.5 h-5.5" />
          </div>
          <div className="pr-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c9a15a] block mb-0.5">
              {isBooking ? 'Direct Package Booking Request' : 'Custom Tour Customizer'}
            </span>
            <h2 className="text-base sm:text-lg font-bold font-serif line-clamp-1">
              {packageItem ? `Book: ${packageItem.title}` : 'Plan Your Custom Itinerary'}
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
              <h3 className="text-2xl font-bold font-serif text-gray-900">Enquiry Received!</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-gray-900">{name}</strong>. Our travel coordinator has received your request for <strong>{packageItem?.title || 'your trip'}</strong> and will call you back shortly with a custom quote.
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
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
            
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

                {/* 4 & 5. Arrival & Departure Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                      {isBooking ? 'Arrival Date *' : 'Preferred Travel Date *'}
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
                      <select
                        value={hotelType} // Reused local state for general enquiries if custom itinerary
                        onChange={(e) => setHotelType(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px]"
                      >
                        <option value="1-3 Days">1 to 3 Days</option>
                        <option value="4-7 Days">4 to 7 Days</option>
                        <option value="8-14 Days">8 to 14 Days</option>
                        <option value="15+ Days">15+ Days</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 6. Travelers Stepper Selector */}
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

                {isBooking && (
                  <>
                    {/* 7 & 8. Hotel Category & Rooms */}
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
                            <option value="Budget">Budget / Standard</option>
                            <option value="3 Star (Standard)">3 Star (Standard)</option>
                            <option value="4 Star (Premium)">4 Star (Premium)</option>
                            <option value="5 Star (Luxury)">5 Star (Luxury)</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

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
                    </div>

                    {/* 9 & 10. Pickup & Drop Locations */}
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
                  </>
                )}

                {/* 11. Custom message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider">
                    Additional Message & Special Requests
                  </label>
                  <textarea
                    rows={isBooking ? 3 : 4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about special requirements, group discounts, customized extensions, or arrangements..."
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c9a15a] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition resize-y min-h-[70px]"
                  />
                </div>
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
                    <Send className="w-4 h-4" /> Send Booking Enquiry
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
                    <Send className="w-4 h-4" /> Send Booking Enquiry
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
