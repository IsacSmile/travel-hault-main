'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  stateOrCountry: string;
  categoryBadge: string;
  heroImage: string;
  aboutText?: string;
  attractions?: Array<{ id: string }>;
}

export default function DestinationsListPage() {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/manage/destinations');
        if (res.ok && active) {
          setDestinations(await res.json());
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
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/manage/destinations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = destinations.filter((d) => {
    const search = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(search) ||
      d.stateOrCountry.toLowerCase().includes(search) ||
      d.slug.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Destinations Manager</h1>
          <p className="text-sm text-gray-500">Manage featured travel locations, travel guides, and top attractions lists.</p>
        </div>
        <Link
          href="/manage/destinations/form"
          className="px-5 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search destination name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
          />
        </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">
          <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading destinations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border">
          <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="font-medium text-sm">No destinations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#051b2e]/90 text-[#c9a15a] text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {item.categoryBadge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-serif text-gray-900">{item.name}</h3>
                    <span className="text-xs font-semibold text-gray-500">{item.stateOrCountry}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.aboutText}</p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {item.attractions?.length || 0} Attractions Listed
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/destinations/${item.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/manage/destinations/form?id=${item.id}`}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Destination"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
