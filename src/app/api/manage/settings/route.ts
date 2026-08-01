import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 'singleton',
        phoneNumbersJson: JSON.stringify(['+91 98765 43210', '+91 98765 43211']),
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
          { id: '6', platform: 'WhatsApp', url: 'https://wa.me/919876543210', isActive: true },
        ]),
        legalPagesJson: JSON.stringify({ privacy: '', terms: '', cancellation: '', cookie: '' }),
      },
    });
  }

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      phoneNumbers,
      email,
      address,
      workingHours,
      gstinNumber,
      socialLinks,
      legalPages,
      trustTitle,
      trustSubtext,
    } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        phoneNumbersJson: JSON.stringify(phoneNumbers || []),
        email: email || '',
        address: address || '',
        workingHours: workingHours || '',
        gstinNumber: gstinNumber || null,
        socialLinksJson: typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks || []),
        legalPagesJson: typeof legalPages === 'string' ? legalPages : JSON.stringify(legalPages || {}),
        trustTitle: trustTitle || 'Why Travel & Hault?',
        trustSubtext: trustSubtext || '',
      },
      update: {
        phoneNumbersJson: JSON.stringify(phoneNumbers || []),
        email: email || '',
        address: address || '',
        workingHours: workingHours || '',
        gstinNumber: gstinNumber || null,
        socialLinksJson: typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks || []),
        legalPagesJson: typeof legalPages === 'string' ? legalPages : JSON.stringify(legalPages || {}),
        trustTitle: trustTitle || 'Why Travel & Hault?',
        trustSubtext: trustSubtext || '',
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating settings' }, { status: 500 });
  }
}
