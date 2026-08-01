'use client';

import React, { useState, useEffect, useRef } from 'react';
import PackageCard from '@/components/public/PackageCard';
import { Search, Filter, Compass, X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PackagesListingClientProps {
  initialPackages: any[];
  themes: any[];
  destinations: any[];
  perPage?: number;
}

export default function PackagesListingClient({
  initialPackages,
  themes,
  destinations,
  perPage = 9,
}: PackagesListingClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const gridRef = useRef<HTMLDivElement>(null);

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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * perPage;
  const paginatedPackages = filtered.slice(startIdx, startIdx + perPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, selectedTheme, selectedDestination]);

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    // Scroll to top of grid
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Build page numbers with ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [];
    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, 'ellipsis', totalPages);
    } else if (safeCurrentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, 'ellipsis', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, 'ellipsis', totalPages);
    }
    return pages;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setSelectedTheme('All');
    setSelectedDestination('All');
    setCurrentPage(1);
  };

  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === totalPages;

  return (
    <div className="space-y-8" ref={gridRef}>
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
              <option value="All">All Types (Domestic &amp; Int&apos;l)</option>
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

      {/* Results count */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
          <span>
            Showing {startIdx + 1}–{Math.min(startIdx + perPage, filtered.length)} of {filtered.length} package{filtered.length !== 1 ? 's' : ''}
          </span>
          {totalPages > 1 && (
            <span>Page {safeCurrentPage} of {totalPages}</span>
          )}
        </div>
      )}

      {/* Grid */}
      {paginatedPackages.length === 0 ? (
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
          {paginatedPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}

      {/* ── PAGINATION CONTROLS ── */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4 pb-2">
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1.5 shadow-sm">
            {/* First page << */}
            <button
              onClick={() => goToPage(1)}
              disabled={isFirstPage}
              className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                isFirstPage
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#051b2e] active:scale-95'
              }`}
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous page < */}
            <button
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={isFirstPage}
              className={`flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                isFirstPage
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#051b2e] active:scale-95'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-0.5">
              {getPageNumbers().map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-medium select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                      page === safeCurrentPage
                        ? 'bg-[#051b2e] text-white shadow-md scale-105'
                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#051b2e] active:scale-95'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={page === safeCurrentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next page > */}
            <button
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={isLastPage}
              className={`flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                isLastPage
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#051b2e] active:scale-95'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last page >> */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={isLastPage}
              className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                isLastPage
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#051b2e] active:scale-95'
              }`}
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
