'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Globe,
  Shield,
  Phone,
  FileText,
  AlertCircle,
  Check,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  LayoutGrid,
  Palette,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

interface ThemePresetItem {
  id: string;
  name: string;
  description: string;
  primaryBg: string;
  secondaryBg: string;
  accent: string;
}

const PRESET_PALETTES: ThemePresetItem[] = [
  {
    id: 'classic-ivory',
    name: 'Classic Ivory',
    description: 'Original white & soft warm beige with gold accent',
    primaryBg: '#FFFFFF',
    secondaryBg: '#F5F0E6',
    accent: '#b8934b',
  },
  {
    id: 'warm-linen',
    name: 'Warm Linen',
    description: 'Earthy cream & linen tones with warm bronze',
    primaryBg: '#FAF8F5',
    secondaryBg: '#EFECE6',
    accent: '#A67C37',
  },
  {
    id: 'crisp-snow',
    name: 'Crisp Snow',
    description: 'Pure white & cool slate-tinted background',
    primaryBg: '#F8FAFC',
    secondaryBg: '#EDF2F7',
    accent: '#2563EB',
  },
  {
    id: 'desert-sands',
    name: 'Desert Sands',
    description: 'Sun-kissed sand background with warm terracotta accent',
    primaryBg: '#FFFDF9',
    secondaryBg: '#F7EBE1',
    accent: '#C25E00',
  },
  {
    id: 'soft-pearl',
    name: 'Soft Pearl',
    description: 'Ultra-soft off-white pearl with subtle champagne gold',
    primaryBg: '#FDFBF7',
    secondaryBg: '#F4ECE1',
    accent: '#9E7B3B',
  },
  {
    id: 'nordic-slate',
    name: 'Nordic Slate',
    description: 'Modern minimalist light grey with deep slate navy',
    primaryBg: '#F8FAFC',
    secondaryBg: '#E2E8F0',
    accent: '#0F172A',
  },
];

