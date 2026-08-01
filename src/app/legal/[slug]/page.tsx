import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const titles: Record<string, string> = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cancellation: 'Cancellation & Refund Policy',
    cookie: 'Cookie Policy',
  };
  return {
    title: `${titles[slug] || 'Legal Policy'} | Travel & Hault`,
  };
}

export const revalidate = 60;

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const validSlugs = ['privacy', 'terms', 'cancellation', 'cookie'];
  if (!validSlugs.includes(slug)) notFound();

  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  });

  const legalPages = JSON.parse(settings?.legalPagesJson || '{}');
  const contentHtml = legalPages[slug] || `<p>Content for ${slug} policy page.</p>`;

  const titles: Record<string, string> = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cancellation: 'Cancellation & Refund Policy',
    cookie: 'Cookie Policy',
  };

  return (
    <div className="pt-24 pb-0 space-y-0">
      {/* Top Banner (BEIGE background #F5F0E6) */}
      <section className="bg-[#F5F0E6] text-[#051b2e] py-16 border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#b8934b]">
            Legal Information
          </span>
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            {titles[slug]}
          </h1>
        </div>
      </section>

      {/* Content (WHITE background) */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F5F0E6] p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-gray-800 text-sm leading-relaxed font-sans">
            <div
              className="prose max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h3:text-lg prose-a:text-[#b8934b] prose-[#051b2e]"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
