'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, ChevronRight, CheckCircle2, Play } from 'lucide-react';

interface StatItem {
  number: string;
  label: string;
}

export default function AboutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/manage/about');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error loading about data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-gray-500 font-sans">
        <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading...
      </div>
    );
  }

  // Fallback defaults if load fails
  const doc = data || {
    heroHeading: 'Crafting Unforgettable Journeys Together',
    heroText: 'At Travel & Hault, we believe in the magic of exploration and the power of personalized travel. We design boutique vacations customized for you.',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    statsStatementText: 'We are committed to delivering reliable, high-quality travel solutions. With over two decades of experience, we combine local expertise and premium stays.',
    statsJson: '[]',
    missionHeading: 'Our Mission',
    missionText: 'To provide high quality trust and authentic local tours.',
    missionImageBg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    missionImageFg: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
    missionPointsJson: '[]',
    visionHeading: 'Our Vision',
    visionText: 'Pioneering sustainable green tourism globally.',
    visionImageBg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    visionImageFg: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
    visionPointsJson: '[]',
    strengthHeading: 'Our Strength & Team',
    strengthText: 'Specialized coordinators and custom transport fleets.',
    strengthImageBg: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',
    strengthImageFg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    strengthPointsJson: '[]',
    videoHeading: 'How We Do Work',
    videoSubtext: 'A quality-oriented travel agency workflow.',
    videoThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  };

  const stats: StatItem[] = (() => {
    try { return JSON.parse(doc.statsJson || '[]'); } catch { return []; }
  })();
  const missionPoints: string[] = (() => {
    try { return JSON.parse(doc.missionPointsJson || '[]'); } catch { return []; }
  })();
  const visionPoints: string[] = (() => {
    try { return JSON.parse(doc.visionPointsJson || '[]'); } catch { return []; }
  })();
  const strengthPoints: string[] = (() => {
    try { return JSON.parse(doc.strengthPointsJson || '[]'); } catch { return []; }
  })();

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="pt-24 pb-20 space-y-24 bg-white">
      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#b8934b] transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-[#051b2e] font-semibold">About</span>
        </nav>
      </div>

      {/* ── INTRO HERO BLOCK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Heading & Paragraph */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#051b2e] leading-[1.1] max-w-xl">
              {doc.heroHeading}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
              {doc.heroText}
            </p>
          </div>

          {/* Right Column: Tall Photo with Decorative Badge */}
          <div className="relative">
            <div className="aspect-[4/3] lg:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doc.heroImage}
                alt="About Hero"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Circular Overlapping Badge */}
            <div className="absolute -bottom-6 left-8 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 flex items-center justify-center animate-bounce-slow">
              <div className="w-12 h-12 rounded-full bg-[#051b2e] text-[#c9a15a] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATEMENT + STATS ROW ── */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          {/* Center brand statement */}
          <p className="font-serif text-xl sm:text-2xl text-gray-800 leading-relaxed font-medium max-w-4xl mx-auto">
            {doc.statsStatementText}
          </p>

          {/* Stats count */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
              {stats.map((st, i) => (
                <div key={i} className="space-y-1 text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#051b2e] tracking-tight">
                    {st.number}
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8934b]">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ALTERNATING BLOCKS (MISSION, VISION, STRENGTH) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* Block #1: Mission (Photo Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Layered overlapping photos */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.missionImageBg} alt="Mission Background" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.missionImageFg} alt="Mission Foreground" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
              {doc.missionHeading}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {doc.missionText}
            </p>
            {missionPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {missionPoints.filter(Boolean).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-[#051b2e]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Block #2: Vision (Text Left, Photo Right - Mirrored) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 lg:order-1 order-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
              {doc.visionHeading}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {doc.visionText}
            </p>
            {visionPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {visionPoints.filter(Boolean).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-[#051b2e]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Layered photos */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:order-2 order-1">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.visionImageBg} alt="Vision Background" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.visionImageFg} alt="Vision Foreground" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Block #3: Strength & Team (Photo Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Layered overlapping photos */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.strengthImageBg} alt="Strength Background" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.strengthImageFg} alt="Strength Foreground" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
              {doc.strengthHeading}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {doc.strengthText}
            </p>
            {strengthPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {strengthPoints.filter(Boolean).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-[#051b2e]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── HOW WE DO WORK (VIDEO PLAYER MODAL) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center pt-8">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#051b2e]">
            {doc.videoHeading}
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {doc.videoSubtext}
          </p>
        </div>

        {/* Video Embedded Inline */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 max-w-4xl mx-auto">
          {doc.videoUrl ? (
            <iframe
              src={getEmbedUrl(doc.videoUrl)}
              title="Work Process Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No video URL configured.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