function getContrastRatio(hexColor1: string, hexColor2: string = '#051b2e'): number {
  const getLuminance = (hex: string) => {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map((c) => c + c).join('');
    }
    const r = parseInt(cleaned.substring(0, 2), 16) / 255;
    const g = parseInt(cleaned.substring(2, 4), 16) / 255;
    const b = parseInt(cleaned.substring(4, 6), 16) / 255;

    const a = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  try {
    const l1 = getLuminance(hexColor1);
    const l2 = getLuminance(hexColor2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 21;
  }
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
  const [packagesPerPage, setPackagesPerPage] = useState(9);

  // Floating Chat Widget State
  const [whatsappNumber, setWhatsappNumber] = useState('+91 74075 24498');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [messengerLink, setMessengerLink] = useState('travelhault');
  const [messengerEnabled, setMessengerEnabled] = useState(true);

  // Background Theme Palette State
  const [primaryBgColor, setPrimaryBgColor] = useState('#FFFFFF');
  const [secondaryBgColor, setSecondaryBgColor] = useState('#F5F0E6');
  const [accentColor, setAccentColor] = useState('#b8934b');
  const [themePreset, setThemePreset] = useState('classic-ivory');

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
                .filter(([, val]) => typeof val === 'string' && val.trim() !== '')
                .map(([key, val], idx) => ({
                  id: String(idx + 1),
                  platform: key.charAt(0).toUpperCase() + key.slice(1),
                  url: val as string,
                  isActive: true,
                }));
              setSocialLinks(converted);
            }
          } catch {
            setSocialLinks([]);
          }

          setLegalPages(JSON.parse(data.legalPagesJson || '{}'));
          setTrustTitle(data.trustTitle || 'Why Travel & Hault?');
          setTrustSubtext(data.trustSubtext || '');
          setPackagesPerPage(data.packagesPerPage || 9);

          setWhatsappNumber(data.whatsappNumber || '+91 74075 24498');
          setWhatsappEnabled(data.whatsappEnabled !== undefined ? Boolean(data.whatsappEnabled) : true);
          setMessengerLink(data.messengerLink || 'travelhault');
          setMessengerEnabled(data.messengerEnabled !== undefined ? Boolean(data.messengerEnabled) : true);

          setPrimaryBgColor(data.primaryBgColor || '#FFFFFF');
          setSecondaryBgColor(data.secondaryBgColor || '#F5F0E6');
          setAccentColor(data.accentColor || '#b8934b');
          setThemePreset(data.themePreset || 'classic-ivory');
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
          packagesPerPage,
          whatsappNumber,
          whatsappEnabled,
          messengerLink,
          messengerEnabled,
          primaryBgColor,
          secondaryBgColor,
          accentColor,
          themePreset,
        }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      alert('Site settings & background theme updated successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save error';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPreset = (preset: ThemePresetItem) => {
    setPrimaryBgColor(preset.primaryBg);
    setSecondaryBgColor(preset.secondaryBg);
    setAccentColor(preset.accent);
    setThemePreset(preset.id);
  };

  const handleResetTheme = () => {
    setPrimaryBgColor('#FFFFFF');
    setSecondaryBgColor('#F5F0E6');
    setAccentColor('#b8934b');
    setThemePreset('classic-ivory');
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
        {/* 0. SITE BACKGROUND THEME & COLOR PALETTE MANAGER */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#b8934b]" /> Site Background & Color Theme
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize site-wide background colors and brand accents while maintaining minimal luxury design standards.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetTheme}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              title="Reset to default minimal palette"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" /> Reset to Classic Palette
            </button>
          </div>

          {/* Curated Preset Palettes */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b8934b]" /> Curated Minimal Preset Combinations
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_PALETTES.map((preset) => {
                const isSelected = themePreset === preset.id &&
                  primaryBgColor.toUpperCase() === preset.primaryBg.toUpperCase() &&
                  secondaryBgColor.toUpperCase() === preset.secondaryBg.toUpperCase();

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/50 border-[#b8934b] ring-2 ring-[#b8934b]/20 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{preset.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-[#b8934b] text-white text-[10px] font-extrabold rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">{preset.description}</p>
                    </div>

                    {/* Color Swatch Indicators */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                          style={{ backgroundColor: preset.primaryBg }}
                          title={`Primary BG: ${preset.primaryBg}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                          style={{ backgroundColor: preset.secondaryBg }}
                          title={`Secondary BG: ${preset.secondaryBg}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                          style={{ backgroundColor: preset.accent }}
                          title={`Accent: ${preset.accent}`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 ml-auto">
                        {preset.primaryBg} / {preset.secondaryBg}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Pickers & WCAG AA Contrast Check */}
          <div className="pt-2 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Custom Color Controls & Contrast Validation
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary Background */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="block text-xs font-bold text-gray-800">Primary Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryBgColor}
                    onChange={(e) => {
                      setPrimaryBgColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={primaryBgColor}
                    onChange={(e) => {
                      setPrimaryBgColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold uppercase"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block">Main page background canvas</span>
              </div>

              {/* Secondary Background */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="block text-xs font-bold text-gray-800">Secondary Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryBgColor}
                    onChange={(e) => {
                      setSecondaryBgColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={secondaryBgColor}
                    onChange={(e) => {
                      setSecondaryBgColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold uppercase"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block">Alternating section background</span>
              </div>

              {/* Brand Accent Color */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="block text-xs font-bold text-gray-800">Brand Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold uppercase"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block">Buttons, badges & active links</span>
              </div>
            </div>

            {/* Contrast Checker Badges */}
            {(() => {
              const primaryRatio = getContrastRatio(primaryBgColor, '#051b2e');
              const secondaryRatio = getContrastRatio(secondaryBgColor, '#051b2e');
              const isPrimaryPass = primaryRatio >= 4.5;
              const isSecondaryPass = secondaryRatio >= 4.5;

              return (
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <div
                    className={`flex-1 p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                      isPrimaryPass
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    {isPrimaryPass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">Primary BG Contrast: {primaryRatio.toFixed(1)}:1</span>
                      <span className="block text-[11px] opacity-80">
                        {isPrimaryPass
                          ? 'WCAG AA Compliant (Passes 4.5:1 text readability)'
                          : 'Warning: Low text contrast! Dark body text may be hard to read.'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex-1 p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                      isSecondaryPass
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    {isSecondaryPass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">Secondary BG Contrast: {secondaryRatio.toFixed(1)}:1</span>
                      <span className="block text-[11px] opacity-80">
                        {isSecondaryPass
                          ? 'WCAG AA Compliant (Passes 4.5:1 section contrast)'
                          : 'Warning: Low text contrast! Section text may be hard to read.'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Live Preview Panel */}
          <div className="pt-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between">
              <span>Real-Time Public Site Live Preview</span>
              <span className="text-[10px] font-normal text-gray-400">Updates live as you adjust colors</span>
            </label>

            <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
              {/* Simulated Header */}
              <div className="bg-[#051b2e] px-4 py-3 text-white flex items-center justify-between text-xs">
                <span className="font-bold font-serif tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  TRAVEL & HAULT
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Header Navigation
                </span>
              </div>

              {/* Simulated Primary Section */}
              <div className="p-5 space-y-4" style={{ backgroundColor: primaryBgColor }}>
                <div>
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1.5"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    FEATURED TRIPS
                  </span>
                  <h3 className="text-base font-bold font-serif text-[#051b2e]">
                    Handcrafted Luxury Itineraries
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Sample body text rendered against your primary background setting.
                  </p>
                </div>

                {/* Simulated Secondary Section Card */}
                <div
                  className="p-4 rounded-xl border border-black/10 space-y-3 transition-colors duration-200"
                  style={{ backgroundColor: secondaryBgColor }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#051b2e]">Alternating Section Card</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      7 Days
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Sample card content showing secondary background fill contrast.
                  </p>
                  <div className="pt-1 flex items-center justify-between border-t border-black/10">
                    <span className="text-xs font-extrabold text-[#051b2e]">₹45,000 / person</span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs"
                      style={{ backgroundColor: accentColor }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* 1.5. FLOATING CHAT WIDGET SYSTEM (WHATSAPP + MESSENGER) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> Floating Chat Widget Settings
            </span>
            <span className="text-xs font-normal text-gray-500">Live website widget controls</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Settings */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase text-emerald-800 flex items-center gap-1.5">
                  WhatsApp Support
                </label>
                <button
                  type="button"
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                    whatsappEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {whatsappEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-1">
                  WhatsApp Support Number
                </span>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. +91 74075 24498"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Includes country code. Used for deep-link prefilled WhatsApp chat query.
                </span>
              </div>
            </div>

            {/* Messenger Settings */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase text-blue-800 flex items-center gap-1.5">
                  Facebook Messenger
                </label>
                <button
                  type="button"
                  onClick={() => setMessengerEnabled(!messengerEnabled)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                    messengerEnabled
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {messengerEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-1">
                  Messenger Page Username or Link
                </span>
                <input
                  type="text"
                  value={messengerLink}
                  onChange={(e) => setMessengerLink(e.target.value)}
                  placeholder="e.g. travelhault or https://m.me/travelhault"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Facebook Page ID/Username. Used to generate m.me deep-links.
                </span>
              </div>
            </div>
          </div>
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

        {/* 4. DISPLAY SETTINGS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#c9a15a]" /> Display Settings
          </h2>

          <div className="max-w-xs space-y-2">
            <label className="block text-xs font-semibold uppercase text-gray-600">
              Packages Per Page
            </label>
            <input
              type="number"
              min={3}
              max={30}
              step={3}
              value={packagesPerPage}
              onChange={(e) => setPackagesPerPage(Math.max(3, Math.min(30, parseInt(e.target.value) || 9)))}
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono focus:outline-none focus:border-[#c9a15a]"
            />
            <p className="text-xs text-gray-500 leading-relaxed">
              Number of package cards to display per page on the public Packages listing. Recommended: 9 or 12 (multiples of 3 for grid alignment).
            </p>
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
