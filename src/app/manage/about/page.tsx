'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, Info, Sparkles, Target, Eye, Shield, Play, Plus, Trash2 } from 'lucide-react';

interface StatItem {
  number: string;
  label: string;
}

export default function AboutPageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'stats' | 'mission' | 'vision' | 'strength' | 'video'>('hero');

  // Hero Section
  const [heroHeading, setHeroHeading] = useState('');
  const [heroText, setHeroText] = useState('');
  const [heroImage, setHeroImage] = useState('');

  // Stats Section
  const [statsStatementText, setStatsStatementText] = useState('');
  const [stats, setStats] = useState<StatItem[]>([
    { number: '', label: '' },
    { number: '', label: '' },
    { number: '', label: '' },
    { number: '', label: '' },
  ]);

  // Mission Section
  const [missionHeading, setMissionHeading] = useState('');
  const [missionText, setMissionText] = useState('');
  const [missionImageBg, setMissionImageBg] = useState('');
  const [missionImageFg, setMissionImageFg] = useState('');
  const [missionPoints, setMissionPoints] = useState<string[]>(['', '', '', '']);

  // Vision Section
  const [visionHeading, setVisionHeading] = useState('');
  const [visionText, setVisionText] = useState('');
  const [visionImageBg, setVisionImageBg] = useState('');
  const [visionImageFg, setVisionImageFg] = useState('');
  const [visionPoints, setVisionPoints] = useState<string[]>(['', '', '', '']);

  // Strength Section
  const [strengthHeading, setStrengthHeading] = useState('');
  const [strengthText, setStrengthText] = useState('');
  const [strengthImageBg, setStrengthImageBg] = useState('');
  const [strengthImageFg, setStrengthImageFg] = useState('');
  const [strengthPoints, setStrengthPoints] = useState<string[]>(['', '', '', '']);

  // Video Section
  const [videoHeading, setVideoHeading] = useState('');
  const [videoSubtext, setVideoSubtext] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/manage/about');
        if (res.ok) {
          const data = await res.json();
          setHeroHeading(data.heroHeading || '');
          setHeroText(data.heroText || '');
          setHeroImage(data.heroImage || '');

          setStatsStatementText(data.statsStatementText || '');
          try {
            const parsedStats = JSON.parse(data.statsJson || '[]');
            setStats(parsedStats.length === 4 ? parsedStats : [
              { number: '20+', label: 'YEARS EXPERIENCE' },
              { number: '10k+', label: 'HAPPY TRAVELERS' },
              { number: '500+', label: 'CORPORATE & SCHOOL GROUPS' },
              { number: '50+', label: 'INDIAN DESTINATIONS' },
            ]);
          } catch {
            // Keep default array
          }

          setMissionHeading(data.missionHeading || '');
          setMissionText(data.missionText || '');
          setMissionImageBg(data.missionImageBg || '');
          setMissionImageFg(data.missionImageFg || '');
          try {
            setMissionPoints(JSON.parse(data.missionPointsJson || '["", "", "", ""]'));
          } catch {
            // Keep default
          }

          setVisionHeading(data.visionHeading || '');
          setVisionText(data.visionText || '');
          setVisionImageBg(data.visionImageBg || '');
          setVisionImageFg(data.visionImageFg || '');
          try {
            setVisionPoints(JSON.parse(data.visionPointsJson || '["", "", "", ""]'));
          } catch {
            // Keep default
          }

          setStrengthHeading(data.strengthHeading || '');
          setStrengthText(data.strengthText || '');
          setStrengthImageBg(data.strengthImageBg || '');
          setStrengthImageFg(data.strengthImageFg || '');
          try {
            setStrengthPoints(JSON.parse(data.strengthPointsJson || '["", "", "", ""]'));
          } catch {
            // Keep default
          }

          setVideoHeading(data.videoHeading || '');
          setVideoSubtext(data.videoSubtext || '');
          setVideoThumbnail(data.videoThumbnail || '');
          setVideoUrl(data.videoUrl || '');
        }
      } catch (err) {
        console.error('Failed to load about page content', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/manage/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroHeading,
          heroText,
          heroImage,
          statsStatementText,
          stats,
          missionHeading,
          missionText,
          missionImageBg,
          missionImageFg,
          missionPoints,
          visionHeading,
          visionText,
          visionImageBg,
          visionImageFg,
          visionPoints,
          strengthHeading,
          strengthText,
          strengthImageBg,
          strengthImageFg,
          strengthPoints,
          videoHeading,
          videoSubtext,
          videoThumbnail,
          videoUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to update About Page Customizations');
      alert('About Page settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const updateStatItem = (index: number, key: 'number' | 'label', val: string) => {
    setStats((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: val };
      return next;
    });
  };

  const updatePointItem = (section: 'mission' | 'vision' | 'strength', index: number, val: string) => {
    if (section === 'mission') {
      setMissionPoints((prev) => {
        const next = [...prev];
        next[index] = val;
        return next;
      });
    } else if (section === 'vision') {
      setVisionPoints((prev) => {
        const next = [...prev];
        next[index] = val;
        return next;
      });
    } else {
      setStrengthPoints((prev) => {
        const next = [...prev];
        next[index] = val;
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-sans">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading About page editor...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">About Page Manager</h1>
          <p className="text-sm text-gray-500">
            Customize the stories, missions, vision statement, stats, and workflow videos on the public About page.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#c9a15a] hover:bg-[#b58e47] text-[#051b2e] font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
        {[
          { key: 'hero', label: 'Intro & Hero', icon: Sparkles },
          { key: 'stats', label: 'Stats Block', icon: Info },
          { key: 'mission', label: 'Our Mission', icon: Target },
          { key: 'vision', label: 'Our Vision', icon: Eye },
          { key: 'strength', label: 'Strength & Team', icon: Shield },
          { key: 'video', label: 'Workflow Video', icon: Play },
        ].map((sec) => (
          <button
            key={sec.key}
            type="button"
            onClick={() => setActiveSection(sec.key as any)}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeSection === sec.key ? 'border-[#c9a15a] text-[#051b2e]' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <sec.icon className="w-4 h-4 text-[#c9a15a]" />
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. INTRO & HERO */}
        {activeSection === 'hero' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-900">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headline Heading</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
                  placeholder="e.g. Crafting Unforgettable Journeys Together"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description Paragraph</label>
                <textarea
                  rows={4}
                  value={heroText}
                  onChange={(e) => setHeroText(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-xl text-sm"
                  placeholder="Intro description copy..."
                />
              </div>

              <ImageUploader
                value={heroImage}
                onChange={setHeroImage}
                label="Hero Side Image (Tall Aspect Ratio Recommended)"
              />
            </div>
          </div>
        )}

        {/* 2. STATS SECTION */}
        {activeSection === 'stats' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Statements & Stats Counter</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Statement Text</label>
              <textarea
                rows={3}
                value={statsStatementText}
                onChange={(e) => setStatsStatementText(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-xl text-sm font-sans"
                placeholder="Centered statement text..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((st, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-gray-50/50 space-y-3">
                  <span className="text-[10px] font-extrabold text-[#c9a15a] uppercase">Stat Block #{idx + 1}</span>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Big Number</label>
                    <input
                      type="text"
                      value={st.number}
                      onChange={(e) => updateStatItem(idx, 'number', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-sm font-bold text-[#051b2e]"
                      placeholder="e.g. 15+"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">Text Label</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => updateStatItem(idx, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-bold text-gray-500"
                      placeholder="e.g. YEARS EXPERIENCE"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. OUR MISSION */}
        {activeSection === 'mission' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Our Mission Customizer</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                <input
                  type="text"
                  value={missionHeading}
                  onChange={(e) => setMissionHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
                  placeholder="Our Mission"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-xl text-sm"
                  placeholder="Describe the mission..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader
                  value={missionImageBg}
                  onChange={setMissionImageBg}
                  label="Large Background Image"
                />
                <ImageUploader
                  value={missionImageFg}
                  onChange={setMissionImageFg}
                  label="Smaller Overlapping Image"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">Checklist Points (Max 4)</label>
                {missionPoints.map((pt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={pt}
                    onChange={(e) => updatePointItem('mission', idx, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                    placeholder={`Checklist Point #${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. OUR VISION */}
        {activeSection === 'vision' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Our Vision Customizer</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                <input
                  type="text"
                  value={visionHeading}
                  onChange={(e) => setVisionHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
                  placeholder="Our Vision"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-xl text-sm"
                  placeholder="Describe the vision..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader
                  value={visionImageBg}
                  onChange={setVisionImageBg}
                  label="Large Background Image"
                />
                <ImageUploader
                  value={visionImageFg}
                  onChange={setVisionImageFg}
                  label="Smaller Overlapping Image"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">Checklist Points (Max 4)</label>
                {visionPoints.map((pt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={pt}
                    onChange={(e) => updatePointItem('vision', idx, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                    placeholder={`Checklist Point #${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. STRENGTH & TEAM */}
        {activeSection === 'strength' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Strength & Team Customizer</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                <input
                  type="text"
                  value={strengthHeading}
                  onChange={(e) => setStrengthHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
                  placeholder="Our Strength & Team"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={strengthText}
                  onChange={(e) => setStrengthText(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-xl text-sm"
                  placeholder="Describe our strength and team..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader
                  value={strengthImageBg}
                  onChange={setStrengthImageBg}
                  label="Large Background Image"
                />
                <ImageUploader
                  value={strengthImageFg}
                  onChange={setStrengthImageFg}
                  label="Smaller Overlapping Image"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">Checklist Points (Max 4)</label>
                {strengthPoints.map((pt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={pt}
                    onChange={(e) => updatePointItem('strength', idx, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm"
                    placeholder={`Checklist Point #${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. HOW WE WORK (VIDEO) */}
        {activeSection === 'video' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-900">How We Do Work Video Block</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Video Heading Title</label>
                <input
                  type="text"
                  value={videoHeading}
                  onChange={(e) => setVideoHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
                  placeholder="How We Do Work"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtext Paragraph</label>
                <input
                  type="text"
                  value={videoSubtext}
                  onChange={(e) => setVideoSubtext(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"
                  placeholder="Short introductory tagline..."
                />
              </div>

              <ImageUploader
                value={videoThumbnail}
                onChange={setVideoThumbnail}
                label="Video Thumbnail Image"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Video URL (YouTube/Vimeo Embed or Share link)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-mono"
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
