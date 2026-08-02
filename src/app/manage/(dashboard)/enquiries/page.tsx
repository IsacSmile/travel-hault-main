'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Inbox,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  User,
  Mail,
  Phone,
  Package as PackageIcon,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface EnquiryItem {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: string;
  createdAt: string;
  internalNotes?: string;
  numTravelers?: string;
  budgetRange?: string;
  preferredDate?: string;
  arrivalDate?: string | null;
  departureDate?: string | null;
  hotelType?: string | null;
  numRooms?: number | null;
  pickupLocation?: string | null;
  dropLocation?: string | null;
  destinationsOfInterest?: string;
  package?: {
    id: string;
    title: string;
    tripCode: string;
  } | null;
}

/** RFC-4180 safe field — wraps in quotes and escapes inner quotes & newlines */
const csvField = (val: unknown): string => {
  const str = val == null ? '' : String(val);
  // Always wrap in quotes so commas/newlines inside values don't break Excel
  return `"${str.replace(/"/g, '""')}"`;
};

const todayDate = () => new Date().toISOString().slice(0, 10);

const downloadCSV = (rows: string[][], filename: string) => {
  const csv = rows.map((r) => r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPackageBookingsCSV = (dataList: EnquiryItem[]) => {
  if (dataList.length === 0) return;
  const headers = [
    'Full Name',
    'Email',
    'Phone',
    'Package Reference',
    'Arrival Date',
    'Departure Date',
    'Trip Length',
    'Traveler Count',
    'Hotel Type / Category',
    'Number of Rooms',
    'Pickup Location',
    'Drop Location',
    'Additional Message',
    'Submitted Date/Time',
    'Status',
  ];

  const rows: string[][] = [headers.map(csvField)];
  for (const e of dataList) {
    const arrivalDate = e.arrivalDate ? new Date(e.arrivalDate) : null;
    const departureDate = e.departureDate ? new Date(e.departureDate) : null;
    let tripLength = '';
    if (arrivalDate && departureDate && !isNaN(arrivalDate.getTime()) && !isNaN(departureDate.getTime())) {
      const days = Math.round((departureDate.getTime() - arrivalDate.getTime()) / 86400000);
      tripLength = days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : '';
    }

    rows.push([
      csvField(e.name),
      csvField(e.email),
      csvField(e.phone),
      csvField(e.package ? `${e.package.title} (${e.package.tripCode})` : e.destinationsOfInterest || ''),
      csvField(e.arrivalDate || e.preferredDate || ''),
      csvField(e.departureDate || ''),
      csvField(tripLength),
      csvField(e.numTravelers || ''),
      csvField(e.hotelType || ''),
      csvField(e.numRooms || ''),
      csvField(e.pickupLocation || ''),
      csvField(e.dropLocation || ''),
      csvField(e.message || ''),
      csvField(new Date(e.createdAt).toLocaleString()),
      csvField(e.status),
    ]);
  }

  downloadCSV(rows, `package-bookings-${todayDate()}.csv`);
};

const exportCustomItineraryCSV = (dataList: EnquiryItem[]) => {
  if (dataList.length === 0) return;
  const headers = [
    'Full Name',
    'Email',
    'Phone',
    'Message',
    'Submitted Date/Time',
    'Status',
  ];

  const rows: string[][] = [headers.map(csvField)];
  for (const e of dataList) {
    rows.push([
      csvField(e.name),
      csvField(e.email),
      csvField(e.phone),
      csvField(e.message || ''),
      csvField(new Date(e.createdAt).toLocaleString()),
      csvField(e.status),
    ]);
  }

  downloadCSV(rows, `custom-itinerary-requests-${todayDate()}.csv`);
};

const handleExport = (dataList: EnquiryItem[], typeFilter: string) => {
  if (typeFilter === 'PackageBooking') {
    exportPackageBookingsCSV(dataList);
  } else if (typeFilter === 'CustomItinerary' || typeFilter === 'Contact') {
    exportCustomItineraryCSV(dataList);
  } else {
    const bookings = dataList.filter((e) => e.type === 'PackageBooking');
    const custom = dataList.filter((e) => e.type !== 'PackageBooking');
    if (bookings.length > 0) exportPackageBookingsCSV(bookings);
    if (custom.length > 0) exportCustomItineraryCSV(custom);
  }
};


function EnquiriesInboxContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [internalNotesInput, setInternalNotesInput] = useState('');



  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/manage/enquiries');
        if (res.ok && active) {
          const data = await res.json() as EnquiryItem[];
          setEnquiries(data);
          if (highlightedId) {
            const match = data.find((e) => e.id === highlightedId);
            if (match) {
              setSelectedEnquiry(match);
              setInternalNotesInput(match.internalNotes || '');
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [highlightedId]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/manage/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await fetch('/api/manage/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedEnquiry.id, internalNotes: internalNotesInput }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEnquiries((prev) => prev.map((e) => (e.id === selectedEnquiry.id ? updated : e)));
        setSelectedEnquiry(updated);
        alert('Notes updated!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/manage/enquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (e) {
      console.error(e);
    }
  };



  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phone.toLowerCase().includes(search) ||
      (item.package?.title && item.package.title.toLowerCase().includes(search));
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Enquiries & Leads Inbox</h1>
          <p className="text-sm text-gray-500">Track and follow up on customer trip bookings and itinerary requests.</p>
        </div>

        <button
          onClick={() => handleExport(filteredEnquiries, typeFilter)}
          className="px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl text-sm transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-[#c9a15a]" /> Export to CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
            <Filter className="w-4 h-4" /> Filters:
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:border-[#c9a15a]"
          >
            <option value="All">All Lead Types</option>
            <option value="PackageBooking">Package Booking</option>
            <option value="CustomItinerary">Custom Itinerary</option>
            <option value="Contact">Contact Form</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:border-[#c9a15a]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Inbox Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading enquiries...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-sm">No enquiries found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Trip Interest</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Submitted</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50/80 transition cursor-pointer ${
                      selectedEnquiry?.id === item.id ? 'bg-[#c9a15a]/10 font-medium' : ''
                    }`}
                    onClick={() => {
                      setSelectedEnquiry(item);
                      setInternalNotesInput(item.internalNotes || '');
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.phone} • {item.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.package ? (
                        <span className="font-medium text-[#051b2e]">{item.package.title}</span>
                      ) : item.destinationsOfInterest ? (
                        <span>{item.destinationsOfInterest}</span>
                      ) : (
                        <span className="text-gray-400">General Enquiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'New'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.status === 'New' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {item.status === 'Contacted' && <Clock className="w-3 h-3 text-blue-600" />}
                        {item.status === 'Closed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Drawer Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 bg-[#051b2e] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#c9a15a] uppercase tracking-widest block">
                  Enquiry Details
                </span>
                <h2 className="text-xl font-bold font-serif mt-0.5">{selectedEnquiry.name}</h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-gray-400 hover:text-white rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Quick Actions / Status Toggle */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <label className="text-xs font-semibold uppercase text-gray-500 block">
                  Lead Status Workflow
                </label>
                <div className="flex gap-2">
                  {['New', 'Contacted', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                        selectedEnquiry.status === st
                          ? st === 'New'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : st === 'Contacted'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-4 h-4 text-[#c9a15a]" />
                    <span className="font-semibold">{selectedEnquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-[#c9a15a]" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-[#c9a15a]" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.phone}
                    </a>
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-md hover:bg-emerald-200"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Requested Trip Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Requested Trip Details</h3>
                {selectedEnquiry.package ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                    <PackageIcon className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-blue-900">{selectedEnquiry.package.title}</div>
                      <div className="text-xs text-blue-700">Code: {selectedEnquiry.package.tripCode}</div>
                    </div>
                  </div>
                ) : selectedEnquiry.destinationsOfInterest ? (
                  <div className="text-sm text-gray-700">
                    <strong>Destinations:</strong> {selectedEnquiry.destinationsOfInterest}
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedEnquiry.preferredDate && !selectedEnquiry.arrivalDate && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Preferred Date</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.preferredDate}</span>
                    </div>
                  )}
                  {selectedEnquiry.arrivalDate && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Arrival Date</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.arrivalDate}</span>
                    </div>
                  )}
                  {selectedEnquiry.departureDate && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Departure Date</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.departureDate}</span>
                    </div>
                  )}
                  {selectedEnquiry.numTravelers && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Travelers Count</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.numTravelers}</span>
                    </div>
                  )}
                  {selectedEnquiry.hotelType && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Hotel Preference</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.hotelType}</span>
                    </div>
                  )}
                  {selectedEnquiry.numRooms && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Rooms Requested</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.numRooms} Room{selectedEnquiry.numRooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {selectedEnquiry.pickupLocation && (
                    <div className="bg-gray-50 p-3 rounded-lg border col-span-2">
                      <span className="text-gray-400 block">Pickup Location</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.pickupLocation}</span>
                    </div>
                  )}
                  {selectedEnquiry.dropLocation && (
                    <div className="bg-gray-50 p-3 rounded-lg border col-span-2">
                      <span className="text-gray-400 block">Drop Location</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.dropLocation}</span>
                    </div>
                  )}
                  {selectedEnquiry.budgetRange && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-400 block">Budget Range</span>
                      <span className="font-semibold text-gray-900">{selectedEnquiry.budgetRange}</span>
                    </div>
                  )}
                </div>

                {selectedEnquiry.message && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                      Customer Message
                    </span>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Internal Staff Notes</h3>
                <textarea
                  rows={3}
                  value={internalNotesInput}
                  onChange={(e) => setInternalNotesInput(e.target.value)}
                  placeholder="Add private staff notes..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
                />
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-2 bg-[#051b2e] hover:bg-[#0a253e] text-white text-xs font-bold rounded-xl transition"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnquiriesInboxPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading inbox...</div>}>
      <EnquiriesInboxContent />
    </Suspense>
  );
}
