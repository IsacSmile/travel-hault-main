'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Trash2, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  image: string;
  locationTag?: string;
  caption?: string;
  category: string;
}

export default function GalleryManagerPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [image, setImage] = useState('');
  const [locationTag, setLocationTag] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Mountains');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/manage/gallery');
      if (res.ok) setItems(await res.json());
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
        const res = await fetch('/api/manage/gallery');
        if (res.ok && active) {
          setItems(await res.json());
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Please upload or select an image');

    try {
      const res = await fetch('/api/manage/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, locationTag, caption, category }),
      });

      if (res.ok) {
        fetchItems();
        setModalOpen(false);
        setImage('');
        setLocationTag('');
        setCaption('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo from gallery?')) return;
    try {
      const res = await fetch(`/api/manage/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Gallery Manager</h1>
          <p className="text-sm text-gray-500">Upload and categorize travel photography showcase.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">
          <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading gallery...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between opacity-90">
                <span className="self-start bg-[#051b2e]/90 text-[#c9a15a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <div>
                  <div className="text-xs font-bold text-white">{item.locationTag}</div>
                  <p className="text-[11px] text-gray-300 line-clamp-1">{item.caption}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-bold font-serif text-gray-900">Add Gallery Photo</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploader value={image} onChange={setImage} label="Upload Image" />

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Location Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Srinagar, Kashmir"
                  value={locationTag}
                  onChange={(e) => setLocationTag(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                >
                  <option value="Mountains">Mountains</option>
                  <option value="Beaches">Beaches</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Nature">Nature</option>
                  <option value="Cityscapes">Cityscapes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Short Caption
                </label>
                <input
                  type="text"
                  placeholder="Brief photo description..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c9a15a] text-[#051b2e] font-bold rounded-xl text-sm transition shadow"
              >
                Save Photo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
