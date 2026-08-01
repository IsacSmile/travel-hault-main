'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, Globe, Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    youtube: '',
  });

  const [legalPages, setLegalPages] = useState({
    privacy: '',
    terms: '',
    cancellation: '',
    cookie: '',
  });

  const [trustTitle, setTrustTitle] = useState('');
  const [trustSubtext, setTrustSubtext] = useState('');

  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'cancellation' | 'cookie'>('privacy');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/manage/settings');
        if (res.ok) {
          const data = await res.json();
          setPhoneNumbers(JSON.parse(data.phoneNumbersJson || '["+91 98765 43210"]'));
          setEmail(data.email || '');
          setAddress(data.address || '');
          setWorkingHours(data.workingHours || '');
          setSocialLinks(JSON.parse(data.socialLinksJson || '{}'));
          setLegalPages(JSON.parse(data.legalPagesJson || '{}'));
          setTrustTitle(data.trustTitle || 'Why Travel & Hault?');
          setTrustSubtext(data.trustSubtext || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/manage/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumbers: phoneNumbers.filter((p) => p.trim() !== ''),
          email,
          address,
          workingHours,
          socialLinks,
          legalPages,
          trustTitle,
          trustSubtext,
        }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      alert('Site settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Save error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Site Settings & Policies</h1>
          <p className="text-sm text-gray-500">Manage global contact details, social channels, and legal policies.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact Info Block */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#c9a15a]" /> Contact & Agency Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Working Hours
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="Mon - Sat: 9:30 AM - 7:00 PM (IST)"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Physical Office Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase text-gray-600">
                Phone Numbers
              </label>
              <button
                type="button"
                onClick={() => setPhoneNumbers((prev) => [...prev, ''])}
                className="text-xs font-semibold text-[#c9a15a] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Phone
              </button>
            </div>
            <div className="space-y-2">
              {phoneNumbers.map((num, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={num}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhoneNumbers((prev) => {
                        const next = [...prev];
                        next[idx] = val;
                        return next;
                      });
                    }}
                    placeholder="+91 98765 43210"
                    className="flex-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPhoneNumbers((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Channels */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#c9a15a]" /> Social Media Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                placeholder="https://instagram.com/travelhault"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                placeholder="https://facebook.com/travelhault"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                placeholder="https://twitter.com/travelhault"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                placeholder="https://youtube.com/travelhault"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Legal Pages Rich Content */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c9a15a]" /> Legal Documents Content
          </h2>

          <div className="flex border-b gap-4 text-xs font-bold">
            {(['privacy', 'terms', 'cancellation', 'cookie'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveLegalTab(tab)}
                className={`pb-2 uppercase transition border-b-2 ${
                  activeLegalTab === tab
                    ? 'border-[#c9a15a] text-[#051b2e]'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab} Policy
              </button>
            ))}
          </div>

          <div>
            <textarea
              rows={8}
              value={legalPages[activeLegalTab]}
              onChange={(e) =>
                setLegalPages({ ...legalPages, [activeLegalTab]: e.target.value })
              }
              placeholder={`HTML or text block for ${activeLegalTab} policy...`}
              className="w-full p-4 bg-gray-50 border rounded-xl text-xs font-mono focus:outline-none focus:border-[#c9a15a]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
