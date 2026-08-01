'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Globe,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  AlertCircle,
  Check,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

const PREDEFINED_PLATFORMS = [
  'Facebook',
  'Instagram',
  'X',
  'LinkedIn',
  'Pinterest',
  'WhatsApp',
  'Messenger',
  'YouTube',
  'TikTok',
];

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [gstinNumber, setGstinNumber] = useState('');

  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);

  const [legalPages, setLegalPages] = useState({
    privacy: '',
    terms: '',
    cancellation: '',
    cookie: '',
  });

  const [trustTitle, setTrustTitle] = useState('');
  const [trustSubtext, setTrustSubtext] = useState('');

  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'cancellation' | 'cookie'>('privacy');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Social Link Form State
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newUrl, setNewUrl] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);

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
          setGstinNumber(data.gstinNumber || '');

          // Parse social links safely (object or array format)
          try {
            const parsedSocial = JSON.parse(data.socialLinksJson || '[]');
            if (Array.isArray(parsedSocial)) {
              setSocialLinks(parsedSocial);
            } else if (typeof parsedSocial === 'object' && parsedSocial !== null) {
              const converted: SocialLinkItem[] = Object.entries(parsedSocial)
                .filter(([_, val]) => typeof val === 'string' && val.trim() !== '')
                .map(([key, val], idx) => ({
                  id: String(idx + 1),
                  platform: key.charAt(0).toUpperCase() + key.slice(1),
                  url: val as string,
                  isActive: true,
                }));
              setSocialLinks(converted);
            }
          } catch (e) {
            setSocialLinks([]);
          }

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
          gstinNumber: gstinNumber.trim(),
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

  // Social Links Handlers
  const handleAddSocialLink = () => {
    if (!newUrl.trim()) {
      alert('Please enter a valid URL.');
      return;
    }
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      alert('URL must start with http:// or https://');
      return;
    }

    const newItem: SocialLinkItem = {
      id: Date.now().toString(),
      platform: newPlatform,
      url: newUrl.trim(),
      isActive: newIsActive,
    };

    setSocialLinks((prev) => [...prev, newItem]);
    setNewUrl('');
    setShowAddSocialModal(false);
  };

  const handleToggleSocialActive = (id: string) => {
    setSocialLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleDeleteSocialLink = (id: string, platformName: string) => {
    if (confirm(`Are you sure you want to remove the ${platformName} link?`)) {
      setSocialLinks((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleMoveSocialOrder = (index: number, direction: 'up' | 'down') => {
    setSocialLinks((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // GSTIN soft validation check (15 alphanumeric characters)
  const isGstinFormatValid = !gstinNumber || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gstinNumber.trim());

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-sans">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading site & footer settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Footer & Site Settings</h1>
          <p className="text-sm text-gray-500">
            Manage global contact details, footer social channels, and business GSTIN registration.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. SOCIAL LINKS MANAGEMENT */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c9a15a]" /> Footer Social Links
            </h2>
            <button
              type="button"
              onClick={() => setShowAddSocialModal(true)}
              className="px-4 py-2 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add Social Link
            </button>
          </div>

          {/* Social Links List */}
          {socialLinks.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-xs border border-dashed rounded-xl bg-gray-50">
              No social links added yet. Click &quot;Add Social Link&quot; above to configure footer icons.
            </div>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    item.isActive ? 'bg-white border-gray-200 shadow-2xs' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveSocialOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-100 text-gray-500 rounded disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSocialOrder(idx, 'down')}
                        disabled={idx === socialLinks.length - 1}
                        className="p-1 hover:bg-gray-100 text-gray-500 rounded disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Platform Badge */}
                    <span className="px-3 py-1 bg-gray-100 text-[#051b2e] font-extrabold text-xs rounded-full shrink-0">
                      {item.platform}
                    </span>

                    {/* URL text */}
                    <span className="text-xs text-gray-600 truncate font-mono flex-1">{item.url}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSocialActive(item.id)}
                      className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                        item.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title={item.isActive ? 'Visible in footer' : 'Hidden from footer'}
                    >
                      {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="hidden sm:inline">{item.isActive ? 'Active' : 'Hidden'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(item.id, item.platform)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Social Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. BUSINESS & GSTIN REGISTRATION */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#c9a15a]" /> Business & GSTIN Details
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase text-gray-600">
                GSTIN Number (Optional)
              </label>
              {gstinNumber && (
                <button
                  type="button"
                  onClick={() => setGstinNumber('')}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  Clear GSTIN
                </button>
              )}
            </div>

            <input
              type="text"
              value={gstinNumber}
              onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
              placeholder="e.g. 07ADZPL9107F1Z3"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
            />

            {!isGstinFormatValid && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: Entered GSTIN does not match standard 15-character format pattern (e.g. 07ADZPL9107F1Z3).</span>
              </div>
            )}

            <p className="text-xs text-gray-500 leading-relaxed">
              If provided, this GSTIN displays next to the copyright text in the footer bottom bar. Leaving this field blank omits GSTIN from the live site completely.
            </p>
          </div>
        </div>

        {/* 3. CONTACT & AGENCY INFO */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#c9a15a]" /> Contact & Working Hours
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
                placeholder="Monday – Sunday: 9:00 AM – 8:00 PM"
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

          {/* Phone Numbers List */}
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

        {/* 4. LEGAL DOCUMENTS CONTENT */}
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

      {/* ADD SOCIAL LINK MODAL */}
      {showAddSocialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif font-bold text-xl text-gray-900 border-b pb-3">
              Add New Footer Social Link
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-sans"
                >
                  {PREDEFINED_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://facebook.com/travelhault"
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newIsActive"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#051b2e]"
                />
                <label htmlFor="newIsActive" className="font-bold text-gray-700 cursor-pointer">
                  Active (Visible in live footer)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddSocialModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-black font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-5 py-2.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-extrabold text-xs rounded-xl shadow"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
