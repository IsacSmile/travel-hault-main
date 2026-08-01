import React from 'react';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/public/WhatsAppWidget';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </WishlistProvider>
  );
}
