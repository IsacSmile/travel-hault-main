'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Edit, Trash2, X, Eye } from 'lucide-react';
import Link from 'next/link';

interface TripTheme {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  description: string;
  _count?: { packages: number };
}

export default function TripThemesManagerPage() {
  const [themes, setThemes] = useState<TripTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTheme, setEditingTheme] = useState<Partial<TripTheme> | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/manage/trip-themes');
      if (res.ok) setThemes(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/manage/trip-themes');
        if (res.ok && active) {
          setThemes(await res.json());
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

  const openForm = (theme?: TripTheme) => {
    if (theme) {
      setEditingTheme(theme);
      setName(theme.name);
      setSlug(theme.slug);
      setBannerImage(theme.bannerImage);
      setDescription(theme.description);
    } else {
      setEditingTheme({});
      setName('');
      setSlug('');
      setBannerImage('');
      setDescription('');
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingTheme?.id) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isEdit = !!editingTheme?.id;
      const res = await fetch('/api/manage/trip-themes', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTheme?.id,
          name,
          slug,
          bannerImage,
          description,
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      fetchThemes();
      setEditingTheme(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error saving theme';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, themeName: string) => {
    if (!confirm(`Delete theme "${themeName}"?`)) return;
    try {
      const res = await fetch(`/api/manage/trip-themes?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchThemes();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Trip Themes Manager</h1>
          <p className="text-sm text-gray-500">Organize packages into curated travel categories.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="px-5 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Theme
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">
          <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading themes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((th) => (
            <div
              key={th.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative h-36 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={th.bannerImage || 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'}
                  alt={th.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-lg font-bold text-white font-serif">{th.name}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-gray-500 line-clamp-2">{th.description}</p>
                <div className="flex items-center justify-between border-t pt-3 text-xs">
                  <span className="font-semibold text-gray-700">
                    {th._count?.packages || 0} Packages Tagged
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/trip-themes/${th.slug}`}
                      target="_blank"
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openForm(th)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(th.id, th.name)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
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

      {/* Edit / Create Modal */}
      {editingTheme && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold font-serif text-gray-900">
                {editingTheme.id ? 'Edit Theme' : 'Create New Theme'}
              </h2>
              <button onClick={() => setEditingTheme(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Theme Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Honeymoon Special"
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
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
                  placeholder="honeymoon-special"
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
                />
              </div>

              <ImageUploader value={bannerImage} onChange={setBannerImage} label="Banner Image" />

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary text shown on theme landing page..."
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-[#c9a15a]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition shadow"
              >
                {saving ? 'Saving...' : 'Save Theme'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
