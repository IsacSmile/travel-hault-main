import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/public/PageHeader';
import { AlertCircle, Clock } from 'lucide-react';

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
    description: `Read the official ${titles[slug] || 'legal policy'} of Travel & Hault boutique travel agency.`,
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

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Legal Information', href: '/legal/privacy' },
    { label: titles[slug] },
  ];

  const lastUpdated = settings?.updatedAt
    ? new Date(settings.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'August 2, 2026';

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          breadcrumbs={breadcrumbs}
          title={titles[slug]}
          subtext="Official terms, disclosures, and guidelines governing Travel & Hault services."
        />

        {/* Single-Column Readable Content Block (max-w-3xl, ~760px) */}
        <div className="max-w-3xl mx-auto mt-10 space-y-8">
          {/* Last Updated Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/80 w-fit">
            <Clock className="w-3.5 h-3.5 text-[#b8934b]" />
            <span>Last Updated: {lastUpdated}</span>
          </div>

          {/* Legal Disclaimer Notice */}
          <div className="p-4 bg-[#f8f5ee] border border-[#c9a15a]/30 rounded-2xl flex items-start gap-3 text-xs text-gray-700 leading-relaxed shadow-2xs">
            <AlertCircle className="w-4 h-4 text-[#b8934b] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block mb-0.5">Legal Disclaimer Notice:</strong>
              This policy contains standard tour-operator template text. Please review with your legal counsel before commercial reliance.
            </div>
          </div>

          {/* Policy Text Box */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 text-gray-800 text-sm leading-relaxed font-sans">
            <div
              className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2 prose-a:text-[#b8934b] prose-a:font-bold hover:prose-a:underline prose-p:leading-relaxed prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
