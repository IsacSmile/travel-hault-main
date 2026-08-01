'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, Package, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ packages: any[]; destinations: any[] }>({
    packages: [],
    destinations: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ packages: [], destinations: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [pRes, dRes] = await Promise.all([
          fetch('/api/manage/packages'),
          fetch('/api/manage/destinations'),
        ]);

        const packages = pRes.ok ? await pRes.json() : [];
        const destinations = dRes.ok ? await dRes.json() : [];

        const q = query.toLowerCase();

        const filteredPackages = packages.filter(
          (p: any) =>
            p.title.toLowerCase().includes(q) ||
            p.tripCode.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q)
        );

        const filteredDestinations = destinations.filter(
          (d: any) =>
            d.name.toLowerCase().includes(q) ||
            d.stateOrCountry.toLowerCase().includes(q) ||
            d.aboutText.toLowerCase().includes(q)
        );

        setResults({ packages: filteredPackages, destinations: filteredDestinations });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
          <Search className="w-5 h-5 text-[#c9a15a] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kashmir, Bali, Honeymoon, Luxury tours..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 font-medium text-base outline-none"
          />
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {loading && (
            <div className="p-6 text-center text-xs text-gray-500">Searching destinations & packages...</div>
          )}

          {!loading && query && results.packages.length === 0 && results.destinations.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No results found matching "<span className="font-semibold text-gray-900">{query}</span>".
            </div>
          )}

          {/* Destinations Results */}
          {results.destinations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#c9a15a]" /> Destinations ({results.destinations.length})
              </h4>
              <div className="space-y-2">
                {results.destinations.slice(0, 4).map((d) => (
                  <Link
                    key={d.id}
                    href={`/destinations/${d.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.heroImage} alt={d.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{d.name}</div>
                        <div className="text-xs text-gray-400">{d.stateOrCountry} • {d.categoryBadge}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#c9a15a] transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Packages Results */}
          {results.packages.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#c9a15a]" /> Tour Packages ({results.packages.length})
              </h4>
              <div className="space-y-2">
                {results.packages.slice(0, 5).map((p) => {
                  const imgs = JSON.parse(p.imagesJson || '[]');
                  return (
                    <Link
                      key={p.id}
                      href={`/packages/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgs[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm line-clamp-1">{p.title}</div>
                          <div className="text-xs text-gray-400">{p.type} • {p.tripCode}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#c9a15a] transition" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
