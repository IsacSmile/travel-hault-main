import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      message,
      packageId,
      preferredDate,
      numTravelers,
      budgetRange,
      destinationsOfInterest,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        type: type || 'Contact',
        name,
        email,
        phone,
        message: message || '',
        packageId: packageId || null,
        preferredDate: preferredDate || null,
        numTravelers: numTravelers || null,
        budgetRange: budgetRange || null,
        destinationsOfInterest: destinationsOfInterest || null,
        status: 'New',
      },
    });

    return NextResponse.json({ success: true, enquiryId: enquiry.id });
  } catch (error: any) {
    console.error('Enquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
