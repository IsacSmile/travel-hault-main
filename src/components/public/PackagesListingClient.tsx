'use client';

import React, { useState } from 'react';
import PackageCard from '@/components/public/PackageCard';
import { Search, Filter, Compass, X } from 'lucide-react';

interface PackagesListingClientProps {
  initialPackages: any[];
  themes: any[];
  destinations: any[];
}

export default function PackagesListingClient({
  initialPackages,
  themes,
  destinations,
}: PackagesListingClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');

  const filtered = initialPackages.filter((pkg) => {
    const matchesType = typeFilter === 'All' || pkg.type === typeFilter;
    const matchesTheme =
      selectedTheme === 'All' ||
      pkg.themes?.some((t: any) => t.theme.slug === selectedTheme || t.themeId === selectedTheme);
    const matchesDest =
      selectedDestination === 'All' ||
      pkg.destinations?.some(
        (d: any) => d.destination.slug === selectedDestination || d.destinationId === selectedDestination
      );

    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      pkg.title.toLowerCase().includes(q) ||
      pkg.tripCode.toLowerCase().includes(q) ||
      pkg.shortDescription.toLowerCase().includes(q);

    return matchesType && matchesTheme && matchesDest && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setSelectedTheme('All');
    setSelectedDestination('All');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filters Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search packages by keyword, city..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#c9a15a]"
            >
              <option value="All">All Types (Domestic & Int'l)</option>
              <option value="Domestic">Domestic Only</option>
              <option value="International">International Only</option>
            </select>

            {/* Theme Filter */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#c9a15a]"
            >
              <option value="All">All Trip Themes</option>
              {themes.map((th) => (
                <option key={th.id} value={th.slug}>
                  {th.name}
                </option>
              ))}
            </select>

            {/* Destination Filter */}
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#c9a15a]"
            >
              <option value="All">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name} ({d.stateOrCountry})
                </option>
              ))}
            </select>

            {(searchTerm || typeFilter !== 'All' || selectedTheme !== 'All' || selectedDestination !== 'All') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-200 space-y-3">
          <Compass className="w-12 h-12 mx-auto text-gray-300" />
          <p className="font-bold text-base text-gray-800">No packages match your search filters.</p>
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-[#c9a15a] underline"
          >
            Clear all filters and view all packages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
