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

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: 'Name and either Phone or Email are required' },
        { status: 400 }
      );
    }

    // Verify packageId exists if provided to prevent foreign key error
    let validPackageId: string | null = null;
    if (packageId && typeof packageId === 'string') {
      const existingPkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (existingPkg) {
        validPackageId = packageId;
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        type: type || 'Contact',
        name: String(name).trim(),
        email: email ? String(email).trim() : 'not-provided@guest.com',
        phone: phone ? String(phone).trim() : 'Not provided',
        message: message ? String(message).trim() : '',
        packageId: validPackageId,
        preferredDate: preferredDate ? String(preferredDate) : null,
        numTravelers: numTravelers ? String(numTravelers) : null,
        budgetRange: budgetRange ? String(budgetRange) : null,
        destinationsOfInterest: destinationsOfInterest ? String(destinationsOfInterest) : null,
        status: 'New',
      },
    });

    return NextResponse.json({ success: true, enquiryId: enquiry.id });
  } catch (error: any) {
    console.error('Public Enquiry API submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
