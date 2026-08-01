'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface RegionItem {
  id: string;
  name: string;
  slug: string;
  badgesJson?: string;
  states: string;
  destinationCount: string;
  image: string;
  order: number;
}

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [badgesText, setBadgesText] = useState('ALL ADVENTURES, DEALS');
  const [states, setStates] = useState('');
  const [destinationCount, setDestinationCount] = useState('+ 10 destinations');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchRegions = async () => {
    try {
      const res = await fetch('/api/manage/regions');
      const data = await res.json();
      if (data.success) {
        setRegions(data.data);
      }
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
        const res = await fetch('/api/manage/regions');
        const data = await res.json();
        if (data.success && active) {
          setRegions(data.data);
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

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setBadgesText('ALL ADVENTURES, DEALS');
    setStates('');
    setDestinationCount('+ 10 destinations');
    setImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80');
    setOrder(regions.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (region: RegionItem) => {
    setEditingId(region.id);
    setName(region.name);
    setSlug(region.slug);
    try {
      const parsed = typeof region.badgesJson === 'string' ? JSON.parse(region.badgesJson) : region.badgesJson;
      setBadgesText(Array.isArray(parsed) ? parsed.join(', ') : '');
    } catch {
      setBadgesText('');
    }
    setStates(region.states);
    setDestinationCount(region.destinationCount);
    setImage(region.image);
    setOrder(region.order || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const badges = badgesText
      .split(',')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const payload = {
      id: editingId,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      badges,
      states,
      destinationCount,
      image,
      order: Number(order),
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/manage/regions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: editingId ? 'Region updated successfully!' : 'Region created successfully!' });
        setIsModalOpen(false);
        fetchRegions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save region' });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Error occurred while saving';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, regionName: string) => {
    if (!confirm(`Are you sure you want to delete "${regionName}"?`)) return;

    try {
      const res = await fetch(`/api/manage/regions?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Region "${regionName}" deleted.` });
        fetchRegions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete' });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Error deleting region';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black font-sans flex items-center gap-3">
            <MapPin className="w-8 h-8 text-[#b8934b]" /> Destination By Region Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, or delete regions displayed on the homepage Destination By Region section.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" /> Add New Region
        </button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {message.text}
        </div>
      )}

      {/* Regions Table / Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-medium flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#b8934b]" /> Loading regions...
        </div>
      ) : regions.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <p className="text-gray-500 text-sm font-medium">No regions found in database.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#b8934b] text-white font-bold text-xs rounded-xl shadow hover:bg-[#a3803c] transition"
          >
            Create First Region
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((reg) => {
            let badges: string[] = [];
            try {
              badges = typeof reg.badgesJson === 'string' ? JSON.parse(reg.badgesJson) : reg.badgesJson || [];
            } catch {
              badges = [];
            }

            return (
              <div
                key={reg.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                {/* Photo & Badges */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={reg.image} alt={reg.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {badges.map((b: string, i: number) => (
                      <span key={i} className="bg-black/60 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-0 space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-black font-sans">{reg.name}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2">{reg.states}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-3 py-1 rounded-full mt-1">
                    {reg.destinationCount}
                  </span>
                </div>

                {/* Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-semibold">Order: #{reg.order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(reg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Region"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reg.id, reg.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Region"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Region Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-black">
                {editingId ? 'Edit Region' : 'Add New Region'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Region Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. North India"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#b8934b]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Slug (URL parameter)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. north-india"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#b8934b]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tag Badges (Comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={badgesText}
                  onChange={(e) => setBadgesText(e.target.value)}
                  placeholder="e.g. ALL ADVENTURES, DEALS"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#b8934b]"
                />
                <span className="text-[10px] text-gray-400 block mt-1">First 2 tags display on top-left of image</span>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">States Covered *</label>
                <textarea
                  required
                  rows={2}
                  value={states}
                  onChange={(e) => setStates(e.target.value)}
                  placeholder="e.g. Ladakh, Delhi, Uttar Pradesh, Uttarakhand, Himachal Pradesh"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#b8934b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Destination Count Label *</label>
                  <input
                    type="text"
                    required
                    value={destinationCount}
                    onChange={(e) => setDestinationCount(e.target.value)}
                    placeholder="e.g. + 20 destinations"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#b8934b]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#b8934b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Region Card Photo *</label>
                <ImageUploader
                  value={image}
                  onChange={(url) => setImage(url)}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold rounded-xl shadow"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Region' : 'Create Region'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
