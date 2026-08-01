'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtext: string;
  showingCount?: {
    start: number;
    end: number;
    total: number;
    label: string;
  };
}

export default function PageHeader({
  breadcrumbs,
  title,
  subtext,
  showingCount,
}: PageHeaderProps) {
  return (
    <div className="pt-8 pb-4 space-y-4">
      {/* Breadcrumb Navigation: [Home / Packages] */}
      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest select-none">
        <span className="text-gray-300">[</span>
        {breadcrumbs.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.href ? (
              <Link href={item.href} className="hover:text-black transition duration-200">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-extrabold">{item.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span className="mx-1 text-gray-300">/</span>}
          </React.Fragment>
        ))}
        <span className="text-gray-300">]</span>
      </div>

      {/* Main Page Title */}
      <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">
        {title}
      </h1>

      {/* Description Subtext */}
      <p className="text-sm sm:text-base text-gray-500 max-w-2xl leading-relaxed font-sans font-medium">
        {subtext}
      </p>

      {/* Dynamic Results Counter */}
      {showingCount && showingCount.total > 0 && (
        <div className="text-[10px] font-black uppercase tracking-widest text-[#b8934b] mt-5">
          SHOWING {showingCount.start}–{showingCount.end} OF {showingCount.total} {showingCount.label}
        </div>
      )}
    </div>
  );
}
