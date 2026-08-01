'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Filter, Edit, Trash2, Star, Eye } from 'lucide-react';

interface PackageItem {
  id: string;
  title: string;
  tripCode: string;
  type: string;
  slug: string;
  price?: string;
  featured?: boolean;
}

export default function PackagesListPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/manage/packages');
        if (res.ok && active) {
          const data = await res.json();
          setPackages(data);
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/manage/packages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesType = typeFilter === 'All' || pkg.type === typeFilter;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      pkg.title.toLowerCase().includes(search) ||
      pkg.tripCode.toLowerCase().includes(search) ||
      pkg.slug.toLowerCase().includes(search);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Packages Manager</h1>
          <p className="text-sm text-gray-500">Create, edit, and organize tour packages and multi-duration itineraries.</p>
        </div>
        <Link
          href="/manage/packages/form"
          className="px-5 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Package
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, trip code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
            <Filter className="w-4 h-4" /> Type Filter:
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:border-[#c9a15a]"
          >
            <option value="All">All Types</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading tour packages...
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-sm">No packages found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Package</th>
                  <th className="px-6 py-3.5">Trip Code</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Variants</th>
                  <th className="px-6 py-3.5">Featured</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPackages.map((pkg) => {
                  const images = JSON.parse(pkg.imagesJson || '[]');
                  const thumb = images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';

                  return (
                    <tr key={pkg.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb}
                            alt={pkg.title}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">{pkg.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">/{pkg.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-700 font-semibold">
                        {pkg.tripCode}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            pkg.type === 'Domestic'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {pkg.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">
                        {pkg.variants?.length || 0} Durations
                      </td>
                      <td className="px-6 py-4">
                        {pkg.featured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          className="inline-flex p-1.5 text-gray-400 hover:text-gray-600 transition"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/manage/packages/form?id=${pkg.id}`}
                          className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Package"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(pkg.id, pkg.title)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
