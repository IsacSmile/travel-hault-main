'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

function DestinationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [stateOrCountry, setStateOrCountry] = useState('');
  const [categoryBadge, setCategoryBadge] = useState('Heritage & Nature');
  const [heroImage, setHeroImage] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [climate, setClimate] = useState('');
interface AttractionItem {
  name: string;
  image: string;
  description: string;
}

  const [attractions, setAttractions] = useState<AttractionItem[]>([{ name: '', image: '', description: '' }]);

  useEffect(() => {
    if (editId) {
      async function load() {
        try {
          const res = await fetch(`/api/manage/destinations?id=${editId}`);
          if (res.ok) {
            const data = await res.json();
            setName(data.name || '');
            setSlug(data.slug || '');
            setStateOrCountry(data.stateOrCountry || '');
            setCategoryBadge(data.categoryBadge || '');
            setHeroImage(data.heroImage || '');
            setAboutText(data.aboutText || '');
            setBestTimeToVisit(data.bestTimeToVisit || '');
            setClimate(data.climate || '');
            if (data.attractions && data.attractions.length > 0) {
              setAttractions(
                ((data.attractions || []) as AttractionItem[]).map((a) => ({
                  name: a.name || '',
                  image: a.image || '',
                  description: a.description || '',
                }))
              );
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setFetching(false);
        }
      }
      load();
    }
  }, [editId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        id: editId,
        name,
        slug,
        stateOrCountry,
        categoryBadge,
        heroImage,
        aboutText,
        bestTimeToVisit,
        climate,
        attractions: attractions.filter((a) => a.name.trim() !== ''),
      };

      const res = await fetch('/api/manage/destinations', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save destination');
      }

      router.push('/manage/destinations');
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save error';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading destination data...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/manage/destinations"
            className="p-2 bg-white border rounded-xl text-gray-600 hover:text-gray-900 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">
              {editId ? 'Edit Destination' : 'Add Destination'}
            </h1>
            <p className="text-xs text-gray-500">
              Manage destination overview, best time to visit, and top tourist attractions.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#051b2e] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{editId ? 'Update Destination' : 'Save Destination'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3">1. Destination Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Kashmir"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kashmir"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                State / Country *
              </label>
              <input
                type="text"
                required
                value={stateOrCountry}
                onChange={(e) => setStateOrCountry(e.target.value)}
                placeholder="e.g. India or Indonesia"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Category Badge
              </label>
              <input
                type="text"
                value={categoryBadge}
                onChange={(e) => setCategoryBadge(e.target.value)}
                placeholder="e.g. Heritage / Beach / Hills"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              value={heroImage}
              onChange={setHeroImage}
              label="Hero Banner Image"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              About Destination Text
            </label>
            <textarea
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Rich summary story about the history, geography, and travel charm..."
              className="w-full p-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Best Time to Visit
              </label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                placeholder="e.g. April to October (Spring & Summer)"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Climate Overview
              </label>
              <input
                type="text"
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                placeholder="e.g. Pleasant Summers (25°C), Cold Winters (-2°C)"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>
          </div>
        </div>

        {/* Top Attractions List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-gray-900">2. Top Attractions Grid</h2>
            <button
              type="button"
              onClick={() =>
                setAttractions((prev) => [...prev, { name: '', image: '', description: '' }])
              }
              className="px-3.5 py-1.5 bg-[#051b2e] text-[#c9a15a] font-semibold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#0a253e] transition"
            >
              <Plus className="w-4 h-4" /> Add Attraction
            </button>
          </div>

          <div className="space-y-6">
            {attractions.map((att, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border rounded-xl space-y-4 relative">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-[#c9a15a] uppercase">
                    Attraction #{idx + 1}
                  </span>
                  {attractions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setAttractions((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={att.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAttractions((prev) => {
                        const next = [...prev];
                        next[idx].name = val;
                        return next;
                      });
                    }}
                    placeholder="Attraction Name (e.g. Dal Lake Houseboats)"
                    className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-semibold focus:border-[#c9a15a]"
                  />

                  <input
                    type="text"
                    value={att.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAttractions((prev) => {
                        const next = [...prev];
                        next[idx].description = val;
                        return next;
                      });
                    }}
                    placeholder="Short description..."
                    className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:border-[#c9a15a]"
                  />
                </div>

                <ImageUploader
                  value={att.image}
                  onChange={(newUrl) => {
                    setAttractions((prev) => {
                      const next = [...prev];
                      next[idx].image = newUrl;
                      return next;
                    });
                  }}
                  label="Attraction Photo"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function DestinationFormPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading editor...</div>}>
      <DestinationFormContent />
    </Suspense>
  );
}
