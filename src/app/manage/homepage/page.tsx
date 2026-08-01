'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Edit, Trash2, ShieldCheck, HelpCircle, Star, Sliders } from 'lucide-react';

interface SlideItem {
  id: string;
  image: string;
  headline: string;
  locationTag?: string;
  subtext?: string;
}

interface TrustBadgeItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  showOnHomepage?: boolean;
}

interface TestimonialItem {
  id: string;
  name: string;
  reviewText: string;
  rating?: number;
  sourceLabel?: string;
}

export default function HomepageManagerPage() {
  const [activeTab, setActiveTab] = useState<'slides' | 'trust' | 'faqs' | 'testimonials'>('slides');
  const [loading, setLoading] = useState(true);

  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [trustBadges, setTrustBadges] = useState<TrustBadgeItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Item Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<SlideItem | TrustBadgeItem | FAQItem | TestimonialItem | Record<string, unknown> | null>(null);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/manage/homepage');
      if (res.ok) {
        const data = await res.json();
        setSlides(data.slides || []);
        setTrustBadges(data.trustBadges || []);
        setFaqs(data.faqs || []);
        setTestimonials(data.testimonials || []);
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
        const res = await fetch('/api/manage/homepage');
        if (res.ok && active) {
          const data = await res.json();
          setSlides(data.slides || []);
          setTrustBadges(data.trustBadges || []);
          setFaqs(data.faqs || []);
          setTestimonials(data.testimonials || []);
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

  const handleSave = async (section: string, action: string, data: unknown) => {
    try {
      const res = await fetch('/api/manage/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, action, data }),
      });
      if (res.ok) {
        fetchContent();
        setModalOpen(false);
        setEditItem(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-sans">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading homepage editor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-900">Homepage Content Manager</h1>
        <p className="text-sm text-gray-500">Manage hero slider imagery, trust badges, customer reviews, and FAQs.</p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-bold text-gray-500">
        <button
          onClick={() => setActiveTab('slides')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'slides'
              ? 'border-[#c9a15a] text-[#051b2e]'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#c9a15a]" /> Hero Slides ({slides.length})
        </button>

        <button
          onClick={() => setActiveTab('trust')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'trust'
              ? 'border-[#c9a15a] text-[#051b2e]'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#c9a15a]" /> Trust Badges ({trustBadges.length})
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'faqs'
              ? 'border-[#c9a15a] text-[#051b2e]'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#c9a15a]" /> FAQs ({faqs.length})
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'testimonials'
              ? 'border-[#c9a15a] text-[#051b2e]'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <Star className="w-4 h-4 text-[#c9a15a]" /> Testimonials ({testimonials.length})
        </button>
      </div>

      {/* Tab 1: Hero Slides */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditItem({ image: '', locationTag: 'Location Tag', headline: '', subtext: '', order: slides.length + 1 });
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-[#c9a15a] text-[#051b2e] font-bold text-xs rounded-xl flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" /> Add Hero Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((s) => (
              <div key={s.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative h-44 bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.headline} className="w-full h-full object-cover opacity-80" />
                  <span className="absolute top-3 left-3 bg-[#051b2e]/90 text-[#c9a15a] text-xs font-bold px-2.5 py-1 rounded-full">
                    {s.locationTag}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-gray-900">{s.headline}</h3>
                  <p className="text-xs text-gray-500">{s.subtext}</p>
                </div>
                <div className="p-4 border-t flex justify-end gap-2 bg-gray-50">
                  <button
                    onClick={() => {
                      setEditItem(s);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave('slide', 'delete', s)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Trust Badges */}
      {activeTab === 'trust' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditItem({ icon: 'Compass', title: '', description: '', order: trustBadges.length + 1 });
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-[#c9a15a] text-[#051b2e] font-bold text-xs rounded-xl flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" /> Add Trust Badge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#c9a15a]/10 text-[#c9a15a] flex items-center justify-center font-bold mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{t.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                </div>
                <div className="pt-3 border-t mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditItem(t);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave('trustBadge', 'delete', t)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditItem({ question: '', answer: '', order: faqs.length + 1 });
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-[#c9a15a] text-[#051b2e] font-bold text-xs rounded-xl flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" /> Add FAQ Item
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
                <div className="space-y-1 max-w-3xl">
                  <div className="font-bold text-sm text-gray-900">Q: {f.question}</div>
                  <div className="text-xs text-gray-600">A: {f.answer}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditItem(f);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave('faq', 'delete', f)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditItem({ name: '', reviewText: '', sourceLabel: 'Google Review', rating: 5 });
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-[#c9a15a] text-[#051b2e] font-bold text-xs rounded-xl flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 italic">&quot;{t.reviewText}&quot;</p>
                  <div className="pt-2">
                    <div className="font-bold text-xs text-gray-900">{t.name}</div>
                    <div className="text-[10px] text-gray-400">{t.sourceLabel}</div>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditItem(t);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave('testimonial', 'delete', t)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Modal */}
      {modalOpen && editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold font-serif text-gray-900 border-b pb-2">
              {editItem.id ? 'Edit Item' : 'Add Item'}
            </h2>

            {activeTab === 'slides' && (
              <div className="space-y-3">
                <ImageUploader value={editItem.image} onChange={(url) => setEditItem({ ...editItem, image: url })} label="Slide Image" />
                <input
                  type="text"
                  placeholder="Location Tag (e.g. Kashmir Valley)"
                  value={editItem.locationTag}
                  onChange={(e) => setEditItem({ ...editItem, locationTag: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Headline"
                  value={editItem.headline}
                  onChange={(e) => setEditItem({ ...editItem, headline: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="Subtext..."
                  value={editItem.subtext}
                  onChange={(e) => setEditItem({ ...editItem, subtext: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
            )}

            {activeTab === 'trust' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Badge Title (e.g. Bespoke Itineraries)"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="Description..."
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Question?"
                  value={editItem.question}
                  onChange={(e) => setEditItem({ ...editItem, question: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-bold"
                />
                <textarea
                  rows={3}
                  placeholder="Answer..."
                  value={editItem.answer}
                  onChange={(e) => setEditItem({ ...editItem, answer: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-bold"
                />
                <textarea
                  rows={3}
                  placeholder="Review text..."
                  value={editItem.reviewText}
                  onChange={(e) => setEditItem({ ...editItem, reviewText: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Source Label (e.g. Google Review)"
                  value={editItem.sourceLabel}
                  onChange={(e) => setEditItem({ ...editItem, sourceLabel: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const sectionMap: Record<string, string> = {
                    slides: 'slide',
                    trust: 'trustBadge',
                    faqs: 'faq',
                    testimonials: 'testimonial',
                  };
                  const action = editItem.id ? 'update' : 'create';
                  handleSave(sectionMap[activeTab], action, editItem);
                }}
                className="flex-1 py-2 bg-[#c9a15a] text-[#051b2e] text-xs font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
