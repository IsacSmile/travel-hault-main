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
        phoneNumbersJson: JSON.stringify(['+91 98765 43210']),
        email: 'hello@travelhault.com',
        address: 'Signature Towers, New Delhi, India',
        workingHours: 'Mon - Sat: 9:30 AM - 7:00 PM',
        socialLinksJson: JSON.stringify({ instagram: '', facebook: '', twitter: '' }),
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
        socialLinksJson: JSON.stringify(socialLinks || {}),
        legalPagesJson: JSON.stringify(legalPages || {}),
        trustTitle: trustTitle || 'Why Travel & Hault?',
        trustSubtext: trustSubtext || '',
      },
      update: {
        phoneNumbersJson: JSON.stringify(phoneNumbers || []),
        email: email || '',
        address: address || '',
        workingHours: workingHours || '',
        socialLinksJson: JSON.stringify(socialLinks || {}),
        legalPagesJson: JSON.stringify(legalPages || {}),
        trustTitle: trustTitle || 'Why Travel & Hault?',
        trustSubtext: trustSubtext || '',
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating settings' }, { status: 500 });
  }
}
