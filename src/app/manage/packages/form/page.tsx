'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function PackageFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);

  // Available Destinations & Themes for selector
  const [availableThemes, setAvailableThemes] = useState<any[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Domestic');
  const [tripCode, setTripCode] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [destinationsCount, setDestinationsCount] = useState(1);
  const [groupSizeMax, setGroupSizeMax] = useState(12);
  const [groupSizeAvg, setGroupSizeAvg] = useState(6);
  const [tourStyle, setTourStyle] = useState('Guided Tour');
  const [accommodationType, setAccommodationType] = useState('4 Star / Boutique');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [inclusions, setInclusions] = useState<string[]>(['']);
  const [exclusions, setExclusions] = useState<string[]>(['']);
  const [importantNotes, setImportantNotes] = useState<string[]>(['']);
  const [featured, setFeatured] = useState(false);
  const [price, setPrice] = useState<string | number>('');
  const [originalPrice, setOriginalPrice] = useState<string | number>('');
  const [priceUnit, setPriceUnit] = useState('per person');
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);

  // Variants & Itinerary State
  const [variants, setVariants] = useState<
    {
      id?: string;
      label: string;
      subtitle: string;
      slug: string;
      price: string | number;
      originalPrice: string | number;
      priceUnit: string;
      itineraryDays: { dayNumber: number; title: string; description: string; images: string[] }[];
    }[]
  >([
    {
      label: '4 Nights / 5 Days',
      subtitle: 'Standard Package',
      slug: '4n-5d',
      price: '',
      originalPrice: '',
      priceUnit: 'per person',
      itineraryDays: [
        { dayNumber: 1, title: 'Day 1 Arrival', description: 'Arrival and check in.', images: [] },
      ],
    },
  ]);

  // Load Themes & Destinations & Edit Data
  useEffect(() => {
    async function init() {
      try {
        const [tRes, dRes] = await Promise.all([
          fetch('/api/manage/trip-themes'),
          fetch('/api/manage/destinations'),
        ]);
        if (tRes.ok) setAvailableThemes(await tRes.json());
        if (dRes.ok) setAvailableDestinations(await dRes.json());

        if (editId) {
          const pRes = await fetch(`/api/manage/packages?id=${editId}`);
          if (pRes.ok) {
            const data = await pRes.json();
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setType(data.type || 'Domestic');
            setTripCode(data.tripCode || '');
            setShortDescription(data.shortDescription || '');
            setLongDescription(data.longDescription || '');
            setImages(JSON.parse(data.imagesJson || '[]'));
            setDestinationsCount(data.destinationsCount || 1);
            setGroupSizeMax(data.groupSizeMax || 12);
            setGroupSizeAvg(data.groupSizeAvg || 6);
            setTourStyle(data.tourStyle || '');
            setAccommodationType(data.accommodationType || '');
            setHighlights(JSON.parse(data.highlightsJson || '[]'));
            setInclusions(JSON.parse(data.inclusionsJson || '[]'));
            setExclusions(JSON.parse(data.exclusionsJson || '[]'));
            setImportantNotes(JSON.parse(data.importantNotesJson || '[]'));
            setFeatured(data.featured || false);
            setPrice(data.price !== undefined ? data.price : '');
            setOriginalPrice(data.originalPrice !== undefined && data.originalPrice !== null ? data.originalPrice : '');
            setPriceUnit(data.priceUnit || 'per person');
            setSelectedThemeIds((data.themes || []).map((t: any) => t.themeId));
            setSelectedDestinationIds((data.destinations || []).map((d: any) => d.destinationId));

            if (data.variants && data.variants.length > 0) {
              setVariants(
                data.variants.map((v: any) => ({
                  id: v.id,
                  label: v.label || '',
                  subtitle: v.subtitle || '',
                  slug: v.slug || '',
                  price: v.price !== undefined ? v.price : '',
                  originalPrice: v.originalPrice !== undefined && v.originalPrice !== null ? v.originalPrice : '',
                  priceUnit: v.priceUnit || 'per person',
                  itineraryDays: (v.itineraryDays || []).map((day: any) => ({
                    dayNumber: day.dayNumber,
                    title: day.title || '',
                    description: day.description || '',
                    images: JSON.parse(day.imagesJson || '[]'),
                  })),
                }))
              );
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    }

    init();
  }, [editId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleAddListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, '']);
  };

  const handleUpdateListItem = (
    index: number,
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveListItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        id: editId,
        title,
        slug,
        type,
        tripCode: tripCode || `TH-${slug.slice(0, 4).toUpperCase()}-01`,
        shortDescription,
        longDescription,
        images,
        destinationsCount: Number(destinationsCount),
        groupSizeMax: Number(groupSizeMax),
        groupSizeAvg: Number(groupSizeAvg),
        tourStyle,
        accommodationType,
        highlights: highlights.filter((h) => h.trim() !== ''),
        inclusions: inclusions.filter((i) => i.trim() !== ''),
        exclusions: exclusions.filter((e) => e.trim() !== ''),
        importantNotes: importantNotes.filter((n) => n.trim() !== ''),
        featured,
        price: price ? Number(price) : 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        priceUnit,
        themeIds: selectedThemeIds,
        destinationIds: selectedDestinationIds,
        variants: variants.map((v) => ({
          ...v,
          price: v.price ? Number(v.price) : 0,
          originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
        })),
      };

      const res = await fetch('/api/manage/packages', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save package');
      }

      router.push('/manage/packages');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Save error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading package data...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/manage/packages"
            className="p-2 bg-white border rounded-xl text-gray-600 hover:text-gray-900 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">
              {editId ? 'Edit Package' : 'Create New Package'}
            </h1>
            <p className="text-xs text-gray-500">
              Set package specs, photos, duration variants, and day-by-day itineraries.
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
          <span>{editId ? 'Update Package' : 'Save Package'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Overview & General Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Package Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Magical Kashmir: Lakes, Meadows & Snow Peaks"
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
                placeholder="magical-kashmir-paradise"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Trip Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold focus:outline-none focus:border-[#c9a15a]"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Trip Code
              </label>
              <input
                type="text"
                value={tripCode}
                onChange={(e) => setTripCode(e.target.value)}
                placeholder="TH-KAS-01"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Default Price (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 24999"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Original Price (₹) (Optional - Struck through)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. 29999"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Price Unit
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold focus:outline-none focus:border-[#c9a15a]"
              >
                <option value="per person">per person</option>
                <option value="per couple">per couple</option>
                <option value="per group">per group</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Short Description (Card Subtitle)
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-2 sentence overview shown on package cards..."
              className="w-full p-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Long Overview Story
            </label>
            <textarea
              rows={4}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Detailed introduction story displayed on the package detail page..."
              className="w-full p-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featuredCheck"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 accent-[#c9a15a] rounded"
            />
            <label htmlFor="featuredCheck" className="text-sm font-semibold text-gray-800 cursor-pointer">
              Feature on Homepage "Explore Trips" section
            </label>
          </div>
        </div>

        {/* Section 2: Image Gallery */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            2. Photo Gallery
          </h2>

          <div className="space-y-4">
            <ImageUploader
              value=""
              onChange={(newUrl) => {
                if (newUrl) setImages((prev) => [...prev, newUrl]);
              }}
              label="Add Photo to Gallery"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 h-28 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-[#051b2e] text-[#c9a15a] text-[10px] font-bold px-2 py-0.5 rounded">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Specs & Categorization */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3">
            3. Quick Stats & Tags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Tour Style
              </label>
              <input
                type="text"
                value={tourStyle}
                onChange={(e) => setTourStyle(e.target.value)}
                placeholder="e.g. Guided Luxury / Private"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Accommodation Type
              </label>
              <input
                type="text"
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                placeholder="e.g. 4 Star / Boutique Villa"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Max Group Size
              </label>
              <input
                type="number"
                value={groupSizeMax}
                onChange={(e) => setGroupSizeMax(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
              />
            </div>
          </div>

          {/* Themes Checkboxes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">
              Trip Themes (Tag categories)
            </label>
            <div className="flex flex-wrap gap-3">
              {availableThemes.map((th) => {
                const isSelected = selectedThemeIds.includes(th.id);
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedThemeIds((prev) => prev.filter((id) => id !== th.id));
                      } else {
                        setSelectedThemeIds((prev) => [...prev, th.id]);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#051b2e] text-[#c9a15a] border-[#051b2e]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#c9a15a]" />}
                    {th.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destinations Checkboxes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">
              Destinations Covered in Route
            </label>
            <div className="flex flex-wrap gap-3">
              {availableDestinations.map((d) => {
                const isSelected = selectedDestinationIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDestinationIds((prev) => prev.filter((id) => id !== d.id));
                      } else {
                        setSelectedDestinationIds((prev) => [...prev, d.id]);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    {d.name} ({d.stateOrCountry})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Highlights, Inclusions, Exclusions, Important Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Highlights */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">Tour Highlights</h3>
              <button
                type="button"
                onClick={() => handleAddListItem(setHighlights)}
                className="text-xs font-semibold text-[#c9a15a] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bullet
              </button>
            </div>
            {highlights.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateListItem(idx, e.target.value, setHighlights)}
                  placeholder="e.g. Sunset Shikara Ride on Dal Lake"
                  className="flex-1 px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:border-[#c9a15a]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveListItem(idx, setHighlights)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Inclusions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">What's Included</h3>
              <button
                type="button"
                onClick={() => handleAddListItem(setInclusions)}
                className="text-xs font-semibold text-[#c9a15a] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bullet
              </button>
            </div>
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateListItem(idx, e.target.value, setInclusions)}
                  placeholder="e.g. Daily breakfast & dinner"
                  className="flex-1 px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:border-[#c9a15a]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveListItem(idx, setInclusions)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Exclusions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">Exclusions</h3>
              <button
                type="button"
                onClick={() => handleAddListItem(setExclusions)}
                className="text-xs font-semibold text-[#c9a15a] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bullet
              </button>
            </div>
            {exclusions.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateListItem(idx, e.target.value, setExclusions)}
                  placeholder="e.g. International airfare"
                  className="flex-1 px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:border-[#c9a15a]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveListItem(idx, setExclusions)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Important Notes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">Important Notes</h3>
              <button
                type="button"
                onClick={() => handleAddListItem(setImportantNotes)}
                className="text-xs font-semibold text-[#c9a15a] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bullet
              </button>
            </div>
            {importantNotes.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateListItem(idx, e.target.value, setImportantNotes)}
                  placeholder="e.g. Valid Photo ID required"
                  className="flex-1 px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:border-[#c9a15a]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveListItem(idx, setImportantNotes)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Duration Variants & Day-by-Day Itineraries Builder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                5. Duration Variants & Day-by-Day Itinerary Builder
              </h2>
              <p className="text-xs text-gray-500">
                Add tour durations (e.g. 4N/5D vs 6N/7D) each with its own reorderable day-by-day plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setVariants((prev) => [
                  ...prev,
                  {
                    label: '6 Nights / 7 Days',
                    subtitle: 'Extended Explorer',
                    slug: `variant-${prev.length + 1}`,
                    price: '',
                    originalPrice: '',
                    priceUnit: 'per person',
                    itineraryDays: [
                      { dayNumber: 1, title: 'Day 1 Arrival', description: 'Arrival', images: [] },
                    ],
                  },
                ]);
              }}
              className="px-3.5 py-1.5 bg-[#051b2e] text-[#c9a15a] font-semibold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#0a253e] transition"
            >
              <Plus className="w-4 h-4" /> Add Duration Option
            </button>
          </div>

          <div className="space-y-8">
            {variants.map((variant, vIdx) => (
              <div
                key={vIdx}
                className="p-5 border-2 border-gray-200 rounded-2xl bg-gray-50/50 space-y-6 relative"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#c9a15a] text-[#051b2e] font-bold text-xs flex items-center justify-center">
                      Option {vIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => {
                          const next = [...prev];
                          next[vIdx].label = val;
                          return next;
                        });
                      }}
                      placeholder="Duration Label (e.g. 4 Nights / 5 Days)"
                      className="px-3 py-1.5 bg-white border rounded-xl text-sm font-bold text-gray-900 focus:border-[#c9a15a]"
                    />
                  </div>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.filter((_, i) => i !== vIdx))}
                      className="text-xs text-[#dc2626] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Option
                    </button>
                  )}
                </div>

                {/* Variant Specs & Pricing Row */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-white p-4 rounded-xl border border-gray-200/60 shadow-2xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Subtitle</label>
                    <input
                      type="text"
                      value={variant.subtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => {
                          const next = [...prev];
                          next[vIdx].subtitle = val;
                          return next;
                        });
                      }}
                      placeholder="Standard Plan"
                      className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Slug Override</label>
                    <input
                      type="text"
                      value={variant.slug}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => {
                          const next = [...prev];
                          next[vIdx].slug = val;
                          return next;
                        });
                      }}
                      placeholder="e.g. 4n-5d"
                      className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={variant.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => {
                          const next = [...prev];
                          next[vIdx].price = val;
                          return next;
                        });
                      }}
                      placeholder="e.g. 24999"
                      className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Original Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={variant.originalPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => {
                          const next = [...prev];
                          next[vIdx].originalPrice = val;
                          return next;
                        });
                      }}
                      placeholder="e.g. 29999"
                      className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Price Unit</label>
                    <select
                      value={variant.priceUnit}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => {
                          const next = [...prev];
                          next[vIdx].priceUnit = val;
                          return next;
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      <option value="per person">per person</option>
                      <option value="per couple">per couple</option>
                      <option value="per group">per group</option>
                    </select>
                  </div>
                </div>

                {/* Day by Day Items */}
                <div className="space-y-4 pl-4 border-l-2 border-[#c9a15a]/30">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Itinerary Days Schedule
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setVariants((prev) => {
                          const next = [...prev];
                          const days = next[vIdx].itineraryDays;
                          days.push({
                            dayNumber: days.length + 1,
                            title: `Day ${days.length + 1} Title`,
                            description: '',
                            images: [],
                          });
                          return next;
                        });
                      }}
                      className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Day {variant.itineraryDays.length + 1}
                    </button>
                  </div>

                  {variant.itineraryDays.map((day, dIdx) => (
                    <div key={dIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c9a15a] uppercase">
                          Day {day.dayNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setVariants((prev) => {
                              const next = [...prev];
                              next[vIdx].itineraryDays = next[vIdx].itineraryDays.filter(
                                (_, i) => i !== dIdx
                              );
                              return next;
                            });
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVariants((prev) => {
                            const next = [...prev];
                            next[vIdx].itineraryDays[dIdx].title = val;
                            return next;
                          });
                        }}
                        placeholder="Day Title (e.g. Arrival in Srinagar & Dal Lake Houseboat)"
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs font-semibold focus:border-[#c9a15a]"
                      />

                      <textarea
                        rows={2}
                        value={day.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVariants((prev) => {
                            const next = [...prev];
                            next[vIdx].itineraryDays[dIdx].description = val;
                            return next;
                          });
                        }}
                        placeholder="Detailed day activity plan..."
                        className="w-full p-2.5 bg-gray-50 border rounded-lg text-xs focus:border-[#c9a15a]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function PackageFormPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading editor...</div>}>
      <PackageFormContent />
    </Suspense>
  );
}
