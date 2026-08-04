import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
      select: {
        whatsappNumber: true,
        whatsappEnabled: true,
        messengerLink: true,
        messengerEnabled: true,
        phoneNumbersJson: true,
        email: true,
        address: true,
        workingHours: true,
        gstinNumber: true,
        socialLinksJson: true,
        primaryBgColor: true,
        secondaryBgColor: true,
        accentColor: true,
        themePreset: true,
      },
    });

    return NextResponse.json(
      settings || {
        whatsappNumber: '+91 74075 24498',
        whatsappEnabled: true,
        messengerLink: 'travelhault',
        messengerEnabled: true,
        primaryBgColor: '#FFFFFF',
        secondaryBgColor: '#F5F0E6',
        accentColor: '#b8934b',
        themePreset: 'classic-ivory',
        phoneNumbersJson: JSON.stringify(['+91 74075 24498']),
        email: 'hello@travelhault.com',
        address: 'Suite 402, Signature Towers, MG Road, New Delhi - 110001',
        workingHours: 'Monday – Sunday: 9:00 AM – 8:00 PM',
        gstinNumber: '07ADZPL9107F1Z3',
        socialLinksJson: JSON.stringify([
          { id: '1', platform: 'Facebook', url: 'https://facebook.com', isActive: true },
          { id: '2', platform: 'Instagram', url: 'https://instagram.com', isActive: true },
          { id: '3', platform: 'X', url: 'https://twitter.com', isActive: true },
          { id: '4', platform: 'LinkedIn', url: 'https://linkedin.com', isActive: true },
          { id: '5', platform: 'Pinterest', url: 'https://pinterest.com', isActive: true },
          { id: '6', platform: 'WhatsApp', url: 'https://wa.me/917407524498', isActive: true },
        ]),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch {
    return NextResponse.json({
      whatsappNumber: '+91 74075 24498',
      whatsappEnabled: true,
      messengerLink: 'travelhault',
      messengerEnabled: true,
      primaryBgColor: '#FFFFFF',
      secondaryBgColor: '#F5F0E6',
      accentColor: '#b8934b',
      themePreset: 'classic-ivory',
      phoneNumbersJson: JSON.stringify(['+91 74075 24498']),
      email: 'hello@travelhault.com',
    });
  }
}
