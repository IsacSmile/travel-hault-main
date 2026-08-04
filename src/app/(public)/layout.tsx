import React from 'react';
import { prisma } from '@/lib/prisma';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/components/public/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
    select: {
      primaryBgColor: true,
      secondaryBgColor: true,
      accentColor: true,
      themePreset: true,
    },
  });

  const initialTheme = {
    primaryBgColor: settings?.primaryBgColor || '#FFFFFF',
    secondaryBgColor: settings?.secondaryBgColor || '#F5F0E6',
    accentColor: settings?.accentColor || '#b8934b',
    themePreset: settings?.themePreset || 'classic-ivory',
  };

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <WishlistProvider>
        <Header />
        <main className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
          {children}
        </main>
        <Footer />
      </WishlistProvider>
    </ThemeProvider>
  );
}
