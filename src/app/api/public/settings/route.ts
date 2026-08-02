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
      },
    });

    return NextResponse.json(
      settings || {
        whatsappNumber: '+91 74075 24498',
        whatsappEnabled: true,
        messengerLink: 'travelhault',
        messengerEnabled: true,
        phoneNumbersJson: JSON.stringify(['+91 74075 24498']),
        email: 'hello@travelhault.com',
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
    });
  }
}
